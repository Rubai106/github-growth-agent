# Vercel Deployment Guide

## Prerequisites
- Vercel account (free at https://vercel.com)
- GitHub repository pushed with the latest changes

## Step-by-Step Deployment

### 1. **Push Latest Changes to GitHub**
```bash
git add .
git commit -m "Configure project for Vercel deployment"
git push origin main
```

### 2. **Deploy to Vercel**

#### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project root
vercel

# Follow prompts:
# - Confirm project settings
# - Set it as production
# - Link to your GitHub repository during setup
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository: `Rubai106/github-growth-agent`
4. Configure project settings (see below)
5. Click "Deploy"

### 3. **Configure Environment Variables in Vercel**

After deployment, set environment variables:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add the following:

| Variable | Value | Purpose |
|----------|-------|---------|
| `GITHUB_TOKEN` | Your GitHub Personal Access Token | Optional: Increases rate limit from 60 to 5000 requests/hour |
| `ALLOWED_ORIGINS` | Your deployed Vercel URL | Controls CORS; auto-generated on first deploy |

#### To get a GitHub Token:
1. Go to https://github.com/settings/tokens
2. Create a new "Personal access token (classic)"
3. Check the `public_repo` scope
4. Copy the token and add it to Vercel

### 4. **Redeploy After Environment Variables**
After setting environment variables, trigger a redeploy:
- Push a new commit, OR
- Click "Redeploy" in Vercel dashboard

## Project Structure
- **Frontend**: `/client` → Deployed to Vercel (static Vite build)
- **Backend**: `/api` → Deployed as Vercel Serverless Functions
- **Shared**: `/server/src` → Backend routes and logic

## Build Process
When you deploy, Vercel will:
1. Install dependencies in both `/server` and `/client`
2. Build the React frontend with Vite
3. Serve the frontend from Vercel CDN
4. Route all `/api/*` requests to serverless functions

## Important Notes

- ✅ **Frontend** automatically updates on every push to GitHub
- ✅ **Backend** (serverless functions) also updates on every push  
- ✅ **Environment variables** take effect after redeploy
- ⚠️ **Rate Limits**: Without `GITHUB_TOKEN`, limited to 60 requests/hour
- 📊 **Monitor**: Check Vercel Analytics/Monitoring tab for issues

## Troubleshooting

### API calls returning 404
- Make sure `vercel.json` is in the root directory
- Check that `/api` folder exists with `index.js`
- Verify CORS settings in Vercel environment

### "Cannot reach backend" error
- Check Vercel Function logs: Project → **Functions** tab
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Ensure `GITHUB_TOKEN` is set if making many API calls

### Build failures
- Check Vercel deployment logs
- Ensure both `server/` and `client/` have valid `package.json`
- Run `npm install --prefix server && npm install --prefix client` locally to verify dependencies

## After Deployment

Your app will be available at:
```
https://your-project-name.vercel.app
```

Share the link! The app is:
- ✨ **Free** - no paid APIs
- 🚀 **Fast** - CDN-backed frontend, serverless backend
- 📱 **Responsive** - works on all devices
