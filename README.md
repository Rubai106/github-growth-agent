# GitHub Growth Agent

Analyze GitHub repositories and profiles, generate professional READMEs, and create shareable report cards — completely free.

## ✨ Features

- **Repository Analyzer** – Score any public repository on documentation, community, activity, and popularity
- **Profile Analyzer** – Analyze GitHub profiles with comprehensive scoring
- **README Generator** – Create professional README files from an interactive template
- **Report Cards** – Generate beautiful, downloadable report cards as PNG images

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router v6
- **Backend:** Node.js + Express
- **API:** GitHub REST API (free, no authentication required)

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+
- npm v8+

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **(Optional) Add GitHub token for higher rate limits**
   ```bash
   cp .env.example server/.env
   ```
   Edit `server/.env` and add your GitHub token from https://github.com/settings/tokens

3. **Start development server**
   ```bash
   npm run dev
   ```

The app will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
