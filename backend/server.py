from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import io
import csv
import uuid
import hmac
import hashlib
import logging
import smtplib
import asyncio
import bcrypt
import jwt
from email.message import EmailMessage
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

import razorpay
import requests
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, BackgroundTasks
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# ------------------------------------------------------------------
# App / DB / Logger
# ------------------------------------------------------------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="RynSpireEdu API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("rynspireedu")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60
REFRESH_TOKEN_DAYS = 7

Role = Literal["student", "parent", "tutor", "coordinator", "accountant", "admin", "owner"]

# ------------------------------------------------------------------
# Password + JWT helpers (unchanged)
# ------------------------------------------------------------------
def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()

def verify_password(p: str, h: str) -> bool:
    try:
        return bcrypt.checkpw(p.encode(), h.encode())
    except Exception:
        return False

def _jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def create_access_token(user_id: str, email: str, role: str) -> str:
    return jwt.encode({"sub": user_id, "email": email, "role": role,
                       "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
                       "type": "access"}, _jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    return jwt.encode({"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_DAYS),
                       "type": "refresh"}, _jwt_secret(), algorithm=JWT_ALGORITHM)

def _set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none",
                        max_age=ACCESS_TOKEN_MINUTES * 60, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none",
                        max_age=REFRESH_TOKEN_DAYS * 86400, path="/")

def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")

def _sanitize_user(u: dict) -> dict:
    u.pop("password_hash", None); u.pop("_id", None); return u

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        u = await db.users.find_one({"id": payload["sub"]})
        if not u:
            raise HTTPException(status_code=401, detail="User not found")
        return _sanitize_user(u)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(*allowed: str):
    async def _dep(user: dict = Depends(get_current_user)) -> dict:
        if user.get("role") not in allowed:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return _dep

