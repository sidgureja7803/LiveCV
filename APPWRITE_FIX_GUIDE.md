# 🚨 CRITICAL: Fix Appwrite Database Schema

## The Problem

Your Dashboard shows this error:
```
Error fetching resumes: AppwriteException: Invalid query: Attribute not found in schema: userId
```

This means the **resumes** collection in Appwrite is missing the `userId` attribute.

---

## The Solution (5 Minutes)

### Step-by-Step Instructions

#### 1. Open Appwrite Console
Go to: **https://cloud.appwrite.io/console**

Login with your Appwrite account credentials.

---

#### 2. Select Your Project
- You'll see a list of projects
- Click on the project with ID: **68e970330382476bf61**
- Or look for your "LiveCV" project

---

#### 3. Navigate to Databases
- In the left sidebar, click on **"Databases"** (database icon)
- You should see your database: **livecv-production**
- Click on **livecv-production**

---

#### 4. Open the Resumes Collection
- You'll see a list of collections
- Find and click on **"resumes"**
- This will open the resumes collection view

---

#### 5. Go to Attributes Tab
- At the top, you'll see tabs: **Documents**, **Attributes**, **Indexes**, **Settings**
- Click on the **"Attributes"** tab
- You'll see a list of current attributes (columns)

---

#### 6. Create the userId Attribute

Click the **"Create Attribute"** button (usually blue, top right)

A form will appear. Fill it in **EXACTLY** as shown:

```
┌─────────────────────────────────────┐
│ Attribute Type                      │
│ ○ String  ← SELECT THIS            │
│ ○ Integer                           │
│ ○ Float                             │
│ ○ Boolean                           │
│ ○ DateTime                          │
│ ○ Email                             │
│ ○ IP                                │
│ ○ URL                               │
│ ○ Enum                              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Key (required)                      │
│ [userId                        ]    │ ← Type: userId
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Size (required)                     │
│ [36                            ]    │ ← Type: 36
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ☑ Required                          │ ← Check this box
│ ☐ Array                             │ ← Leave unchecked
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Default Value                       │
│ [                              ]    │ ← Leave EMPTY
└─────────────────────────────────────┘
```

**Settings:**
- **Type:** String
- **Key:** `userId`
- **Size:** `36`
- **Required:** ✅ Checked
- **Array:** ⬜ Unchecked  
- **Default:** (leave empty)

Click the **"Create"** button at the bottom.

---

#### 7. Wait for Indexing
- After clicking Create, you'll see a progress indicator
- Wait 10-30 seconds for the attribute to be created
- The status will change from "Creating" to "Available"
- **Do NOT refresh or close the page during this time**

---

#### 8. Verify the Attribute
- You should now see `userId` in the attributes list
- It should show:
  - Type: `string`
  - Size: `36`
  - Required: `Yes`

---

#### 9. Test Your Application
1. Go back to your browser with LiveCV open
2. **Hard refresh:** Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
3. Navigate to the **Dashboard** page
4. The error should be gone!

---

## 🎉 Success Checklist

After adding the `userId` attribute:

- [ ] No console errors about "Attribute not found"
- [ ] Dashboard loads without errors
- [ ] Can see your saved resumes (if you have any)
- [ ] Can create new resumes
- [ ] Can edit existing resumes

---

## 🔍 Verify Other Required Attributes

While you're in the Attributes tab, make sure these attributes also exist:

| Attribute | Type | Size | Required | Array |
|-----------|------|------|----------|-------|
| `userId` | string | 36 | Yes | No |
| `name` | string | 255 | Yes | No |
| `theme` | string | 50 | Yes | No |
| `templateId` | string | 50 | No | No |
| `yamlContent` | string | 100000 | No | No |
| `pdfUrl` | string | 500 | No | No |
| `yamlUrl` | string | 500 | No | No |
| `updatedAt` | string | 50 | Yes | No |
| `atsScore` | integer | - | No | No |

**If any are missing,** create them using the same process as above (Step 6).

---

## 🆘 Troubleshooting

### "I don't see the Create Attribute button"
- Make sure you're on the **Attributes** tab, not the Documents tab
- Check that you have **Owner** or **Developer** permissions in the project

### "The attribute creation is stuck"
- Wait at least 60 seconds
- If still stuck, refresh the Appwrite console page
- Check the Attributes tab to see if it was created

### "I still get the error after adding userId"
1. **Hard refresh** your browser (Ctrl+Shift+R)
2. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click the refresh button → "Empty Cache and Hard Reload"
3. **Check the attribute was created:**
   - Go back to Appwrite Console
   - Resumes collection → Attributes tab
   - Verify `userId` is listed
4. **Check browser console:**
   - Open DevTools (F12) → Console tab
   - Look for any new error messages
   - Share the exact error with me

### "How do I know if it worked?"
Open browser console (F12) and look for:
- ✅ **Success:** `Session check: User found`  
- ✅ **Success:** No red errors
- ❌ **Still broken:** `Attribute not found in schema`

---

## 📞 Need Help?

If you're stuck after following these steps:

1. Take a screenshot of:
   - The Appwrite Attributes tab showing all attributes
   - The browser console errors (F12 → Console tab)
   - The Network tab showing the failed request (F12 → Network tab)

2. Share:
   - What step you're stuck on
   - The exact error message
   - Screenshots from step 1

---

## 🎯 Why This Is Needed

The LiveCV application stores resumes in Appwrite's database. Each resume document needs to know which user it belongs to. This is done using the `userId` field.

**Without the `userId` attribute:**
- ❌ Can't query resumes by user
- ❌ Dashboard can't load your resumes
- ❌ Can't determine resume ownership

**With the `userId` attribute:**  
- ✅ Each resume is linked to its owner
- ✅ Dashboard shows only your resumes
- ✅ Proper access control and permissions

---

**This is the MOST IMPORTANT step to fix your application!**

Once this is done, everything else should work perfectly. 🚀
