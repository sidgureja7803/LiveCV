# 🚀 LiveCV RenderCV Quick Start Guide

Get the new RenderCV PDF generation system running in 5 minutes!

## Step 1: Install RenderCV (Required)

```bash
pip install rendercv
```

Verify installation:
```bash
rendercv --version
```

Expected output: `RenderCV X.X.X`

## Step 2: Install Node Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

## Step 3: Test RenderCV Locally

Before starting the full application, test that RenderCV works:

```bash
cd server
npm run render:local
```

You should see:
```
✅ RenderCV is installed
Testing theme: classic
  ✓ YAML saved: .../test_classic.yaml
  ✅ PDF generated in 2340ms
  ✓ PDF saved: .../test_classic.pdf
  ✓ Size: 45.23 KB
...
✅ Testing complete!
```

Check the generated PDFs in `server/test-output/`

## Step 4: Configure Environment

**server/.env:**
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_at_least_32_chars
CLERK_SECRET_KEY=your_clerk_secret_key
FRONTEND_URL=http://localhost:5173
```

**client/.env:**
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Step 5: Start Development Servers

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

Wait for: `LiveCV server running on port 5001`

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

Wait for: `Local: http://localhost:5173/`

## Step 6: Test the Application

1. Open browser: `http://localhost:5173`
2. Sign in with Clerk authentication
3. Create a new resume
4. Click **"Save Resume"** (important!)
5. Toggle preview mode from **HTML** to **PDF**
6. Watch the PDF generate in the preview panel
7. Try changing fields - PDF updates after 800ms
8. Select different themes (Classic, ModernCV, etc.)
9. Click **"Download PDF"**

## 🎉 Success Indicators

### Backend Console:
```
[RenderCV] Executing: rendercv render "/tmp/livecv-render-.../resume.yaml"
[RenderCV] Render complete in 2340ms (PDF size: 45.23 KB)
[Preview] Generated PDF for resume 507f1f77bcf86cd799439011 in 2350ms
```

### Frontend:
- PDF appears in right panel
- "Updated HH:MM:SS" timestamp shows
- Debounce indicator appears when typing

## 🔥 Quick API Test

Test the API directly:

```bash
# Health check
curl http://localhost:5001/api/render/health

# Expected: {"success":true,"message":"RenderCV service is operational"}
```

```bash
# Cache stats
curl http://localhost:5001/api/render/cache/stats

# Expected: {"success":true,"cache":{...}}
```

## ⚡ Pro Tips

### Faster Development
1. Use **HTML mode** for quick layout changes
2. Switch to **PDF mode** for final review
3. Cache keeps PDFs for 1 hour (no regeneration needed)

### Performance
- First PDF: ~2-5 seconds
- Cached PDF: <50ms
- Debounce delay: 800ms (wait this long after typing)

### Debugging
If PDF doesn't generate:
```bash
# Check RenderCV
rendercv --version

# Check backend logs
cd server
npm run dev
# Look for errors in console

# Test locally
npm run render:local
```

## 📋 Feature Checklist

Test these features:

- [ ] Save resume
- [ ] Toggle HTML/PDF preview
- [ ] Change RenderCV theme
- [ ] Edit personal info (watch PDF update)
- [ ] Add experience entry
- [ ] Add education entry
- [ ] Download PDF
- [ ] Check downloaded PDF quality

## 🐛 Common Issues

### "RenderCV not found"
```bash
pip install rendercv
# or
cd server && npm run setup:rendercv
```

### PDF not showing
1. Check you saved the resume first
2. Look at browser console (F12)
3. Check server logs for errors
4. Verify MongoDB is connected

### Slow PDF generation
- First render is always slower (2-5s)
- Subsequent renders should be cached (<50ms)
- Check server logs for cache hit/miss

## 🎨 Available Themes

Try all four:

| Theme | Style |
|-------|-------|
| `classic` | Traditional blue accents |
| `moderncv` | Modern sidebar layout |
| `sb2nov` | Software engineer favorite |
| `engineeringresumes` | Technical optimized |

## 📚 Next Steps

1. ✅ Basic setup working? Read `IMPLEMENTATION_SUMMARY.md`
2. ✅ Want to customize? Check `README.md` → RenderCV Pipeline section
3. ✅ Deploying? See `IMPLEMENTATION_SUMMARY.md` → Deployment Checklist
4. ✅ Need help? Check Troubleshooting sections

## 🎓 Architecture (Simplified)

```
You type in form
    ↓ (800ms debounce)
POST /api/render/:id/preview
    ↓
Convert JSON → YAML
    ↓
Check cache
    ↓
├─ HIT: Return PDF (50ms)
└─ MISS: Run RenderCV (2-5s)
    ↓
Store in cache
    ↓
Stream PDF to browser
    ↓
Display in <iframe>
```

## 💡 Quick Commands Reference

```bash
# Install RenderCV
pip install rendercv

# Test RenderCV locally
cd server && npm run render:local

# Start backend
cd server && npm run dev

# Start frontend
cd client && npm run dev

# Install backend deps
cd server && npm install

# Install frontend deps
cd client && npm install
```

---

**Time to working system: ~5 minutes**  
**Questions? Check IMPLEMENTATION_SUMMARY.md**
