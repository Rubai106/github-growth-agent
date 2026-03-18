# GitHub Growth Agent

A full-stack MERN tool to analyze GitHub repositories and profiles, generate professional READMEs, and get shareable report cards — **100% free, no paid APIs required**.

## ✨ Features

| Feature | Details |
|---|---|
| **Repo Analyzer** | Score any public repo across Documentation, Community, Activity & Popularity |
| **Profile Analyzer** | Analyze any GitHub profile with 4-dimension scoring |
| **README Generator** | Template-based generator — fill a form, get a complete README.md |
| **Report Cards** | Visual report card for any repo or profile — downloadable as PNG |

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + React Router v6
- **Backend**: Node.js + Express
- **API**: GitHub public REST API (free, no auth needed for public repos)

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm v8+

### 1. Install dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install server and client dependencies
npm install --prefix server
npm install --prefix client
```

### 2. Configure environment (optional but recommended)

```bash
cp .env.example server/.env
```

Open `server/.env` and optionally add a GitHub token:
```
GITHUB_TOKEN=ghp_your_token_here
PORT=5000
```

> **Without token**: 60 requests/hour (unauthenticated GitHub API limit)  
> **With token**: 5,000 requests/hour — get one free at [github.com/settings/tokens](https://github.com/settings/tokens) (no scopes needed for public repos)

### 3. Run the project

```bash
# Start both frontend and backend together
npm run dev
```

- 🖥️ **Frontend**: http://localhost:5173
- ⚙️ **Backend**: http://localhost:5000
- 🔍 **Health check**: http://localhost:5000/api/health

## 📁 Project Structure

```
github-growth-agent/
├── package.json              # Root — runs both with concurrently
├── .env.example
│
├── server/                   # Node.js + Express backend
│   ├── server.js
│   └── src/
│       ├── app.js            # Express setup, routes, CORS
│       ├── config/
│       │   ├── index.js      # Env config
│       │   └── github.js     # Axios client for GitHub API
│       ├── middlewares/
│       │   ├── asyncHandler.js
│       │   └── errorHandler.js
│       └── modules/
│           ├── repo/         # Repo analyzer (route + controller + service)
│           ├── profile/      # Profile analyzer
│           └── readme/       # README generator
│
└── client/                   # React + Vite frontend
    ├── index.html
    ├── vite.config.js        # Proxies /api → localhost:5000
    └── src/
        ├── App.jsx           # React Router routes
        ├── index.css         # Tailwind + custom classes
        ├── services/api.js   # Axios client
        ├── components/
        │   ├── layout/       # Layout, Sidebar
        │   └── ui/           # ScoreCircle, ReportCard, SuggestionList
        └── pages/
            ├── Dashboard.jsx
            ├── RepoAnalyzer.jsx
            ├── ReadmeGenerator.jsx
            └── ProfileAnalyzer.jsx
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/repo/analyze` | Analyze a repo `{ repoUrl }` |
| `GET` | `/api/profile/:username` | Analyze a GitHub profile |
| `POST` | `/api/readme/generate` | Generate a README `{ projectName, ... }` |

## 🎯 Scoring System

### Repo Score (0–100)
| Category | Max | Criteria |
|---|---|---|
| Documentation | 30 | README present, description, homepage |
| Community | 25 | License, topics/tags, wiki |
| Activity | 25 | Days since last update, not archived |
| Popularity | 20 | Stars (log scale), forks (log scale) |

### Profile Score (0–100)
| Category | Max | Criteria |
|---|---|---|
| Completeness | 25 | Name, bio, company, blog, location, Twitter |
| Repositories | 25 | Repo count, total stars earned |
| Community | 25 | Followers, follower/following ratio |
| Longevity | 25 | Account age in years |

## 📦 Run separately

```bash
# Backend only
npm run start:server

# Frontend only
npm run start:client
```

## License

MIT