# ------------------------------------------------------------------
# Schemas
# ------------------------------------------------------------------
class RegisterInput(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    role: Role = "student"
    grade: Optional[str] = None
    country: Optional[str] = "Australia"

class LoginInput(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: EmailStr
    role: str
    grade: Optional[str] = None
    country: Optional[str] = None
    avatar: Optional[str] = None
    created_at: str

class DemoBookingIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=25)
    country: str
    city: str
    student_class: str = Field(description="e.g. Year 8, Grade 10, Kindergarten")
    subject: str
    demo_date: str = Field(description="YYYY-MM-DD")
    demo_time: str = Field(description="HH:MM (24h)")
    timezone: Optional[str] = "Australia/Sydney"
    additional_notes: Optional[str] = ""
    currency: Optional[str] = "USD"

class DemoBookingOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: str
    country: str
    city: str
    student_class: str
    subject: str
    demo_date: str
    demo_time: str
    timezone: Optional[str]
    additional_notes: Optional[str]
    status: str
    created_at: str

class CreateOrderIn(BaseModel):
    plan_key: str
    amount: int = Field(gt=0, description="Amount in the smallest currency unit (paise/cents)")
    currency: str = "INR"
    receipt: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = None

class VerifyPaymentIn(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    plan_key: Optional[str] = None
    customer_email: Optional[EmailStr] = None
    customer_name: Optional[str] = None

# ------------------------------------------------------------------
# Email sending via Hostinger SMTP (graceful failure)
# ------------------------------------------------------------------
def _smtp_config():
    return {
        "host": os.environ.get("SMTP_HOST", "smtp.hostinger.com"),
        "port": int(os.environ.get("SMTP_PORT", "587")),
        "username": os.environ.get("SMTP_USERNAME", ""),
        "password": os.environ.get("SMTP_PASSWORD", ""),
        "from_name": os.environ.get("SMTP_FROM_NAME", "RynSpireEdu Care"),
    }

def _send_email_sync(to_addrs: list, subject: str, html: str, reply_to: Optional[str] = None) -> None:
    cfg = _smtp_config()
    if not cfg["password"]:
        logger.warning("SMTP_PASSWORD not set — skipping email send to %s", to_addrs)
        return
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f'{cfg["from_name"]} <{cfg["username"]}>'
    msg["To"] = ", ".join(to_addrs)
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content("This email requires an HTML-capable client.")
    msg.add_alternative(html, subtype="html")
    try:
        with smtplib.SMTP(cfg["host"], cfg["port"], timeout=15) as s:
            s.starttls()
            s.login(cfg["username"], cfg["password"])
            s.send_message(msg)
        logger.info("Email sent to %s (%s)", to_addrs, subject)
    except Exception as e:
        logger.warning("SMTP send failed to %s: %s", to_addrs, e)

async def send_email(to_addrs: list, subject: str, html: str, reply_to: Optional[str] = None):
    try:
        await asyncio.to_thread(_send_email_sync, to_addrs, subject, html, reply_to)
    except Exception as e:
        logger.warning("send_email wrapper error: %s", e)

def _demo_confirmation_html(b: dict) -> str:
    return f"""
    <div style="font-family:Outfit,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1235;">
      <div style="background:#3b1a70;color:#fff;padding:24px 28px;border-radius:14px 14px 0 0;">
        <h1 style="margin:0;font-size:22px;">
          <span style="color:#f5c542;">Ryn</span><span style="color:#c9a0ff;">SpireEdu</span>
        </h1>
        <p style="margin:6px 0 0;opacity:.85;font-size:13px;">Premium 1-to-1 Online Tutoring</p>
      </div>
      <div style="background:#fff;border:1px solid #eee;border-top:0;padding:28px;border-radius:0 0 14px 14px;">
        <h2 style="font-size:20px;margin:0 0 12px;">Hi {b['name']}, your free demo is booked!</h2>
        <p style="line-height:1.6;">Thanks for choosing RynSpireEdu. Here are your booking details:</p>
        <table style="width:100%;border-collapse:collapse;margin:14px 0;font-size:14px;">
          <tr><td style="padding:6px 0;color:#6b7280;">Subject</td><td style="padding:6px 0;"><strong>{b['subject']}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Class</td><td style="padding:6px 0;"><strong>{b['student_class']}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Date</td><td style="padding:6px 0;"><strong>{b['demo_date']}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Time</td><td style="padding:6px 0;"><strong>{b['demo_time']} ({b.get('timezone','Australia/Sydney')})</strong></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Duration</td><td style="padding:6px 0;"><strong>25 minutes</strong></td></tr>
        </table>
        <p style="line-height:1.6;">Our academic coordinator will call/email you before the session with the joining link. If you need to reschedule, just reply to this email.</p>
        <p style="margin-top:22px;">Warm regards,<br/><strong>The RynSpireEdu Team</strong><br/><a href="mailto:care@rynspireedu.com" style="color:#6d28d9;">care@rynspireedu.com</a></p>
      </div>
    </div>
    """

def _demo_admin_html(b: dict) -> str:
    return f"""
    <div style="font-family:Outfit,Arial,sans-serif;max-width:640px;color:#1a1235;">
      <h2>New Demo Booking · {b['name']}</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px;background:#f7f5ff;">Name</td><td style="padding:6px;">{b['name']}</td></tr>
        <tr><td style="padding:6px;background:#f7f5ff;">Email</td><td style="padding:6px;">{b['email']}</td></tr>
        <tr><td style="padding:6px;background:#f7f5ff;">Phone</td><td style="padding:6px;">{b['phone']}</td></tr>
        <tr><td style="padding:6px;background:#f7f5ff;">Country / City</td><td style="padding:6px;">{b['country']} · {b['city']}</td></tr>
        <tr><td style="padding:6px;background:#f7f5ff;">Class</td><td style="padding:6px;">{b['student_class']}</td></tr>
        <tr><td style="padding:6px;background:#f7f5ff;">Subject</td><td style="padding:6px;">{b['subject']}</td></tr>
        <tr><td style="padding:6px;background:#f7f5ff;">Date · Time</td><td style="padding:6px;">{b['demo_date']} at {b['demo_time']} ({b.get('timezone','')})</td></tr>
        <tr><td style="padding:6px;background:#f7f5ff;">Notes</td><td style="padding:6px;">{b.get('additional_notes','') or '(none)'}</td></tr>
        <tr><td style="padding:6px;background:#f7f5ff;">Booking ID</td><td style="padding:6px;font-family:monospace;">{b['id']}</td></tr>
      </table>
    </div>
    """

# ------------------------------------------------------------------
# Brute-force lockout
# ------------------------------------------------------------------
MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

async def _check_lockout(identifier: str):
    doc = await db.login_attempts.find_one({"identifier": identifier})
    if not doc: return
    if doc.get("count", 0) >= MAX_ATTEMPTS:
        locked = doc.get("locked_until")
        if locked and datetime.fromisoformat(locked) > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again later.")

async def _record_failed(identifier: str):
    doc = await db.login_attempts.find_one({"identifier": identifier})
    count = (doc.get("count", 0) + 1) if doc else 1
    update = {"count": count, "updated_at": datetime.now(timezone.utc).isoformat()}
    if count >= MAX_ATTEMPTS:
        update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_MINUTES)).isoformat()
    await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)

