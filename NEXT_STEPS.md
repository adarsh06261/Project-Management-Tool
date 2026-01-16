# 🎯 Next Steps - Complete Your Deployment

## Step-by-Step Guide

### ✅ STEP 1: Verify Vercel Environment Variable

**Goal:** Make sure frontend knows where your backend is

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Sign in if needed

2. **Open Your Project**
   - Click on: `project-management-tool`
   - Or search for it in your projects list

3. **Go to Settings**
   - Click "Settings" in the top navigation
   - Click "Environment Variables" in the left sidebar

4. **Check/Add Environment Variable**
   - Look for: `VITE_API_URL`
   - **If it exists:**
     - Click on it to edit
     - Verify value is: `https://project-management-tool-0g51.onrender.com`
     - If wrong, update it and click "Save"
   - **If it doesn't exist:**
     - Click "Add New"
     - Key: `VITE_API_URL`
     - Value: `https://project-management-tool-0g51.onrender.com`
     - Environments: Check ✅ Production, ✅ Preview, ✅ Development
     - Click "Save"

---

### ✅ STEP 2: Redeploy Frontend (If You Changed Env Var)

**Goal:** Make sure the new environment variable is used

1. **Go to Deployments Tab**
   - Click "Deployments" in the top navigation

2. **Find Latest Deployment**
   - Look for the most recent deployment (should be at the top)

3. **Redeploy**
   - Click the three dots (⋯) on the right side of the deployment
   - Click "Redeploy"
   - Click "Redeploy" again to confirm
   - Wait 1-2 minutes for build to complete

**Note:** If you didn't change the env var, you can skip this step.

---

### ✅ STEP 3: Test Your Frontend

**Goal:** Verify everything is working

1. **Open Your Frontend**
   - Visit: https://project-management-tool-virid-pi.vercel.app
   - Wait for page to load

2. **Open Browser Console**
   - Press `F12` (or right-click → Inspect)
   - Click "Console" tab

3. **Check for Errors**
   - Look for any red error messages
   - **Good signs:**
     - No CORS errors
     - No "Network Error" messages
     - You see your Trello board with data
   - **Bad signs:**
     - CORS errors
     - "Network Error"
     - "Failed to fetch"
     - Blank page or loading forever

4. **Check API URL (Optional)**
   - In console, you might see: "API URL being used: ..."
   - Should show: `https://project-management-tool-0g51.onrender.com`
   - If it shows `localhost:5001`, the env var isn't set correctly

---

### ✅ STEP 4: Test Features

**Goal:** Make sure all features work

1. **View Board**
   - You should see "Sample Board" with lists (Todo, In Progress, Done)
   - Cards should be visible with labels and members

2. **Create New Board**
   - Click "+ New Board" button
   - Enter a name
   - Should create successfully

3. **Add List**
   - Click "+ Add another list"
   - Enter list name
   - Should appear on the board

4. **Add Card**
   - Click "+ Add a card" in any list
   - Enter card title
   - Should appear in the list

5. **Test Drag & Drop**
   - Drag a card from one list to another
   - Should move successfully

6. **Edit Card**
   - Click on a card
   - Edit title, description, or add labels
   - Changes should save

---

### ✅ STEP 5: Verify Backend (Quick Check)

**Goal:** Make sure backend is still running

1. **Test Health Endpoint**
   - Visit: https://project-management-tool-0g51.onrender.com/health
   - Should show: `{"status":"ok","database":"connected"}`

2. **Test API Endpoint**
   - Visit: https://project-management-tool-0g51.onrender.com/boards
   - Should show JSON with boards data

**If backend is slow:** Free tier spins down after 15 min. First request may take 30-60 seconds (cold start).

---

## 🐛 Troubleshooting

### Problem: Frontend shows "Network Error"

**Solution:**
1. Check Vercel env var is set correctly (Step 1)
2. Redeploy frontend (Step 2)
3. Check browser console for specific error
4. Verify backend is running (Step 5)

### Problem: CORS Errors in Console

**Solution:**
- Backend CORS is already configured
- Make sure `FRONTEND_URL` in Render is set to: `https://project-management-tool-virid-pi.vercel.app`
- Check Render → Environment tab

### Problem: Backend Returns 502

**Solution:**
- Backend might be spinning up (free tier)
- Wait 30-60 seconds and try again
- Check Render logs for errors

### Problem: Frontend Shows Localhost URL

**Solution:**
- `VITE_API_URL` not set in Vercel
- Go back to Step 1 and add it
- Redeploy (Step 2)

---

## ✅ Success Checklist

When everything works, you should see:

- [ ] Frontend loads without errors
- [ ] Board displays with lists and cards
- [ ] Can create new boards
- [ ] Can add lists and cards
- [ ] Drag and drop works
- [ ] No errors in browser console
- [ ] All features working smoothly

---

## 🎉 You're Done!

Once all features work, your Trello clone is fully deployed and live!

**Your Live URLs:**
- Frontend: https://project-management-tool-virid-pi.vercel.app
- Backend: https://project-management-tool-0g51.onrender.com

**Share these links with others to show off your project!** 🚀

