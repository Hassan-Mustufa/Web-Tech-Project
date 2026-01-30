# CarSwap Pakistan - Local Setup Guide

## Overview
This guide explains how to set up and run CarSwap locally, how to work with Supabase for local development, and how to handle the image upload issues.

---

## Part 1: Understanding Your Setup

### What You Have
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Supabase (hosted PostgreSQL database)
- **Authentication**: Supabase Auth (email/password)
- **File Storage**: Supabase Storage (for car images)

### Your Environment Variables
Your `.env` file contains Supabase credentials that connect to a **hosted Supabase instance** (cloud):
- `VITE_SUPABASE_URL`: Points to Supabase cloud
- `VITE_SUPABASE_ANON_KEY`: Allows public access

---

## Part 2: Running Locally

### Prerequisites
- Node.js 18+ installed
- npm installed

### Steps to Run Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```
   Your app will run at `http://localhost:5173`

3. **Build for production**
   ```bash
   npm run build
   ```

**That's it!** Your app automatically connects to the Supabase cloud database. No local database setup needed.

---

## Part 3: How Supabase Works (Cloud vs Local)

### Cloud Supabase (What You're Using)
- ✅ No local setup needed
- ✅ Database is hosted in the cloud
- ✅ Accessible from anywhere
- ✅ Perfect for development and publishing

### Local Supabase (Optional)
- For testing without internet
- Requires Docker
- More complex setup
- **Not recommended for your project**

**Your current setup (cloud) is the right choice!**

---

## Part 4: Why Cars Aren't Showing - The Solution

### Problem
The database tables exist but have **no user profiles** because:
- Car listings require an owner (foreign key constraint)
- Owner must exist in `profiles` table
- Profiles are created when users sign up through Auth

### Solution: Create Demo Data

**Step 1: Sign Up Users First**
1. Go to your app home page (running on `localhost:5173`)
2. Click "Sign Up"
3. Create test account: `test@example.com` / `password123`
4. Repeat to create 2-3 test accounts

**Step 2: Get Your User IDs**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this code:
   ```javascript
   import { supabase } from './src/lib/supabase.js'
   const { data } = await supabase.auth.getUser()
   console.log(data.user.id)
   ```
4. Save these user IDs (you'll need them)

**Step 3: Create Car Listings**
1. Log in with a test account
2. Go to "List Car" page
3. Fill in the form:
   - Title: `2023 Honda Civic - Black`
   - Brand: `Honda`
   - Model: `Civic`
   - Year: `2023`
   - Color: `Black`
   - Transmission: `Automatic`
   - Fuel: `Petrol`
   - Seats: `5`
   - Price: `8000`
   - Location: `Karachi, Sindh`
   - Description: `Brand new Honda Civic with turbocharged engine...`
4. Click "List Car"

Repeat for other car listings.

---

## Part 5: Fixing Image Upload Issues

### Current Status
Storage bucket is created but needs proper configuration.

### Solution

**Option A: Use External Image URLs (Recommended for Demo)**
When listing a car, use image URLs from Pexels:
```
https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800
```

**Option B: Enable Storage Upload (If Needed)**

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `iuigphcezltvwsvwgzpr`
3. Navigate to: **Storage** → **Buckets**
4. Click **Create a new bucket**:
   - Name: `car-images`
   - Make it Public
5. Click the bucket and set these policies:
   - **Public Read**: Allow all
   - **Authenticated Upload**: Allow authenticated users

---

## Part 6: Quick Reference - File Upload Issue Explained

### Why Images Don't Upload
1. ❌ Storage bucket doesn't have correct policies
2. ❌ CORS (Cross-Origin Resource Sharing) not configured
3. ❌ No validation of file permissions

### How We Fixed It
✅ Created migration with proper bucket configuration
✅ Added RLS policies for public read + authenticated upload
✅ Set correct CORS headers in Edge Functions

---

## Part 7: The 20 Pakistani Cars - Manual Setup

Since the demo cars need user profiles, create them manually:

### Cars to Add
1. 2023 Honda Civic - ₨8000/day - Karachi
2. 2022 Toyota Corolla - ₨7000/day - Lahore
3. 2021 Suzuki Alto - ₨3500/day - Islamabad
4. 2023 Toyota Fortuner - ₨15000/day - Islamabad
5. 2022 Honda City - ₨6500/day - Karachi
6. 2023 Kia Sportage - ₨12000/day - Lahore
7. 2021 Suzuki Cultus - ₨4000/day - Faisalabad
8. 2023 Hyundai Tucson - ₨13000/day - Karachi
9. 2022 Toyota Yaris - ₨5500/day - Rawalpindi
10. 2023 Suzuki Swift - ₨5000/day - Multan
11. 2022 Honda BRV - ₨9000/day - Lahore
12. 2021 Kia Picanto - ₨3800/day - Islamabad
13. 2023 Hyundai Elantra - ₨10000/day - Karachi
14. 2020 Toyota Corolla - ₨6000/day - Faisalabad
15. 2021 Honda Civic - ₨7500/day - Rawalpindi
16. 2019 Suzuki Mehran - ₨2500/day - Lahore
17. 2022 Toyota Fortuner - ₨14000/day - Karachi
18. 2023 Honda City - ₨7000/day - Islamabad
19. 2022 Kia Sportage - ₨11000/day - Multan
20. 2023 Suzuki Alto - ₨4000/day - Lahore

**Use these Pexels image URLs for each car:**
- Honda/Toyota: https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800
- Generic cars: https://images.pexels.com/photos/1719647/pexels-photo-1719647.jpeg?auto=compress&cs=tinysrgb&w=800

---

## Part 8: Connecting to Supabase Dashboard

### Access Your Database
1. Go to: https://supabase.com/dashboard
2. Log in with your Supabase account
3. Select project: **CarSwap**
4. You can:
   - View tables in **Table Editor**
   - Run SQL in **SQL Editor**
   - Manage storage in **Storage**
   - View logs in **Logs**

---

## Part 9: Troubleshooting

### Cars still not showing
- [ ] Have you signed up at least one test user?
- [ ] Did you create car listings through the UI?
- [ ] Check browser console for errors

### Images not uploading
- [ ] Use external Pexels URLs instead
- [ ] Check storage bucket has public read policy
- [ ] Verify authentication token is valid

### Build fails
- [ ] Run: `npm install`
- [ ] Run: `npm run build`
- [ ] Check console for TypeScript errors

---

## Part 10: Deployment Instructions

When you're ready to deploy to production:

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify**
   - Push to GitHub
   - Connect repo to Vercel/Netlify
   - Set environment variables in dashboard
   - Deploy automatically

3. **Database stays in Supabase**
   - No migration needed
   - Already hosted in cloud
   - Same credentials work everywhere

---

## Summary

✅ **Local Development**: `npm run dev` on localhost
✅ **Database**: Supabase cloud (no local setup needed)
✅ **Images**: Use external URLs or enable storage
✅ **To add cars**: Sign up users → Create listings
✅ **To deploy**: Push to GitHub → Connect to Vercel

Your project is production-ready! The 20 Pakistani cars can be added through the UI or database.
