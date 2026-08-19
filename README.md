# RynSpireEdu

Live, 1-to-1 online tutoring platform for K-12 students across Australia, New Zealand, the United States and Canada — a brand of SpireEdu Services.

**Live site:** https://rynspireedu.com

## Stack

- **Frontend:** React + Vite (`frontend-new/`)
- **Backend:** Python FastAPI (`backend/server.py`)
- **Database:** MongoDB Atlas
- **Payments:** Razorpay
- **Email:** Brevo (SMTP)
- **Hosting:** Google Cloud Run (single container serving both the API and the built frontend)

## How it's deployed

The `Dockerfile` at the repo root builds one container that:
1. Installs backend dependencies from `backend/requirements-prod.txt`
2. Serves the pre-built frontend from `backend/static/` (this is the output of `npm run build` in `frontend-new/`, copied in before each deploy)
3. Runs the FastAPI app, which serves both `/api/*` routes and the website itself

Whenever the frontend changes, `frontend-new` must be rebuilt (`npm run build`) and the output copied into `backend/static/` before pushing, so the deployed container serves the latest version.

## Local development

**Backend:**
```bash
cd backend
pip install -r requirements-prod.txt
uvicorn server:app --reload
```

**Frontend:**
```bash
cd frontend-new
npm install
npm run dev
```

## Environment variables (backend)

`MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_NAME`, `CARE_EMAIL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `GOOGLE_SHEETS_WEBHOOK_URL`, `FRONTEND_URL`, `CORS_ORIGINS`