async def _clear_failed(identifier: str):
    await db.login_attempts.delete_one({"identifier": identifier})

# ------------------------------------------------------------------
# Auth endpoints
# ------------------------------------------------------------------
@api_router.post("/auth/register", response_model=UserOut)
async def register(payload: RegisterInput, response: Response):
    email = payload.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    uid = str(uuid.uuid4())
    doc = {"id": uid, "name": payload.name.strip(), "email": email,
           "password_hash": hash_password(payload.password), "role": payload.role,
           "grade": payload.grade, "country": payload.country, "avatar": None,
           "created_at": datetime.now(timezone.utc).isoformat()}
    await db.users.insert_one(doc)
    _set_auth_cookies(response, create_access_token(uid, email, payload.role), create_refresh_token(uid))
    return UserOut(**{k: v for k, v in doc.items() if k != "password_hash"})

@api_router.post("/auth/login", response_model=UserOut)
async def login(payload: LoginInput, request: Request, response: Response):
    email = payload.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    await _check_lockout(identifier)
    u = await db.users.find_one({"email": email})
    if not u or not verify_password(payload.password, u["password_hash"]):
        await _record_failed(identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await _clear_failed(identifier)
    _set_auth_cookies(response, create_access_token(u["id"], email, u["role"]), create_refresh_token(u["id"]))
    return UserOut(**{k: v for k, v in u.items() if k not in ("password_hash", "_id")})

@api_router.post("/auth/logout")
async def logout(response: Response):
    _clear_auth_cookies(response); return {"ok": True}

@api_router.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(**user)

# ------------------------------------------------------------------
# Public content
# ------------------------------------------------------------------
SUBJECTS = [
    {"key": "mathematics", "name": "Mathematics"},
    {"key": "english", "name": "English"},
    {"key": "science", "name": "Science"},
    {"key": "physics", "name": "Physics"},
    {"key": "chemistry", "name": "Chemistry"},
    {"key": "biology", "name": "Biology"},
    {"key": "computer-science", "name": "Computer Science"},
    {"key": "coding", "name": "Coding & AI"},
    {"key": "economics", "name": "Economics"},
    {"key": "ielts", "name": "IELTS"},
    {"key": "pte", "name": "PTE"},
    {"key": "sat", "name": "SAT"},
]

@api_router.get("/")
async def root():
    return {"service": "RynSpireEdu", "status": "ok"}

@api_router.get("/subjects")
async def list_subjects():
    return SUBJECTS

# ------------------------------------------------------------------
# Geo-detect for currency (best-effort)
# ------------------------------------------------------------------
@api_router.get("/geo")
async def geo(request: Request):
    # Try Cloudflare header first
    cc = request.headers.get("cf-ipcountry") or request.headers.get("CF-IPCountry")
    if cc and cc != "XX":
        return {"country": cc.upper(), "source": "cf"}
    # Fallback to X-Forwarded-For -> ipapi.co lookup
    xff = request.headers.get("x-forwarded-for", "")
    ip = xff.split(",")[0].strip() if xff else (request.client.host if request.client else "")
    if not ip or ip.startswith(("10.", "127.", "192.168.")):
        return {"country": None, "source": "unknown"}
    try:
        import urllib.request
        req = urllib.request.Request(f"https://ipapi.co/{ip}/country/", headers={"User-Agent": "RynSpireEdu/1.0"})
        with urllib.request.urlopen(req, timeout=3) as r:
            code = r.read().decode().strip()
            if code and len(code) == 2:
                return {"country": code.upper(), "source": "ipapi"}
    except Exception as e:
        logger.info("geo lookup failed: %s", e)
    return {"country": None, "source": "unknown"}

# ------------------------------------------------------------------
# Google Sheets sync (via Apps Script Web App webhook, graceful failure)
# ------------------------------------------------------------------
def _send_to_google_sheet_sync(doc: dict) -> None:
    url = os.environ.get("GOOGLE_SHEETS_WEBHOOK_URL", "")
    if not url:
        logger.warning("GOOGLE_SHEETS_WEBHOOK_URL not set — skipping sheet sync")
        return
    try:
        requests.post(url, json=doc, timeout=10)
    except Exception:
        logger.exception("Failed to sync demo booking to Google Sheet")

# ------------------------------------------------------------------
# Demo bookings
# ------------------------------------------------------------------
@api_router.post("/demos", response_model=DemoBookingOut)
async def create_demo(payload: DemoBookingIn, background: BackgroundTasks):
    bid = str(uuid.uuid4())
    doc = {
        "id": bid,
        "name": payload.name.strip(),
        "email": payload.email.lower().strip(),
        "phone": payload.phone.strip(),
        "country": payload.country,
        "city": payload.city,
        "student_class": payload.student_class,
        "subject": payload.subject,
        "demo_date": payload.demo_date,
        "demo_time": payload.demo_time,
        "timezone": payload.timezone,
        "additional_notes": payload.additional_notes or "",
        "currency": payload.currency,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.demo_bookings.insert_one(doc)

    care = os.environ.get("CARE_EMAIL", "care@rynspireedu.com")
    background.add_task(_send_email_sync, [doc["email"]], "Your RynSpireEdu Free Demo is Confirmed", _demo_confirmation_html(doc), care)
    background.add_task(_send_email_sync, [care], f"[New Demo] {doc['name']} · {doc['subject']} · {doc['demo_date']}", _demo_admin_html(doc), doc["email"])
    background.add_task(_send_to_google_sheet_sync, doc)

    return DemoBookingOut(**{k: v for k, v in doc.items() if k != "_id" and k != "currency"})

@api_router.get("/admin/demos", response_model=List[DemoBookingOut])
async def list_demos(_: dict = Depends(require_role("admin", "owner", "coordinator"))):
    rows = await db.demo_bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return [DemoBookingOut(**{k: v for k, v in r.items() if k != "currency"}) for r in rows]

@api_router.get("/admin/demos/export.csv")
async def export_demos_csv(_: dict = Depends(require_role("admin", "owner", "coordinator"))):
    rows = await db.demo_bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    buf = io.StringIO()
    fields = ["id", "created_at", "name", "email", "phone", "country", "city",
              "student_class", "subject", "demo_date", "demo_time", "timezone",
              "additional_notes", "status"]
    w = csv.DictWriter(buf, fieldnames=fields)
    w.writeheader()
    for r in rows:
        w.writerow({k: r.get(k, "") for k in fields})
    buf.seek(0)
    return StreamingResponse(iter([buf.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": 'attachment; filename="rynspireedu_demos.csv"'})

# ------------------------------------------------------------------
# Contact / Care email
# ------------------------------------------------------------------
class ContactIn(BaseModel):
    name: str
    email: EmailStr
    message: str

@api_router.post("/contact")
async def contact(payload: ContactIn, background: BackgroundTasks):
    care = os.environ.get("CARE_EMAIL", "care@rynspireedu.com")
    user_html = f"""
    <div style="font-family:Outfit,Arial,sans-serif;max-width:520px;color:#1a1235;">
      <h2 style="color:#3b1a70;">Thanks for reaching out to <span style="color:#f5c542;">Ryn</span><span style="color:#7c3aed;">SpireEdu</span></h2>
      <p>Hi {payload.name},</p>
      <p>We've received your message and one of our team will reply within <strong>24 hours</strong>.</p>
      <p style="color:#6b7280;font-size:13px;">— RynSpireEdu · Best Online Tutoring Services</p>
    </div>
    """
    admin_html = f"<h3>New Care Message</h3><p><b>From:</b> {payload.name} &lt;{payload.email}&gt;</p><p>{payload.message}</p>"
    background.add_task(_send_email_sync, [payload.email], "Thanks for contacting RynSpireEdu", user_html, care)
    background.add_task(_send_email_sync, [care], f"[Care] {payload.name}", admin_html, payload.email)
    await db.contact_messages.insert_one({
        "id": str(uuid.uuid4()), "name": payload.name, "email": payload.email.lower(),
        "message": payload.message, "created_at": datetime.now(timezone.utc).isoformat()
    })
    return {"ok": True}

# ------------------------------------------------------------------
# Razorpay: create order + verify payment
# ------------------------------------------------------------------
def _razorpay_client() -> razorpay.Client:
    key = os.environ.get("RAZORPAY_KEY_ID", "")
    secret = os.environ.get("RAZORPAY_KEY_SECRET", "")
    if not key or not secret:
        raise HTTPException(status_code=500, detail="Razorpay is not configured")
    return razorpay.Client(auth=(key, secret))

@api_router.get("/payments/config")
async def payments_config():
    return {"key_id": os.environ.get("RAZORPAY_KEY_ID", "")}

@api_router.post("/payments/create-order")
async def create_order(payload: CreateOrderIn):
    if payload.amount < 100:
        raise HTTPException(status_code=400, detail="Amount must be >= 100 minor units")
    rc = _razorpay_client()
    try:
        receipt = payload.receipt or f"rcpt_{uuid.uuid4().hex[:12]}"
        order = rc.order.create({
            "amount": int(payload.amount),
            "currency": payload.currency.upper(),
            "receipt": receipt,
            "notes": {
                "plan_key": payload.plan_key,
                "customer_name": payload.customer_name or "",
                "customer_email": payload.customer_email or "",
                "customer_phone": payload.customer_phone or "",
            },
            "payment_capture": 1,
        })
        await db.payment_orders.insert_one({
            "id": str(uuid.uuid4()), "order_id": order["id"], "plan_key": payload.plan_key,
            "amount": order["amount"], "currency": order["currency"], "receipt": receipt,
            "customer_email": payload.customer_email, "customer_name": payload.customer_name,
            "status": "created", "created_at": datetime.now(timezone.utc).isoformat(),
        })
        return {"order_id": order["id"], "amount": order["amount"], "currency": order["currency"],
                "key_id": os.environ.get("RAZORPAY_KEY_ID", "")}
    except razorpay.errors.BadRequestError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception("Razorpay create_order failed")
        raise HTTPException(status_code=500, detail=f"Order creation failed: {e}")

@api_router.post("/payments/verify")
async def verify_payment(payload: VerifyPaymentIn, background: BackgroundTasks):
    secret = os.environ.get("RAZORPAY_KEY_SECRET", "")
    if not secret:
        raise HTTPException(status_code=500, detail="Razorpay is not configured")
    body = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode()
    expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, payload.razorpay_signature):
        await db.payment_orders.update_one({"order_id": payload.razorpay_order_id},
                                           {"$set": {"status": "signature_mismatch"}})
        raise HTTPException(status_code=400, detail="Invalid signature")
    await db.payment_orders.update_one(
        {"order_id": payload.razorpay_order_id},
        {"$set": {"status": "paid", "payment_id": payload.razorpay_payment_id,
                  "paid_at": datetime.now(timezone.utc).isoformat()}}
    )
    if payload.customer_email:
        care = os.environ.get("CARE_EMAIL", "care@rynspireedu.com")
        html = f"""
        <div style="font-family:Outfit,Arial,sans-serif;max-width:520px;">
          <h2 style="color:#3b1a70;">Payment received</h2>
          <p>Hi {payload.customer_name or ''},</p>
          <p>Thanks — your payment for <strong>{payload.plan_key or 'RynSpireEdu Plan'}</strong> was successful.</p>
          <p>Order ID: <code>{payload.razorpay_order_id}</code><br/>Payment ID: <code>{payload.razorpay_payment_id}</code></p>
          <p>Our team will reach out shortly to onboard you.</p>
        </div>
        """
        background.add_task(_send_email_sync, [payload.customer_email], "Payment received · RynSpireEdu", html, care)
    return {"ok": True, "status": "paid"}

# ------------------------------------------------------------------
# Admin
# ------------------------------------------------------------------
@api_router.get("/admin/users", response_model=List[UserOut])
async def admin_list_users(_: dict = Depends(require_role("admin", "owner"))):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).to_list(1000)
    return [UserOut(**u) for u in users]

@api_router.get("/admin/stats")
async def admin_stats(_: dict = Depends(require_role("admin", "owner"))):
    total_users = await db.users.count_documents({})
    tutors = await db.users.count_documents({"role": "tutor"})
    demos = await db.demo_bookings.count_documents({})
    demos_today = await db.demo_bookings.count_documents({
        "demo_date": datetime.now(timezone.utc).strftime("%Y-%m-%d")
    })
    paid = await db.payment_orders.count_documents({"status": "paid"})
    return {"users": {"total": total_users, "tutors": tutors},
            "demos": {"total": demos, "today": demos_today},
            "payments": {"paid": paid}}

# ------------------------------------------------------------------
# Startup
# ------------------------------------------------------------------
async def _seed_admin():
    email = os.environ.get("ADMIN_EMAIL", "admin@rynspireedu.com").lower()
    pwd = os.environ.get("ADMIN_PASSWORD", "Admin@RynSpire2026")
    existing = await db.users.find_one({"email": email})
    if not existing:
        await db.users.insert_one({"id": str(uuid.uuid4()), "name": "RynSpireEdu Admin",
                                   "email": email, "password_hash": hash_password(pwd),
                                   "role": "admin", "country": "Australia", "avatar": None,
                                   "created_at": datetime.now(timezone.utc).isoformat()})
        logger.info("Seeded admin: %s", email)
    elif not verify_password(pwd, existing["password_hash"]):
        await db.users.update_one({"email": email}, {"$set": {"password_hash": hash_password(pwd)}})

@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.demo_bookings.create_index("created_at")
    await db.demo_bookings.create_index("demo_date")
    await db.payment_orders.create_index("order_id", unique=True)
    await db.login_attempts.create_index("identifier")
    await _seed_admin()

@app.on_event("shutdown")
async def on_shutdown():
    client.close()

# ------------------------------------------------------------------
# CORS
# ------------------------------------------------------------------
app.include_router(api_router)

_cors_env = os.environ.get("CORS_ORIGINS", "").strip()
_origins = [o.strip() for o in _cors_env.split(",") if o.strip()] if _cors_env else [
    os.environ.get("FRONTEND_URL", "http://localhost:3000"), "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
