<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=PUC%20HUB&fontSize=75&fontColor=f39c12&animation=fadeIn&fontAlignY=38&desc=Premier%20University%20Chittagong%20%E2%80%94%20Full-Stack%20Student%20Portal&descAlignY=60&descAlign=50&descSize=15&descColor=e67e22" width="100%"/>

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=20&pause=1000&color=F39C12&center=true&vCenter=true&width=600&lines=Node.js+%2B+Express+Backend;Supabase+PostgreSQL+Database;JWT+Authentication+%2B+Google+OAuth;Deployed+on+Vercel+%2B+Render" alt="Typing SVG" />

<br/><br/>

<p>
<img src="https://img.shields.io/badge/Status-Production--Ready-brightgreen?style=flat-square&labelColor=1a1a2e"/>
<img src="https://img.shields.io/badge/Version-2.0.0-f39c12?style=flat-square&labelColor=1a1a2e"/>
<img src="https://img.shields.io/badge/License-MIT-3498db?style=flat-square&labelColor=1a1a2e"/>
<img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white"/>
<img src="https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white"/>
<img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white"/>
<img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=white"/>
</p>

</div>

---

## 📖 Project Overview

**PUC HUB** is a production-grade, full-stack student portal built for **Premier University Chittagong**. It provides 30+ academic tools and community features including a Question Bank, AI Assistants, Blood Donor Registry, Mess & Housing Finder, CGPA Calculator, and more — all secured with JWT-based authentication and backed by a scalable REST API.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Vercel)                        │
│  HTML + CSS + Vanilla JS   →  window.API_BASE  →  Fetch API │
└────────────────────┬────────────────────────────────────────┘
                     │  HTTPS REST API (JSON)
                     │  Authorization: Bearer <JWT>
                     │  X-CSRF-Token: <token>
