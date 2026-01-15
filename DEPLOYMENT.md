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

## Deployment Steps

### 1. Backend Deployment (Railway/Render/Railway)

**Option A: Railway**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Add PostgreSQL service
5. Set environment variables:
   - `DATABASE_URL` (auto-set from PostgreSQL service)
   - `PORT` (optional, defaults to 5001)
6. Deploy

**Option B: Render**
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`
5. Add PostgreSQL database
6. Set environment variables:
   - `DATABASE_URL` (from PostgreSQL service)
7. Deploy

**After Backend Deployment:**
```bash
# Run migrations (if not auto-run)
npx prisma migrate deploy

# Seed database
npm run seed
```

### 2. Frontend Deployment (Vercel/Netlify)

**Option A: Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Import Project → GitHub
3. Select repository
4. Framework Preset: Vite
5. Environment Variables:
   - `VITE_API_URL` = `https://your-backend-url.com`
6. Deploy

**Option B: Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Add new site → Import from Git
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Environment Variables:
   - `VITE_API_URL` = `https://your-backend-url.com`
5. Deploy

### 3. Update CORS (if needed)

If your backend and frontend are on different domains, ensure CORS is properly configured in `backend/src/index.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

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

**Backend:**
- `DATABASE_URL` - PostgreSQL connection string (required)
- `PORT` - Server port (optional, defaults to 5001)

**Frontend:**
- `VITE_API_URL` - Backend API URL (required for production)

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

