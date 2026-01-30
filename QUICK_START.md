# CarSwap Pakistan - Quick Start Guide

## 1. Download & Run Locally

```bash
# Navigate to project folder
cd /path/to/carswap

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: **http://localhost:5173**

## 2. Create Test Accounts

1. Click **Sign Up**
2. Create account: `test1@example.com` / `password123`
3. Repeat to create 2-3 accounts for testing

## 3. Add Cars to Your Listings

1. Log in with a test account
2. Click **List Car** in navbar
3. Open file: `PAKISTANI_CARS.md`
4. Copy one car's details
5. Paste into the form
6. Click on **Image URL** tab
7. Click one of the preset buttons (Honda/Toyota/Red Car/SUV) OR paste a Pexels URL
8. Click **List Your Car**

Repeat for all 20 cars!

## 4. View Listed Cars

1. Click **Home**
2. You'll see cars in "Featured Cars" section
3. Click any car to view details

## 5. Build for Publishing

When ready to deploy:

```bash
npm run build
```

This creates optimized files in `dist/` folder.

---

## Database

- **Database**: Supabase (Cloud hosted)
- **No local setup needed**
- **Your .env already has the credentials**
- **Database is shared** - all users can see all cars

---

## Image Upload Solutions

### Solution 1: Use External URLs (Recommended)
- No setup needed
- Use Pexels.com images
- Buttons provided in List Car form
- **Already working!**

### Solution 2: Enable File Upload (Optional)
Contact support to enable Supabase Storage for your project.

---

## Files to Reference

- **SETUP_GUIDE.md** - Detailed technical setup
- **PAKISTANI_CARS.md** - 20 cars with details
- **QUICK_START.md** - This file

---

## Troubleshooting

### App won't start
```bash
npm install
npm run dev
```

### Cars not showing
- Ensure you created cars while logged in
- Check browser console for errors (F12)
- Make sure you clicked "List Your Car" button

### Build errors
```bash
npm run build
```
Check the error message and fix TypeScript issues.

---

## Next Steps

1. Add all 20 Pakistani cars
2. Test booking flow
3. Deploy to Vercel/Netlify when ready

**Happy coding!**