┌────────────────────▼────────────────────────────────────────┐
│                     BACKEND (Render)                         │
│  Node.js 20 + Express 4                                      │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────┐ │
│  │  Middleware  │  │    Routes      │  │     Utils        │ │
│  │  helmet      │  │  /auth/*       │  │  logger (winston)│ │
│  │  cors        │  │  /health       │  │  sanitizer       │ │
│  │  csrf        │  │  /metrics      │  │  cache (redis)   │ │
│  │  rateLimit   │  │  /api-docs     │  └──────────────────┘ │
│  │  requestTrace│  └────────────────┘                       │
│  └──────────────┘                                           │
└────────────────────┬────────────────────────────────────────┘
                     │  Knex.js (connection pool, max 20)
                     │  SSL required in production
┌────────────────────▼────────────────────────────────────────┐
│                   DATABASE (Supabase)                        │
│  PostgreSQL 15    users │ profiles │ posts │ refresh_tokens  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JS | UI, no framework |
| **Frontend Host** | Vercel | Static site deployment |
| **Backend** | Node.js 20 + Express 4 | REST API |
| **Backend Host** | Render | API server |
| **Database** | Supabase (PostgreSQL 15) | Persistent data |
| **ORM/Query Builder** | Knex.js | DB migrations & queries |
| **Authentication** | JWT (access) + httpOnly cookie (refresh) | Session management |
| **OAuth** | Google OAuth 2.0 | Social login |
| **Password Hashing** | bcrypt (12 rounds) | Credential security |
| **Security** | Helmet, CORS, CSRF, rate-limiting | Hardening |
| **Observability** | Sentry + Prometheus/prom-client | Error tracking & metrics |
| **Logging** | Winston | Structured JSON logs |
| **Caching** | Redis (ioredis) | Optional performance layer |
| **Docs** | Swagger / OpenAPI 3.0 | API documentation |
| **CI/CD** | GitHub Actions | Auto deploy to Vercel + Render |

---

## 📁 Folder Structure

```
Premier-University-Problem-Solver/
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: lint → test → deploy
│
├── frontend/                   # Static files deployed to Vercel
│   ├── index.html              # Home / landing page
│   ├── login.html              # Auth page (local + Google)
│   ├── profile.html            # User profile management
│   ├── history.html            # Activity history
│   ├── Questionbank.html       # Question paper upload & view
│   ├── Blooddonation.html      # Blood donor registry
│   ├── Messnhousing.html       # Mess & housing listings
│   ├── [30+ other pages]       # Feature pages
│   │
│   ├── css/
│   │   ├── style.css           # Global stylesheet
│   │   └── profile.css         # Profile page styles
│   │
│   ├── js/
│   │   ├── config.js           # ✅ API_BASE URL (single source of truth)
│   │   ├── auth.js             # Navbar auth state, logout
│   │   ├── app.js              # Counters, navigation, scroll effects
│   │   ├── routes.js           # Service navigation with auth guard
│   │   ├── tracker.js          # User activity tracking (localStorage)
│   │   ├── profile.js          # Profile form logic
│   │   ├── security-utils.js   # HTML escaping utility
│   │   └── api.js              # fetchWithRetry helper
│   │
│   ├── assets/                 # Images, PDFs, team photos
│   └── service-worker.js       # PWA offline caching
│
├── backend/                    # Node.js API deployed to Render
│   ├── src/
│   │   ├── server.js           # Express app bootstrap & middleware
│   │   ├── db.js               # ✅ Shared Knex connection pool
│   │   │
│   │   ├── controllers/        # Business Logic Layer
│   │   │   ├── authController.js
│   │   │   └── googleAuthController.js
│   │   │
│   │   ├── routes/             # HTTP Route Definitions
│   │   │   ├── auth.js         # Maps to authController
│   │   │   ├── googleAuth.js   # Maps to googleAuthController
│   │   │   ├── health.js       # /health endpoint
│   │   │   └── metrics.js      # /metrics (Prometheus)
│   │   │
│   │   ├── middleware/         # Custom Express Middleware
│   │   │   ├── auth.js         # verifyJWT and requireAdmin guard
│   │   │   ├── security.js     # Helmet + CORS + rate limiter
│   │   │   ├── csrf.js         # Double-submit CSRF protection
│   │   │   └── requestTrace.js # X-Request-ID tracing
│   │   │
│   │   ├── models/             # Data Models / Repositories
│   │   │
│   │   └── utils/
│   │       ├── logger.js       # Winston structured logging
│   │       ├── sanitizer.js    # Input validation helpers
│   │       └── cache.js        # Redis get/set wrapper
│   │
│   ├── migrations/
│   │   ├── 20260612_init_schema.js       # users, profiles, posts tables
│   │   ├── 20260612_add_refresh_tokens.js # Token rotation table
│   │   └── 20260612_add_google_auth.js   # google_id, auth_provider columns
│   │
│   ├── scripts/
│   │   └── seed-admin.js       # Bootstrap first admin user
│   │
│   ├── knexfile.js             # DB connection config (dev/staging/prod)
│   ├── package.json            # Dependencies & npm scripts
│   └── .env.example            # ✅ All required env vars documented
│
├── database/
│   └── puc_hub.sql             # Legacy reference schema (MySQL — DEPRECATED)
│
├── docs/
│   └── openapi.yaml            # Full OpenAPI 3.0 spec
│
├── tests/                      # (Placeholder — test suite TBD)
├── vercel.json                 # Frontend security headers
├── .gitignore                  # ✅ Protects .env, node_modules
└── README.md                   # This file
```

---

## 🔐 Authentication Flow

### Local Login (Student ID + Password)

```
Browser                     Frontend (login.html)              Backend API
   │                               │                                │
   │── fill form ─────────────────►│                                │
   │                               │── GET /api/v1/csrf-token ─────►│
   │                               │◄── { csrfToken } ─────────────│
   │                               │                                │
   │                               │── POST /api/v1/auth/login ────►│
   │                               │   X-CSRF-Token: <token>        │── bcrypt.compare()
   │                               │   { student_id, password }     │── DB lookup
   │                               │                                │── issue JWT (15m)
   │                               │◄── { accessToken, user } ─────│── set jid cookie (7d)
   │                               │                                │
   │                               │── store in localStorage ──────►│
   │◄── redirect to index/profile ─│                                │
```

### Google OAuth 2.0 Flow (Secure Handoff)

```
Browser                Backend                 Google
   │── click Google ──►│                           │
   │                   │── redirect ──────────────►│
   │                   │                           │── consent screen
   │◄── redirect ──────│◄── code ──────────────────│
   │                   │── exchange code for token ►│
   │                   │◄── access_token ───────────│
   │                   │── GET userinfo ────────────►│
   │                   │◄── { sub, email, name } ───│
   │                   │── find/create user in DB
   │                   │── set jid cookie (refresh)
   │                   │── set oauth_handoff cookie (60s httpOnly)
   │◄── redirect /login.html?oauth=success ─────────│
   │── GET /api/v1/auth/me ──────────────────────────►│
   │   (sends oauth_handoff cookie)                   │── verify + clear cookie
   │◄── { accessToken, user } ────────────────────────│
```

> **Security Note:** JWT is **never** placed in a URL query string. All token exchange happens via httpOnly cookies or JSON response bodies.

### Token Lifecycle

```
Access Token:   15 minutes  → stored in localStorage (userData.accessToken)
Refresh Token:  7 days      → stored in httpOnly cookie (jid)
Handoff Token:  60 seconds  → httpOnly cookie, single-use only (oauth_handoff)
```

---

## 📡 API Reference

### Base URLs
| Environment | URL |
|------------|-----|
| Production | `https://puc-hub-api.onrender.com/api/v1` |
| Local Dev | `http://localhost:3000/api/v1` |
| Swagger UI | `/api-docs` |

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET`  | `/csrf-token` | ❌ | Get CSRF token (required before POST) |
| `POST` | `/auth/register` | ❌ | Register new student account |
| `POST` | `/auth/login` | ❌ | Login with student ID + password |
| `POST` | `/auth/refresh` | Cookie | Rotate refresh token, get new access token |
| `POST` | `/auth/logout` | Cookie | Revoke refresh token |
| `GET`  | `/auth/google/login` | ❌ | Start Google OAuth flow |
| `GET`  | `/auth/google/callback` | ❌ | Google OAuth callback handler |
| `GET`  | `/auth/me` | Cookie | Exchange OAuth handoff cookie for user data |
| `GET`  | `/health` | ❌ | API + DB health check |
| `GET`  | `/liveness` | ❌ | Kubernetes liveness probe |
| `GET`  | `/readiness` | ❌ | Kubernetes readiness probe |
| `GET`  | `/metrics` | Internal | Prometheus metrics |

---

## 🗄️ Database Schema

```sql
-- Users (auth identity)
users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username      VARCHAR(100) NOT NULL,
  student_id    VARCHAR(20) UNIQUE,         -- NULL for Google-only accounts
  password_hash VARCHAR(255),               -- NULL for Google-only accounts
  email         VARCHAR(255) UNIQUE,
  google_id     VARCHAR(255) UNIQUE,
  auth_provider VARCHAR(50) DEFAULT 'local', -- 'local' | 'google'
  is_admin      BOOLEAN DEFAULT false,
  is_blocked    BOOLEAN DEFAULT false,
  last_login    TIMESTAMP,
  deleted_at    TIMESTAMP,                  -- soft delete
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
)

-- Extended user profile data
profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  department    VARCHAR(100),
  semester      VARCHAR(20),
  section       VARCHAR(10),
  blood_group   VARCHAR(5),
  advisor       VARCHAR(100),
  phone         VARCHAR(30),
  email         VARCHAR(255),
  profile_image TEXT,                       -- base64 or URL
  completed     BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
)

-- Community posts (housing, study partner listings)
posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  type          VARCHAR(30) NOT NULL,       -- 'housing' | 'study_partner'
  category      VARCHAR(50),
  title         VARCHAR(255) NOT NULL,
  content       TEXT,
  price         DECIMAL(10,2),
  available_from DATE,
  file_url      TEXT,
  deleted_at    TIMESTAMP,                  -- soft delete
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
)

-- Refresh token rotation table
refresh_tokens (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash    VARCHAR(255) NOT NULL UNIQUE, -- SHA-256 of the raw token
  expires_at    TIMESTAMP NOT NULL,
  is_revoked    BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT NOW()
)
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 20+
- A Supabase account (free tier works)
- A Google Cloud Console project (for OAuth)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/rahul-3613/Premier-University-Problem-Solver.git
cd Premier-University-Problem-Solver
```

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
# Edit .env and fill in all required values
```

**Required variables:**
```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
JWT_SECRET=your-64-char-random-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:5500
```

### 3. Install dependencies

```bash
cd backend
npm install
```

### 4. Run database migrations

```bash
npm run migrate
```

### 5. Seed the admin user

```bash
# First set ADMIN_STUDENT_ID, ADMIN_EMAIL, ADMIN_PASSWORD in .env
npm run seed
```

### 6. Start the development server

```bash
npm run dev
# API available at: http://localhost:3000
# Swagger docs at:  http://localhost:3000/api-docs
```

### 7. Serve the frontend

Open `frontend/index.html` with **VS Code Live Server** (port 5500) or any static file server. `frontend/js/config.js` will automatically use `http://localhost:3000/api/v1` when running locally.

---

## 📦 Deployment Guide

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Node Version:** `20`
4. Add all environment variables from `.env.example` under **Environment**
5. Set `NODE_ENV=production`
6. Deploy — note your service URL (e.g. `https://puc-hub-api.onrender.com`)

**After deploy:**
```bash
# Run migrations on production DB
# In Render dashboard → Shell tab:
npm run migrate
npm run seed
```

### Frontend → Vercel

1. Update `PROD_API_URL` in `frontend/js/config.js` with your Render URL
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `frontend`
   - **Build Command:** *(leave empty — static files)*
   - **Output Directory:** *(leave empty)*
5. Deploy

### CI/CD — GitHub Actions

Add these secrets to your GitHub repository (**Settings → Secrets**):

| Secret | Value |
|--------|-------|
| `RENDER_PRODUCTION_DEPLOY_HOOK_URL` | From Render → Settings → Deploy Hook |
| `RENDER_STAGING_DEPLOY_HOOK_URL` | Staging service deploy hook |
| `VERCEL_TOKEN` | From Vercel → Settings → Tokens |
| `VERCEL_ORG_ID` | From `.vercel/project.json` after first deploy |
| `VERCEL_PROJECT_ID` | From `.vercel/project.json` |
| `TEST_DATABASE_URL` | Test database connection string |
| `TEST_JWT_SECRET` | Any random string for test runs |

The pipeline in `.github/workflows/deploy.yml` runs:
1. **On every push/PR:** lint + test
2. **On push to `staging`:** deploy to staging environments
3. **On push to `main`:** deploy to production

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → **APIs & Services → Credentials**
3. Create **OAuth 2.0 Client ID** (Web application)
4. Add Authorized redirect URIs:
   - `http://localhost:3000/api/v1/auth/google/callback` (development)
   - `https://puc-hub-api.onrender.com/api/v1/auth/google/callback` (production)
5. Copy Client ID and Client Secret to your `.env`

---

## 🔒 Security Features

| Feature | Implementation |
|---------|---------------|
| Password hashing | bcrypt with 12 salt rounds |
| JWT expiry | Access: 15 min / Refresh: 7 days |
| Refresh token rotation | Used tokens immediately revoked |
| Token theft detection | Reuse triggers full session invalidation |
| CSRF protection | Double-submit cookie pattern |
| XSS protection | Helmet CSP headers + `esc()` helper in templates |
| Rate limiting | 100 req/min per IP (global) |
| CORS | Strict allowlist (Vercel URL only in production) |
| SQL injection | Knex.js parameterized queries (never raw string concat) |
| Secrets | `.env` files never committed (`.gitignore`) |
| Soft delete | Records marked `deleted_at`, never hard-deleted |

---

## 👥 Development Team

| Name | Role |
|------|------|
| **Rahul Singha** | Group Leader — Backend, Architecture, Security |
| **Tabib** | Sub Leader — Frontend Integration |
| **Rudra** | Member — Question Bank, Profile |
| **Ador** | Member — UI/UX Design |
| **Alvi** | Member — Community Features |

> Dept. of CSE — Premier University Chittagong | Lab Project 2026

---

## 📄 License

MIT © 2026 Team PUC HUB
