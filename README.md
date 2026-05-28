# Pragyan

Pragyan is an AI-powered career guidance platform that combines assessment, roadmap generation, curated learning resources, adaptive planning, and progress tracking in one product.

## What it does

<<<<<<< HEAD
- Career assessment and matching
- Personalized learning roadmaps with day-wise sections
- Trusted learning resources for docs, video, practice, and mini-projects
- OAuth authentication with Google and GitHub
- Profile avatars and account linking
- AI mentor inside roadmaps
- Smart daily planner with adaptive difficulty
- Quiz performance feedback loop for recovery, growth, and stretch modes
- Progress tracking with XP, streaks, and project unlocks
- Roadmap search backed by MongoDB text search
=======
![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

>>>>>>> 1773343e56ce38dad559654f23fa6a799bdece19

## Tech Stack

- Frontend: React 18, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: MongoDB with Prisma
- Auth: Passport, JWT, express-session
- AI: Gemini, Groq, and local fallback routing

## Repository Layout

```text
Pragyan/
├── frontend/    # React app
├── backend/     # Express API
├── README.md
└── package.json
```

## Prerequisites

- Node.js 18 or newer
- npm or pnpm
- MongoDB connection string
- Google OAuth credentials
- GitHub OAuth credentials
- Optional: Gemini API key

## Environment Setup

Create `backend/.env` with values similar to:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/Pragyan?retryWrites=true&w=majority"

JWT_SECRET="change_this_to_a_secure_random_string"
JWT_EXPIRY="7d"
JWT_REFRESH_SECRET="change_this_too"
JWT_REFRESH_EXPIRY="30d"

CORS_ORIGINS=http://localhost:5173

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

AI_PROVIDER=gemini
GEMINI_API_KEY="your_gemini_api_key"
GEMINI_MODEL="gemini-1.5-flash"
```

## Install

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Database Setup

```bash
cd backend
npx prisma generate
npx prisma db push
npm run seed
```

If Prisma generation is blocked on Windows by a DLL lock, rerun with:

```bash
set PRISMA_GENERATE_NO_ENGINE=1
npx prisma generate
```

## Run Locally

Start the backend first:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Frontend runs on `http://127.0.0.1:5173` and proxies API calls to `http://localhost:5000`.

## Build

```bash
cd backend
npm run build

cd ../frontend
npm run build
```

## Key Backend Scripts

- `npm run dev` - start the API in development mode
- `npm run build` - compile TypeScript
- `npm run prisma:generate` - regenerate Prisma client
- `npm run prisma:migrate` - run Prisma migrations
- `npm run seed` - seed sample data
- `npm run db:create-roadmap-index` - create the MongoDB roadmap search index

## Key Features

### Authentication

- Google OAuth
- GitHub OAuth
- Provider linking for a single account
- Session and JWT handling
- Profile avatar upload and persistence

### Learning System

- AI-generated roadmap sections by domain
- Daily learning topics and resource cards
- Trusted resource catalog for official docs, videos, practice, and projects
- AI mentor for roadmap-specific help
- Smart daily planner with adaptive mode support
- Project unlocks when the learner is ready

### Adaptive Learning

- Recovery mode for weak quiz performance or low momentum
- Growth mode for balanced progress
- Stretch mode for strong streaks and high quiz scores
- Quiz scores are stored and reused to tune future recommendations

### Productivity and Progress

- XP and streak tracking
- Assessment-to-roadmap handoff
- Roadmap search and browsing
- Progress history for learning resources

## Troubleshooting

- If the frontend shows proxy errors like `ECONNREFUSED`, start the backend on port `5000`.
- If Prisma client types are stale after a schema change, rerun `npx prisma generate`.
- If OAuth does not redirect correctly, confirm the provider callback URLs and env vars.

## License

<<<<<<< HEAD
See [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for project attribution and licensing notes.
=======
# Expected: 5+ tests pass ✅
```

### Run Unit Tests

```bash
cd backend
npm run test
```

---

## 🔐 Security

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing (bcryptjs)
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ Input validation (Zod)
- ✅ Environment variables protected
- ✅ Error handling (no sensitive leaks)

---

## 🐛 Troubleshooting

### MongoDB Connection Failed

```
Error: Connection refused
```

**Fix**:
1. Check `DATABASE_URL` in `backend/.env`
2. Verify IP whitelist in MongoDB Atlas (or use 0.0.0.0/0)
3. Ensure cluster is running (not paused)
4. Test with `mongosh`:
   ```bash
   mongosh "mongodb+srv://user:pass@cluster.mongodb.net/Pragyan"
   ```

### Prisma Client Error

```
EPERM: operation not permitted
```

**Fix** (Windows):
```bash
# Stop Node processes, then regenerate
npx prisma generate
```

### Frontend Blank Page

**Fix**:
1. Verify backend on port 5000: `curl http://localhost:5000/health`
2. Check `CORS_ORIGINS` includes `http://localhost:5173`
3. Clear browser cache, reload
4. Check browser console for errors

---

## 📊 Performance Metrics

- Frontend Bundle: ~900KB (gzipped)
- API Response: <200ms typical
- Database Queries: Optimized with indexes
- Caching: Redis + in-memory fallback

---

## 🚢 Deployment

### MongoDB Atlas Setup

1. Create cluster: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP (0.0.0.0/0 for dev, specific IPs for prod)
4. Get connection URI
5. Set as `DATABASE_URL` in `backend/.env`

### Required Environment Variables

- `DATABASE_URL` - MongoDB URI
- `JWT_SECRET` - Random secure string
- `JWT_REFRESH_SECRET` - Another random string
- `GEMINI_API_KEY` - From Google AI
- `CORS_ORIGINS` - Your domain(s)
- `NODE_ENV` - "production"

### Docker

```bash
docker build -t pragyan-backend backend/
docker run -p 5000:5000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  pragyan-backend
```

---

## 📞 Support & Contributing

### Report Bugs

Include:
- Steps to reproduce
- Expected vs actual behavior
- Environment (Node version, OS)
- Error messages/logs

### Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/xyz`
3. Commit: `git commit -m 'Add xyz'`
4. Push: `git push origin feature/xyz`
5. Open Pull Request

---

## 📜 License

MIT License - see LICENSE file for details.

---

## 🎉 Acknowledgments

- MongoDB for database infrastructure
- Google AI for Gemini API
- React and Node.js communities
- All contributors

---

## 🗺️ Future Roadmap

- [ ] Video learning integration
- [ ] Mobile app (React Native)
- [ ] Live mentoring
- [ ] Portfolio builder
- [ ] Interview prep
- [ ] Blockchain credentials
- [ ] Community features

---

**Made with ❤️ for Career Guidance**


>>>>>>> 1773343e56ce38dad559654f23fa6a799bdece19
