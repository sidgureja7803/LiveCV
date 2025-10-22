# LiveCV Testing Checklist

## 🧪 Complete Testing Guide

### Prerequisites
- [ ] Backend server running on port 5001
- [ ] Frontend dev server running on port 5173
- [ ] User is logged in to the application

---

## 1. 🚪 Logout Button Test

### Steps:
1. [ ] Navigate to Dashboard
2. [ ] Look at the bottom of the left sidebar
3. [ ] Verify you can see:
   - [ ] Your profile picture/avatar
   - [ ] Your name
   - [ ] Your email
   - [ ] "Settings" link with gear icon
   - [ ] "Logout" button with logout icon

### Expected Behavior:
- [ ] Logout button has red hover effect
- [ ] Clicking logout redirects to `/login`
- [ ] User session is cleared
- [ ] Cannot access dashboard without logging in again

### Visual Check:
```
╔═══════════════════════════════╗
║  [👤] User Name               ║
║       user@email.com          ║
║                               ║
║  [⚙️] Settings                ║
║  [🚪] Logout                   ║
╚═══════════════════════════════╝
```

---

## 2. 📄 Templates Display Test

### Steps:
1. [ ] Navigate to Dashboard (`/dashboard`)
2. [ ] Scroll to "Available Templates" section
3. [ ] Count the number of templates displayed

### Expected Results:
- [ ] Exactly **5 templates** are visible
- [ ] Grid layout shows 5 columns on large screens
- [ ] Each template card shows:
  - [ ] Template icon/placeholder
  - [ ] Template name
  - [ ] Theme name
  - [ ] Category badge (colored)

### Template List to Verify:
1. [ ] **Modern Professional** (Moderncv Theme) - Blue "modern" badge
2. [ ] **Professional Elegant** (Classic Theme) - Green "professional" badge
3. [ ] **Creative Portfolio** (Sb2nov Theme) - Purple "creative" badge
4. [ ] **Engineering Classic** (Engineeringclassic Theme) - Green "professional" badge
5. [ ] **Engineering Resumes** (Engineeringresumes Theme) - Blue "modern" badge

### Visual Layout:
```
┌────────┬────────┬────────┬────────┬────────┐
│ Modern │ Prof   │Creative│ Eng    │ Eng    │
│ Prof   │ Elegant│Portfolio│Classic │ Resumes│
│ [👁][+] │ [👁][+] │ [👁][+] │ [👁][+] │ [👁][+] │
└────────┴────────┴────────┴────────┴────────┘
```

---

## 3. 👁️ Template Preview Test

### Steps:
1. [ ] Hover over any template card
2. [ ] Verify overlay appears with two buttons
3. [ ] Click the blue eye icon button
4. [ ] PDF preview modal should open

### Expected Behavior:
- [ ] Modal displays PDF preview
- [ ] Can navigate if multi-page
- [ ] Close button works
- [ ] Modal closes when clicking outside

### Console Check:
Open browser console (F12) and verify:
- [ ] No 404 errors for PDF files
- [ ] See log: "📥 Fetching templates from..."
- [ ] See log: "✅ Loaded 5 templates..."

---

## 4. ➕ YAML Auto-Fill Test

### Steps:
1. [ ] Hover over a template card
2. [ ] Click the green plus "+" button
3. [ ] Watch the console for logs
4. [ ] Verify redirect to builder page

### Expected Console Logs:
```
📄 Loading YAML data for template: [theme-name]
✅ YAML data loaded: {data...}
```

### Expected Behavior:
- [ ] Redirected to `/builder?template=[theme-name]`
- [ ] localStorage contains `templateData` key
- [ ] YAML data includes:
  - [ ] Personal info (name, email, phone)
  - [ ] Education entries
  - [ ] Experience entries
  - [ ] Skills
  - [ ] Projects (if applicable)

### Verify localStorage:
```javascript
// In browser console:
JSON.parse(localStorage.getItem('templateData'))
```

