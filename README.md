# Rank1 Infotech Dashboard

## Free development login
This build uses DummyJSON for authentication and local browser data for dashboard operations, so the project can run without a Node/.NET backend during UI development.

Demo credentials:
- Username: `emilys`
- Password: `emilyspass`
- Tenant/Society Code: `DLF-PARK-PLACE` (currently a UI field; DummyJSON does not validate it)

DummyJSON returns a JWT access token and refresh token from `/auth/login`. The app stores the access token, validates it with `/auth/me` on page reload, adds it as a Bearer token for the auth check, and redirects to login when a protected call returns 401.

## Run
```cmd
npm install
npm run dev
```

Open the Vite URL, usually `http://localhost:5173`.

## Switch to your ASP.NET Core API later
Create/update `.env.local`:
```env
VITE_AUTH_MODE=real
VITE_API_BASE_URL=https://localhost:7001/api
```
Then change the login payload/response mapping in `src/main.jsx` and endpoint paths in `src/api/client.js` to match your real DTOs/controllers.
