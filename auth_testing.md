# RynSpire Auth Testing Playbook

## MongoDB Verification
```
mongosh
use test_database
db.users.find({ role: "admin" }).pretty()
```
Expected: bcrypt hash starts with `$2b$`. Indexes on `users.email` (unique) and `users.id` (unique).

## Auth Endpoints — API Testing

### 1) Login (admin)
```
curl -c cookies.txt -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rynspire.com","password":"Admin@RynSpire2026"}'
```
Expected: 200 OK with user JSON. Cookies file will contain `access_token` and `refresh_token`.

### 2) /me
```
curl -b cookies.txt http://localhost:8001/api/auth/me
```
Expected: 200 OK returning the same user.

### 3) Register
```
curl -c cookies_s.txt -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@rynspire.com","password":"Student@2026"}'
```

### 4) Logout
```
curl -b cookies.txt -X POST http://localhost:8001/api/auth/logout
```

### 5) Bad password (brute-force test)
Run login with wrong password 6 times; 6th attempt returns `429 Too many failed attempts`.

## Booking Test
```
STUDENT_LOGIN=... (login as student, save cookies)
TUTOR_ID=$(curl -s http://localhost:8001/api/tutors | jq -r '.[0].id')
curl -b cookies_s.txt -X POST http://localhost:8001/api/bookings \
  -H "Content-Type: application/json" \
  -d "{\"tutor_id\":\"$TUTOR_ID\",\"subject\":\"mathematics\",\"scheduled_at\":\"2026-03-01T10:00:00Z\"}"
```

## Admin Endpoints
```
curl -b cookies.txt http://localhost:8001/api/admin/stats
curl -b cookies.txt http://localhost:8001/api/admin/users
```

## Seeded credentials (see /app/memory/test_credentials.md)
- admin@rynspire.com / Admin@RynSpire2026
- student@rynspire.com / Student@2026
- <name>.tutor@rynspire.com / Tutor@2026 (6 tutors)
