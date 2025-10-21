# Image Setup Instructions

## 📸 Move Live Preview Image to Public Folder

The live preview image needs to be accessible from the public folder for the React app to load it.

### Current Location:
```
/images/live_preview.png
```

### Required Location:
```
/client/public/images/live_preview.png
```

---

## 🔧 Steps to Fix

### Option 1: Copy the Image (Recommended)

```bash
# From the project root
mkdir -p client/public/images
cp images/live_preview.png client/public/images/
```

### Option 2: Move the Image

```bash
# From the project root
mkdir -p client/public/images
mv images/live_preview.png client/public/images/
```

---

## ✅ Verify It Works

1. **Check file exists:**
   ```bash
   ls -la client/public/images/live_preview.png
   ```

2. **Start dev server:**
   ```bash
   cd client
   npm run dev
   ```

3. **Visit homepage:** http://localhost:3000
   - Should see resume preview image
   - No broken image icon

4. **Check browser console:**
   - No 404 errors for the image
   - Image loads successfully

---

## 🎯 Why This Location?

Vite (the build tool) serves files from `client/public/` directory:
- Files are accessible at root URL
- `/images/live_preview.png` maps to `/client/public/images/live_preview.png`
- Build process copies public files to dist

---

## 🖼️ Alternative: Use External CDN (Optional)

If you prefer hosting the image on a CDN:

1. Upload to image hosting service (Imgur, Cloudinary, etc.)
2. Update FirstPage.tsx:
   ```tsx
   src="https://your-cdn-url.com/live_preview.png"
   ```

But local hosting is better for:
- ✅ Faster load times
- ✅ No external dependencies
- ✅ Works offline
- ✅ Free

---

## 📁 Final Project Structure

```
LiveCV/
├── client/
│   ├── public/
│   │   └── images/
│   │       └── live_preview.png  ← Image goes here
│   ├── src/
│   │   └── LandingPage/
│   │       └── FirstPage.tsx     ← References /images/live_preview.png
│   └── ...
├── images/
│   └── live_preview.png          ← Original (can keep or delete)
└── ...
```

---

## 🚀 Quick Command

Just run this from project root:

```bash
mkdir -p client/public/images && cp images/live_preview.png client/public/images/
```

That's it! The image will now load on your landing page. ✅
