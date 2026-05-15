# Pragyan — Production Deployment Guide

## Architecture Overview

```
Frontend (Vite + React + TypeScript)
    ↓  HTTPS
Backend (Express + TypeScript)
    ↓  Prisma ORM
MongoDB Atlas (Cloud Database)
```

| Layer    | Technology       | Recommended Host     |
|----------|-----------------|----------------------|
| Frontend | Vite + React     | Vercel               |
| Backend  | Express.js       | Render / Railway     |
| Database | MongoDB Atlas    | MongoDB Atlas Free   |

---

## 1. MongoDB Atlas Setup

1. Create an account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a **Free M0** cluster (or higher)
3. Under **Database Access** → Add a user with password auth
4. Under **Network Access** → Allow `0.0.0.0/0` (all IPs) for Railway/Render
5. Go to **Connect** → **Drivers** → copy the connection string:
   ```
   mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
6. Replace `<dbname>` with `Pragyan`

---

## 2. Backend Deployment (Render)

### Environment Variables (set in Render dashboard)

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/Pragyan?retryWrites=true&w=majority
JWT_SECRET=<generate-64-char-random-string>
JWT_REFRESH_SECRET=<generate-different-64-char-random-string>
JWT_EXPIRY=7d
JWT_REFRESH_EXPIRY=30d
FRONTEND_URL=https://<your-vercel-app>.vercel.app
CORS_ORIGINS=https://<your-vercel-app>.vercel.app
BCRYPT_ROUNDS=12
```

### Render Build & Start Commands

| Setting       | Value                                        |
|--------------|----------------------------------------------|
| Build Command | `npm install && npm run prisma:generate && npm run build` |
| Start Command | `npm start`                                  |
| Root Directory | `backend`                                   |

### Alternative: Railway

Same env vars. Set **Root Directory** to `backend` and Railway auto-detects the start command from `package.json`.

---

## 3. Frontend Deployment (Vercel)

### Environment Variables (set in Vercel Project Settings)

```env
VITE_API_BASE_URL=https://<your-render-backend>.onrender.com
```

### Vercel Setup Steps

1. Connect GitHub repo to Vercel
2. **Framework**: Vite
3. **Root Directory**: `frontend`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. Add the `VITE_API_BASE_URL` env var
7. Deploy → redeploy after adding env vars

### vercel.json (create in `/frontend` if needed for SPA routing)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 4. Generating Secure Secrets

Use Node.js to generate cryptographically secure secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run twice — use one for `JWT_SECRET`, one for `JWT_REFRESH_SECRET`.

---

## 5. Post-Deployment Checklist

- [ ] Backend `/health` returns `{ "status": "OK" }`
- [ ] CORS allows only the Vercel domain
- [ ] Login and registration work end-to-end
- [ ] Assessment save persists to MongoDB
- [ ] Roadmap progress saves and reloads on refresh
- [ ] Admin dashboard accessible with ADMIN role user
- [ ] XP increments on task completion
- [ ] Streak tracking works (test on consecutive days)
- [ ] Token refresh works (wait for access token expiry)

---

## 6. Running Locally

### Prerequisites
- Node.js 18+
- MongoDB running locally (or Atlas URL)
- pnpm / npm

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your local MongoDB URL
npm install
npm run prisma:generate
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5000
npm install
npm run dev
```

### Docker MongoDB (optional local)
```bash
cd backend
docker-compose -f docker-compose.mongo.yml up -d
```

---

## 7. Creating Admin User

After deploying, promote a user to ADMIN:

**Option A — Via API (curl)**
```bash
# 1. Get user ID from admin dashboard or MongoDB
# 2. Call the admin endpoint with an existing ADMIN token:
curl -X PATCH https://<backend>/api/admin/users/<userId>/role \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"role":"ADMIN"}'
```

**Option B — Direct MongoDB Atlas**
1. Open Atlas → Collections → `User`
2. Find your user document
3. Change `role` from `"USER"` to `"ADMIN"`

---

## 8. Security Checklist for Production

- [ ] JWT secrets are ≥64 chars and unique
- [ ] CORS restricted to known frontend domains only
- [ ] `NODE_ENV=production` is set
- [ ] MongoDB Atlas network access restricted to backend IP range (optional, for max security)
- [ ] No `.env` files committed to git (check `.gitignore`)
- [ ] Rate limiting is active (`15 min / 100 req` general, `15 min / 5 req` auth)
- [ ] Helmet.js security headers enabled
- [ ] HTTPS enforced by hosting platform

---

## 9. API Base URLs Summary

| Environment  | Frontend URL                              | Backend URL                              |
|-------------|-------------------------------------------|------------------------------------------|
| Local Dev    | `http://localhost:5173`                   | `http://localhost:5000`                  |
| Production   | `https://<app>.vercel.app`                | `https://<app>.onrender.com`             |

---

## 10. Health Check Endpoint

```
GET /health
→ { "status": "OK", "timestamp": "2026-05-14T..." }
```

Use this in Render's health check configuration to prevent cold starts.
