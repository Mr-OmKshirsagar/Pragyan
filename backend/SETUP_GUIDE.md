# Pragyan Backend - Complete Setup & Deployment Guide

## 📋 Table of Contents

1. [Development Setup](#development-setup)
2. [Project Structure Explained](#project-structure-explained)
3. [Database Setup](#database-setup)
4. [Running Locally](#running-locally)
5. [Production Deployment](#production-deployment)
6. [Docker Setup](#docker-setup)
7. [Troubleshooting](#troubleshooting)

---

## Development Setup

### Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# Check PostgreSQL version (need 14+)
psql --version
```

### Step 1: Clone & Install

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# Verify installation
npm list
```

### Step 2: Environment Configuration

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Minimal .env for development**:
```
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/pragyan_dev"
JWT_SECRET="dev_jwt_secret_key_12345678"
JWT_REFRESH_SECRET="dev_refresh_secret_key_12345678"
FRONTEND_URL="http://localhost:5173"
```

### Step 3: Database Setup

#### Option A: PostgreSQL Local Installation

**On Windows**:
```bash
# Download from postgresql.org and install
# During installation, remember the password for postgres user

# Create database
psql -U postgres -c "CREATE DATABASE pragyan_dev;"

# Verify connection
psql -U postgres -d pragyan_dev
```

**On macOS**:
```bash
# Install via Homebrew
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Create database
createdb pragyan_dev
```

**On Linux**:
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb pragyan_dev
```

#### Option B: Docker PostgreSQL

```bash
# Pull and run PostgreSQL in Docker
docker run --name pragyan-db \\
  -e POSTGRES_PASSWORD=password \\
  -e POSTGRES_DB=pragyan_dev \\
  -p 5432:5432 \\
  -d postgres:14-alpine

# Verify container is running
docker ps
```

### Step 4: Generate Prisma Client

```bash
npm run prisma:generate
```

### Step 5: Run Database Migrations

```bash
# Create migrations based on schema
npm run prisma:migrate

# Follow prompts:
# - Create a new migration? → Yes
# - Name: "init" (or any descriptive name)
# - Create migration? → Yes
```

### Step 6: Seed Database

```bash
# Populate with initial data
npm run seed

# Expected output:
# ✓ Admin user created
# ✓ Sample users created
# ✓ 20 roadmaps created
# ✓ Weeks, days, and tasks created
# ✓ 5 assessment questions created
# ✅ Database seeding completed successfully!
```

### Step 7: Start Development Server

```bash
npm run dev

# Output:
# ╔══════════════════════════════════════╗
# ║   🚀 Pragyan Backend Server Running  ║
# ║   Environment: DEVELOPMENT           ║
# ║   Port: 5000                         ║
# ║   API Base: http://localhost:5000    ║
# ╚══════════════════════════════════════╝
```

✅ **Server is now running!** Visit `http://localhost:5000/health`

---

## Project Structure Explained

```
backend/
│
├── src/
│   ├── controllers/          # HTTP request handlers
│   │   ├── auth.ts
│   │   ├── roadmap.ts
│   │   ├── progress.ts
│   │   ├── assessment.ts
│   │   └── ai-recommendation.ts
│   │
│   ├── services/             # Business logic layer
│   │   ├── auth.ts          # User authentication
│   │   ├── roadmap.ts       # Roadmap CRUD
│   │   ├── progress.ts      # Progress tracking
│   │   ├── assessment.ts    # Assessment logic
│   │   └── ai-recommendation.ts  # Career matching
│   │
│   ├── routes/              # API endpoints
│   │   ├── auth.ts
│   │   ├── roadmap.ts
│   │   ├── progress.ts
│   │   ├── assessment.ts
│   │   └── ai.ts
│   │
│   ├── middleware/          # Express middleware
│   │   ├── errorHandler.ts  # Error handling
│   │   ├── auth.ts          # JWT verification
│   │   └── validator.ts     # Input validation
│   │
│   ├── validators/          # Zod schemas
│   │   ├── auth.ts
│   │   └── roadmap.ts
│   │
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   │
│   ├── config/              # Configuration
│   │   └── env.ts           # Environment variables
│   │
│   ├── utils/               # Utility functions
│   │   ├── jwt.ts           # JWT token generation
│   │   ├── password.ts      # Password hashing
│   │   ├── errors.ts        # Custom errors
│   │   └── response.ts      # Response formatting
│   │
│   ├── lib/                 # External libraries
│   │   └── prisma.ts        # Prisma client
│   │
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data script
│
├── dist/                    # Compiled JavaScript (generated)
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── .env                     # Environment variables
├── .env.example             # Example env
└── README.md                # Documentation
```

### Architecture Pattern

```
Request → Router → Controller → Service → Database
                          ↓
                    Validation, Business Logic
                          ↓
                       Response
```

---

## Database Setup

### Database Schema Overview

#### Users Table
```sql
SELECT * FROM "User";

-- Columns:
-- id (String, PK)
-- fullName (String)
-- email (String, UNIQUE)
-- password (String)
-- role (Enum: USER, ADMIN)
-- xp (Int, default: 0)
-- streak (Int, default: 0)
-- createdAt (DateTime)
-- updatedAt (DateTime)
```

#### Roadmaps Table
```sql
SELECT * FROM "Roadmap";

-- Columns:
-- id (String, PK)
-- title (String)
-- category (String)
-- description (String)
-- level (String: beginner, intermediate, advanced, expert)
-- duration (String)
-- tags (String[], array)
-- estimatedHours (Int)
```

#### UserProgress Table
```sql
SELECT * FROM "UserProgress";

-- Tracks user progress in each roadmap
-- Unique constraint: userId + roadmapId
```

### Useful Prisma Commands

```bash
# Open Prisma Studio (GUI database explorer)
npm run prisma:studio
# Opens at: http://localhost:5555

# View database schema
npx prisma studio

# Format schema
npx prisma format

# Validate schema
npx prisma validate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Show migration history
npx prisma migrate history
```

### Accessing Database Directly

```bash
# Connect to PostgreSQL
psql -U postgres -d pragyan_dev

# Common queries
\dt                    # List all tables
\d "User"             # Describe User table
SELECT * FROM "User"; # Query users

# Exit
\q
```

---

## Running Locally

### Development Mode

```bash
# Start with hot reload
npm run dev

# Logs show:
# - Database queries (in dev)
# - Request/response timing
# - Errors with stack traces
```

### Production Build

```bash
# Compile TypeScript
npm run build

# Output in dist/ folder
# Can be deployed to production

# Run compiled version
npm start

# Or with Node directly
node dist/server.js
```

### Testing Endpoints

#### 1. Health Check
```bash
curl http://localhost:5000/health

# Response:
# {"status":"OK","timestamp":"2024-01-20T..."}
```

#### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "Test123"
  }'
```

#### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "Test123"
  }'

# Save the accessToken from response
```

#### 4. Protected Endpoint
```bash
curl -X GET http://localhost:5000/api/auth/me \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Production Deployment

### Pre-deployment Checklist

- [ ] Set `NODE_ENV=production` in .env
- [ ] Generate new strong JWT secrets
- [ ] Configure PostgreSQL production database
- [ ] Set proper `FRONTEND_URL`
- [ ] Enable HTTPS/SSL
- [ ] Setup environment variables on hosting
- [ ] Run production build
- [ ] Test all endpoints
- [ ] Setup monitoring
- [ ] Backup strategy in place

### Build for Production

```bash
# Clean previous builds
rm -rf dist/

# TypeScript compilation
npm run build

# Verify build
ls -la dist/
file dist/server.js
```

### Environment for Production

```env
# Production .env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://user:strong_password@db.production.com:5432/pragyan_prod"
JWT_SECRET="use-strong-random-32-char-secret"
JWT_REFRESH_SECRET="use-strong-random-32-char-secret"
FRONTEND_URL="https://pragyan.com"
BCRYPT_ROUNDS=12
```

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create pragyan-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your_secret"
heroku config:set DATABASE_URL="postgresql://..."

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy to AWS EC2

```bash
# SSH into instance
ssh -i key.pem ec2-user@your-instance.com

# Install Node.js & PostgreSQL
sudo yum update
sudo yum install nodejs npm postgresql

# Clone repository
git clone <your-repo>
cd pragyan/backend

# Install & build
npm install
npm run build

# Start with PM2
npm install -g pm2
pm2 start "npm start" --name "pragyan-api"
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo yum install nginx
sudo systemctl start nginx
```

---

## Docker Setup

### Dockerfile for Backend

```dockerfile
# Create Dockerfile in backend/
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built application
COPY dist ./dist

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \\
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
```

### Docker Compose (Backend + Database)

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: pragyan_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    build: .
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:postgres@db:5432/pragyan_dev
      JWT_SECRET: dev_secret
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      db:
        condition: service_healthy
    command: sh -c "npm run prisma:migrate && npm run seed && npm run dev"

volumes:
  postgres_data:
```

### Run with Docker Compose

```bash
# Build and start
docker-compose up -d

# Check logs
docker-compose logs -f api

# Stop
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`

**Solutions**:
```bash
# Check if PostgreSQL is running
psql -U postgres

# Start PostgreSQL service
# macOS
brew services start postgresql@14

# Linux
sudo systemctl start postgresql

# Windows
# Start from Services or:
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start
```

#### 2. Port Already in Use

**Error**: `listen EADDRINUSE :::5000`

**Solution**:
```bash
# Kill process on port 5000
# Linux/macOS
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### 3. Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
npm run prisma:generate
npm install
```

#### 4. Environment Variables Not Loaded

**Error**: `JWT_SECRET is not set`

**Solution**:
```bash
# Verify .env exists
cat .env

# Reload shell
source .env

# Or restart development server
npm run dev
```

#### 5. Migration Failed

**Error**: `Migration failed: ...`

**Solution**:
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually:
npx prisma migrate resolve --rolled-back migration_name
npx prisma migrate deploy
```

### Debug Mode

Enable detailed logging:

```bash
# Set debug environment variable
export DEBUG=prisma:*
npm run dev

# Or use verbose logging
npx prisma migrate dev --verbose
```

### Performance Monitoring

```bash
# Monitor Node.js process
npm install -g clinic
clinic doctor -- npm start

# View with clinic CLI
```

---

## Security Checklist

- [ ] Strong JWT secrets (32+ characters)
- [ ] HTTPS/TLS enabled
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] Input validation with Zod
- [ ] SQL injection prevention (Prisma)
- [ ] Password hashing (bcrypt)
- [ ] Secrets in environment variables
- [ ] Security headers (Helmet)
- [ ] Database backups enabled
- [ ] Error messages don't leak info
- [ ] API authentication on protected routes

---

## Performance Tips

1. **Database Indexing**
   ```prisma
   @@index([userId])
   @@index([roadmapId])
   ```

2. **Query Optimization**
   - Use `select` to fetch only needed fields
   - Use `include` carefully (can cause N+1 queries)

3. **Caching**
   - Cache roadmap list (changes infrequently)
   - Cache assessment questions

4. **Pagination**
   - Always paginate large result sets
   - Use reasonable default limits

5. **Connection Pooling**
   - Configure in DATABASE_URL
   - Use PgBouncer for production

---

## Support & Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

**Last Updated**: 2024-01-20  
**Status**: ✅ Production Ready