Should return:
```json
{
  "theme": "classic",
  "yamlData": {
    "cv": {...},
    "design": {...}
  },
  "templateName": "Classic Theme"
}
```

---

## 5. 🔌 Backend API Test

### Manual API Tests (using curl or Postman):

#### Test 1: Get All Templates
```bash
curl http://localhost:5001/api/templates
```

Expected Response:
```json
{
  "success": true,
  "count": 5,
  "templates": [...]
}
```

#### Test 2: Get Specific PDF
```bash
curl http://localhost:5001/api/templates/John_Doe_ClassicTheme_CV.pdf
```
- [ ] Should return PDF file
- [ ] Content-Type should be `application/pdf`

#### Test 3: Get YAML Data
```bash
curl http://localhost:5001/api/templates/yaml/classic
```

Expected Response:
```json
{
  "success": true,
  "theme": "classic",
  "data": {
    "cv": {...},
    "design": {...}
  }
}
```

### Server Console Check:
- [ ] See log: `[Templates] Found 5 templates`
- [ ] No error messages about missing files

---

## 6. 🎨 UI/UX Verification

### Sidebar:
- [ ] Logo and app name at top
- [ ] Navigation links work
- [ ] Active route is highlighted
- [ ] User profile at bottom
- [ ] Logout button styled correctly

### Dashboard:
- [ ] Welcome message shows user name
- [ ] "Create New Resume" button works
- [ ] Templates load without errors
- [ ] Hover effects work smoothly
- [ ] Category badges have correct colors

### Responsive Design:
- [ ] Test on desktop (works on 5 columns)
- [ ] Test on tablet (should adjust to 2-3 columns)
- [ ] Test on mobile (should show 1 column)

---

## 7. 🐛 Error Handling Tests

### Test Missing Backend:
1. [ ] Stop the backend server
2. [ ] Reload dashboard
3. [ ] Verify error message: "No templates available. Please check your backend connection."

### Test Network Error:
1. [ ] Open DevTools Network tab
2. [ ] Set offline mode
3. [ ] Try loading templates
4. [ ] Verify graceful error handling

---

## 8. 🔄 Integration Tests

### Full User Flow:
1. [ ] Login to application
2. [ ] Navigate to dashboard
3. [ ] See all 5 templates
4. [ ] Preview a template (eye icon)
5. [ ] Close preview
6. [ ] Use a template (+ icon)
7. [ ] Redirected to builder
8. [ ] Builder has pre-filled data
9. [ ] Can edit the data
10. [ ] Navigate back to dashboard
11. [ ] Click logout
12. [ ] Redirected to login page

---

## ✅ Success Criteria

All tests pass when:
- [ ] All 5 templates are visible
- [ ] No console errors
- [ ] Logout button works correctly
- [ ] YAML auto-fill populates builder
- [ ] Backend API returns all templates
- [ ] PDF previews work
- [ ] UI is responsive and styled correctly
- [ ] No 404 or 500 errors in network tab

---

## 🆘 Troubleshooting

### Templates Don't Show
- Check backend is running: `http://localhost:5001/api/templates`
- Verify `.env` has correct `VITE_API_URL`
- Check browser console for errors

### YAML Auto-Fill Doesn't Work
- Verify `yaml` package is installed in server
- Check server console for YAML parsing errors
- Verify YAML files exist in `server/templates/` folder

### Logout Button Not Visible
- Clear browser cache
- Verify Sidebar component imported correctly
- Check `useAuth` hook is working

---

## 📊 Testing Status

Mark completed tests:

- [ ] Logout Button - ⏳ Pending
- [ ] 5 Templates Display - ⏳ Pending  
- [ ] Template Preview - ⏳ Pending
- [ ] YAML Auto-Fill - ⏳ Pending
- [ ] Backend API - ⏳ Pending
- [ ] UI/UX - ⏳ Pending
- [ ] Error Handling - ⏳ Pending
- [ ] Full Integration - ⏳ Pending

**Last Updated:** [DATE]
**Tested By:** [YOUR NAME]
