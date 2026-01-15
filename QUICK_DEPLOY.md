# 🚀 Quick Free Deployment Guide

Deploy your Trello clone **100% FREE** in 10 minutes!

## Step-by-Step (Free Options)

### Backend: Render (FREE)
1. Go to https://render.com → Sign up (free, no credit card)
2. "New +" → "Web Service" → Connect GitHub → Select repo
3. Settings:
   - Root Directory: `backend`
   - Build: `npm install && npx prisma generate`
   - Start: `npm start`
   - Plan: **Free**
4. "New +" → "PostgreSQL" → Plan: **Free**
5. Copy Database URL → Add to backend env vars as `DATABASE_URL`
6. Deploy → Wait for completion
7. In Shell tab: `npm run migrate:deploy && npm run seed`
8. Copy backend URL (e.g., `https://trello-backend.onrender.com`)

### Frontend: Vercel (FREE)
1. Go to https://vercel.com → Sign up (free)
2. "Add New" → "Project" → Import repo
3. Settings:
   - Root Directory: `frontend`
   - Framework: Vite (auto-detected)
4. Environment Variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`
5. Deploy → Copy frontend URL

### Update CORS
1. Go back to Render backend
2. Add env var: `FRONTEND_URL` = `https://your-frontend-url.vercel.app`
3. Auto-redeploys

### Keep Backend Awake (Optional)
- Sign up at https://uptimerobot.com (free)
- Add monitor → Ping your backend URL every 5 minutes
- Keeps app awake 24/7!

## That's it! 🎉

Your app is now live and **completely free**!

