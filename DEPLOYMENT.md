# Deployment Guide

## Pre-Deployment Checklist

✅ **Code Quality**
- [x] All core features implemented
- [x] All bonus features implemented
- [x] Responsive design working
- [x] Error handling in place
- [x] No console errors

✅ **Database**
- [x] Schema finalized
- [x] Migrations created
- [x] Seed script ready
- [x] Sample data with Indian names (Adarsh, Ram, Priya)

✅ **Documentation**
- [x] README.md complete
- [x] Setup instructions included
- [x] API endpoints documented
- [x] Deployment instructions added

✅ **Configuration**
- [x] Environment variables configured
- [x] .gitignore created
- [x] API URL configurable via env vars

## Deployment Steps - 100% FREE Options

### 1. Backend Deployment (FREE)

**Option A: Render (Recommended - Best Free Tier)**
1. Go to [render.com](https://render.com) and sign up (free, no credit card needed)
2. Click "New +" → "Web Service"
3. Connect your GitHub account and select repository: `adarsh06261/Project-Management-Tool`
4. **Important Settings:**
   - **Name**: `trello-backend` (or any name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate` (auto-filled from `render.yaml`)
   - **Start Command**: `npm start` (auto-filled from `render.yaml`)
   - **Plan**: Select **Free** plan
5. Click "Advanced" and add environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render uses port 10000, already set in render.yaml)
   - `FRONTEND_URL` = (leave empty for now, add after frontend deploys)
6. Click "Create Web Service"
7. **Add PostgreSQL Database (FREE):**
   - Click "New +" → "PostgreSQL"
   - **Name**: `trello-db`
   - **Plan**: Select **Free** plan (1 GB storage)
   - Click "Create Database"
   - Copy the **Internal Database URL** (starts with `postgresql://`)
8. **Link Database to Backend:**
   - Go back to your web service
   - Go to "Environment" tab
   - Click "Add Environment Variable"
   - Key: `DATABASE_URL`
   - Value: Paste the Internal Database URL from step 7
   - Click "Save Changes"
9. Render will automatically redeploy. Wait for deployment to complete.
10. **Run Migrations & Seed:**
    - Go to your web service → "Shell" tab
    - Run: `npm run migrate:deploy`
    - Run: `npm run seed`
    - Or use Render's manual deploy with these commands
11. Copy your backend URL (e.g., `https://trello-backend.onrender.com`)

**⚠️ Note:** Render free tier spins down after 15 minutes of inactivity. First request after spin-down may take 30-60 seconds (cold start).

**Option B: Railway (Limited Free Credits)**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. **Important:** Set Root Directory to `backend` in the service settings
5. Add PostgreSQL service (uses free credits)
6. Set environment variables:
   - `DATABASE_URL` (auto-set from PostgreSQL service)
   - `PORT` (optional, defaults to 5001)
   - `FRONTEND_URL` = `https://your-frontend-url.vercel.app` (set after frontend is deployed)
7. Railway will auto-detect the build (uses `railway.json` and `Procfile`)
8. After deployment, run migrations and seed:
   - Go to your service → Deployments → Latest → View Logs
   - Or use Railway CLI: `railway run npm run migrate:deploy && railway run npm run seed`

**After Backend Deployment:**
```bash
# Run migrations (if not auto-run)
npx prisma migrate deploy

# Seed database
npm run seed
```

### 2. Frontend Deployment (FREE)

**Option A: Vercel (Recommended - Best Free Tier)**
1. Go to [vercel.com](https://vercel.com) and sign up (free, GitHub login)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `adarsh06261/Project-Management-Tool`
4. **Important Settings:**
   - **Framework Preset**: Vite (auto-detected from `vercel.json`)
   - **Root Directory**: Click "Edit" → Set to `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
5. **Environment Variables:**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com` (use your Render backend URL from Step 1)
   - Click "Save"
6. Click "Deploy"
7. Wait for deployment (usually 1-2 minutes)
8. Copy your frontend URL (e.g., `https://your-app.vercel.app`)

**Option B: Netlify (Also Great Free Tier)**
1. Go to [netlify.com](https://netlify.com) and sign up (free, GitHub login)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select your repository
4. **Build settings:**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Click "Show advanced" → "New variable":
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com` (use your Render backend URL)
6. Click "Deploy site"
7. Copy your frontend URL (e.g., `https://your-app.netlify.app`)

### 3. Update Backend CORS (Required)

After your frontend is deployed, update the backend CORS:

1. Go to your Render dashboard → Your backend web service
2. Go to "Environment" tab
3. Add/Update environment variable:
   - Key: `FRONTEND_URL`
   - Value: `https://your-frontend-url.vercel.app` (or `.netlify.app` if using Netlify)
4. Click "Save Changes"
5. Render will automatically redeploy

**✅ CORS is already configured** in `backend/src/index.js` to use the `FRONTEND_URL` environment variable.

## Post-Deployment

1. **Test all features:**
   - Create board
   - Create lists
   - Create cards
   - Drag and drop
   - Edit/delete operations
   - Search functionality
   - Card details (labels, members, checklist)

2. **Verify:**
   - Database is seeded with sample data
   - Members show Indian names (Adarsh, Ram, Priya)
   - All API endpoints working
   - Responsive design on mobile/tablet

3. **Share links:**
   - Frontend URL
   - Backend URL (if accessible)
   - GitHub repository

## Troubleshooting

**Backend Issues:**
- Check DATABASE_URL is set correctly
- Verify migrations ran: `npx prisma migrate status`
- Check logs for errors

**Frontend Issues:**
- Verify VITE_API_URL points to correct backend
- Check browser console for CORS errors
- Ensure backend is running and accessible

**Database Issues:**
- Run migrations: `npx prisma migrate deploy`
- Reseed if needed: `npm run seed`
- Check connection string format

## Environment Variables Summary

**Backend (Render):**
- `DATABASE_URL` - PostgreSQL connection string (required, auto-set from Render PostgreSQL service)
- `PORT` - Server port (set to `10000` for Render, already configured)
- `NODE_ENV` - Set to `production` (optional)
- `FRONTEND_URL` - Frontend URL for CORS (required after frontend deployment)

**Frontend (Vercel/Netlify):**
- `VITE_API_URL` - Backend API URL (required, e.g., `https://trello-backend.onrender.com`)

## Free Tier Limitations & Tips

**Render Free Tier:**
- ✅ 750 free instance hours/month
- ✅ Free PostgreSQL (1 GB storage)
- ⚠️ Apps spin down after 15 minutes of inactivity (cold start ~30-60 seconds)
- 💡 **Tip**: Use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) to ping your backend every 5 minutes to keep it awake
  - Sign up at [uptimerobot.com](https://uptimerobot.com) (free)
  - Add a new monitor → HTTP(s) → Enter your backend URL
  - Set interval to 5 minutes
  - This keeps your app awake 24/7 for free!

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ Free SSL/HTTPS
- ✅ Global CDN
- ✅ 100 GB bandwidth/month
- ✅ No cold starts for static sites

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ Free SSL/HTTPS
- ✅ Global CDN
- ✅ 100 GB bandwidth/month
- ✅ No cold starts for static sites

**Netlify Free Tier:**
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Free SSL/HTTPS
- ✅ No cold starts for static sites

## Quick Deploy Commands

```bash
# Backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm start

# Frontend
npm install
npm run build
# Deploy dist/ folder
```

