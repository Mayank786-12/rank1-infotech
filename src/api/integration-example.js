/*
API CONTRACT — matches backend/ (Node/Express) exactly.

Base URL comes from VITE_API_BASE_URL in .env.local, e.g.
http://localhost:4000/api

All routes below except /auth/login require:
  Authorization: Bearer <accessToken>
client.js attaches this automatically once you're logged in.

------------------------------------------------------------
POST /auth/login
body:   { "adminId": "admin", "password": "Rank1@2026", "tenantCode": "DLF-PARK-PLACE" }
200:    { "accessToken": "...", "user": { "id", "adminId", "name", "role", "tenantCode" } }
401:    { "message": "Invalid Admin ID, password, or tenant code." }

GET /auth/me
200:    { "user": { ...same claims as above... } }
401:    token missing/expired/invalid

POST /auth/logout
200:    { "message": "Logged out." }

------------------------------------------------------------
GET /dashboard/summary
200:    {
          "totalCollection": number,
          "totalOutstanding": number,
          "overdueAmount": number,
          "collectionEfficiency": "95.70%",
          "categoryBreakdown": [{ "name": "Electricity", "value": number }, ...],
          "paymentModeBreakdown": [{ "name": "UPI", "value": number }, ...]
        }

------------------------------------------------------------
GET /flats                      -> [{ flat, resident, phone, email, bill, due, advance, category }, ...]
GET /flats/search?flat=A-102    -> single flat object (404 if not found)
GET /flats/{flatNo}             -> single flat object
GET /flats/{flatNo}/closing     -> { flat, closingBalance }
POST /flats/advance
  body: { "flat": "A-102", "amount": 500 }
  200:  updated flat object

------------------------------------------------------------
POST /bills/generate
  body: { "flat": "A-102", "e": 500, "m": 1000, "ev": 0, "road": 0, "other": 0 }
       (e/m/ev/road/other are line-item amounts; the API adds the flat's
       existing due, subtracts its advance, and floors at 0)
  200:  { "bill": { id, flat, resident, amount, date }, "resident": <updated flat> }
GET /bills -> list of generated bills

------------------------------------------------------------
POST /payments
  body: { "flat": "A-102", "amount": 2500, "mode": "UPI" }
  200:  { "payment": { id, date, flat, resident, category, amount, mode, status }, "resident": <updated flat> }
GET /payments             -> full payment history
GET /payments?status=Success

------------------------------------------------------------
GET /dues/overdue -> flats where due > 0

------------------------------------------------------------
GET /reports/billing -> text/csv download

------------------------------------------------------------
SWAPPING IN A DIFFERENT BACKEND (e.g. your .NET Core API):
- Match this exact contract, OR
- Edit the field/endpoint names in src/api/client.js and the handlers in
  src/main.jsx (saveBill, receive, advance) to match your DTOs instead.

SECURITY NOTES (already applied in backend/, keep them if you swap backends):
- Passwords are bcrypt-hashed, never compared as plain text.
- The same "invalid credentials" message is returned whether the ID or the
  password was wrong, so a client can't tell which one failed.
- Every write (bill amount, payment amount, advance) is recalculated
  server-side from the stored due/advance — never trust amounts sent from the browser.
- JWTs are verified server-side on every protected route via requireAuth middleware.
*/
