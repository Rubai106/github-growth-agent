# GitHub Growth Agent

> Analyze GitHub repositories and profiles, generate professional READMEs, and create shareable report cards — all completely free.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5+-646cff.svg)](https://vitejs.dev)

## ✨ Features

- **Repository Analyzer** – Score any public repository on documentation, community, activity, and popularity
- **Profile Analyzer** – Analyze GitHub profiles with completeness, repositories, community, and longevity scoring  
- **README Generator** – Create professional README files from an interactive template
- **Report Cards** – Generate beautiful, downloadable report cards as PNG images

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS + React Router v6 |
| Backend | Node.js + Express |
| Data Source | GitHub REST API (free, no authentication required for public repos) |
| Deployment | Vercel (frontend + serverless API) |

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v8 or higher

### Local Development

```bash
# 1. Install all dependencies
npm install

# 2. (Optional) Configure GitHub token for higher rate limits
cp .env.example server/.env
# Edit server/.env and add your GitHub token

# 3. Start development server
npm run dev
```

Once running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000  
- **Health Check**: http://localhost:5000/api/health

### Deployment

Deploy to Vercel with a single click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Rubai106/github-growth-agent)

Or follow the [detailed deployment guide](VERCEL_DEPLOYMENT.md).

### Installation & Build Commands

```bash
# Install server and client dependencies separately
npm install --prefix server
npm install --prefix client

# Build frontend only
npm run build --prefix client

# Run backend only
npm run start:server

# Run frontend only
npm run start:client
```

## � Project Structure

```
github-growth-agent/
├── api/                      # Vercel serverless functions
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── pages/           # Dashboard, Analyzer pages
│   │   ├── components/      # UI components & layout
│   │   └── services/        # API client
│   └── vite.config.js
│
├── server/                   # Node.js + Express backend
│   └── src/
│       ├── config/          # Environment & GitHub API config
│       ├── middlewares/     # Error handling, async wrapper
│       ├── modules/         # Feature modules (repo, profile, readme)
│       └── app.js           # Express app & routes
│
├── vercel.json              # Vercel deployment config
└── VERCEL_DEPLOYMENT.md     # Deployment guide
```

## 📡 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/health` | Check server status |
| `POST` | `/api/repo/analyze` | Analyze repository scoring |
| `GET` | `/api/profile/:username` | Analyze GitHub profile |
| `POST` | `/api/readme/generate` | Generate README from template |

## 📊 Scoring System

### Repository Score (0–100)

| Category | Weight | Criteria |
|----------|--------|----------|
| Documentation | 30% | README, description, homepage |
| Community | 25% | License, topics, wiki |
| Activity | 25% | Days since last update, not archived |
| Popularity | 20% | Stars & forks (logarithmic scale) |

### Profile Score (0–100)

| Category | Weight | Criteria |
|----------|--------|----------|
| Completeness | 25% | Name, bio, company, location, blog, social links |
| Repositories | 25% | Count & total stars earned |
| Community | 25% | Followers & following ratio |
| Longevity | 25% | Account age in years |

## 🔐 Environment Variables

### Local Development

Create `server/.env`:

```env
GITHUB_TOKEN=                    # Optional: 5000 requests/hour (vs 60 without)
PORT=5000                         # Server port
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

**Get a GitHub Token**: https://github.com/settings/tokens (no scopes needed)

### Production (Vercel)

Set environment variables in Vercel project settings (Settings → Environment Variables)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License — see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev) and [Vite](https://vitejs.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Powered by [GitHub REST API](https://docs.github.com/rest)
- Deployed on [Vercel](https://vercel.com)

## 📧 Support

For issues, questions, or suggestions, please open an [issue](https://github.com/Rubai106/github-growth-agent/issues) on GitHub.
