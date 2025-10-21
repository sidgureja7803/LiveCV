# Implement "Last 5 Resumes" Feature

## 📝 Requirement
Each user can save their **last 5 created resumes**. When they create a 6th resume, the oldest one gets deleted automatically.

---

## 🔧 Implementation

### Step 1: Update `appwriteService.js`

Add this function to `/server/services/appwriteService.js`:

```javascript
/**
 * Save resume with limit (keeps only last 5 resumes per user)
 * @param {Object} resumeData - Resume data
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created document
 */
async function saveResumeWithLimit(resumeData, userId) {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured');
  }
  
  try {
    // Get all user's resumes, sorted by date (newest first)
    const resumes = await listUserResumes(userId);
    
    // If user already has 5 or more resumes, delete the oldest ones
    if (resumes.length >= 5) {
      const resumesToDelete = resumes.slice(4); // Keep first 4, delete rest
      
      for (const resume of resumesToDelete) {
        console.log(`[Appwrite] Deleting old resume: ${resume.$id}`);
        
        // Delete PDF file if exists
        if (resume.pdfFileId) {
          try {
            await deleteFile(APPWRITE_CONFIG.buckets.pdfs, resume.pdfFileId);
          } catch (err) {
            console.error('[Appwrite] Error deleting PDF:', err);
          }
        }
        
        // Delete YAML file if exists
        if (resume.yamlFileId) {
          try {
            await deleteFile(APPWRITE_CONFIG.buckets.yamls, resume.yamlFileId);
          } catch (err) {
            console.error('[Appwrite] Error deleting YAML:', err);
          }
        }
        
        // Delete resume metadata from database
        await deleteResumeMetadata(resume.$id);
      }
    }
    
    // Now save the new resume
    console.log('[Appwrite] Saving new resume for user:', userId);
    return await saveResumeMetadata(resumeData, userId);
    
  } catch (error) {
    console.error('[Appwrite] Error in saveResumeWithLimit:', error);
    throw error;
  }
}

// Export the new function
module.exports = {
  saveResumeMetadata,
  saveResumeWithLimit,  // <-- Add this
  updateResumeMetadata,
  getResumeMetadata,
  listUserResumes,
  deleteResumeMetadata,
  uploadPDF,
  uploadYAML,
  downloadFile,
  deleteFile
};
```

---

### Step 2: Update Resume Metadata Schema

Modify the `saveResumeMetadata` function to include file IDs:

```javascript
async function saveResumeMetadata(resumeData, userId) {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured');
  }
  
  try {
    const document = await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.resumes,
      ID.unique(),
      {
        userId,
        name: resumeData.personalInfo?.fullName || 'Untitled Resume',
        theme: resumeData.rendercvTheme || 'classic',
        yamlContent: resumeData.yamlContent || null,
        lastPdfUrl: resumeData.lastPdfMetadata?.url || null,
        lastPdfFileSize: resumeData.lastPdfMetadata?.fileSize || 0,
        pdfFileId: resumeData.lastPdfMetadata?.fileId || null,     // <-- Add this
        yamlFileId: resumeData.yamlFileMetadata?.fileId || null,   // <-- Add this
        contentHash: resumeData.lastPdfMetadata?.contentHash || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ]
    );
    
    return document;
  } catch (error) {
    console.error('[Appwrite] Error saving resume metadata:', error);
    throw error;
  }
}
```

---

### Step 3: Update Appwrite Collection Attributes

Add these attributes to your `resumes` collection in Appwrite Console:

| Attribute Key | Type | Size | Required | Default |
|---------------|------|------|----------|---------|
| `pdfFileId` | String | 255 | No | - |
| `yamlFileId` | String | 255 | No | - |

---

### Step 4: Update Resume Controller

Modify `/server/controllers/resumeController.js` to use the new function:

```javascript
const appwriteService = require('../services/appwriteService');

exports.saveResume = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const userId = req.userId; // From auth middleware
    
    // Upload PDF and YAML files
    const pdfFile = await appwriteService.uploadPDF(
      pdfBuffer, 
      `${resumeData.personalInfo.fullName}_Resume.pdf`, 
      userId
    );
    
    const yamlFile = await appwriteService.uploadYAML(
      yamlContent, 
      `${resumeData.personalInfo.fullName}_Resume.yaml`, 
      userId
    );
    
    // Add file IDs to resume data
    resumeData.lastPdfMetadata = {
      url: pdfFile.url,
      fileSize: pdfFile.fileSize,
      fileId: pdfFile.fileId  // <-- Include this
    };
    
    resumeData.yamlFileMetadata = {
      fileId: yamlFile.fileId  // <-- Include this
    };
    
    // Save with limit (keeps only last 5)
    const document = await appwriteService.saveResumeWithLimit(resumeData, userId);
    
    res.json({
      success: true,
      resume: document,
      message: 'Resume saved successfully'
    });
    
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save resume',
      error: error.message
    });
  }
};
```

---

### Step 5: Update Frontend API Service

Modify `/client/src/services/api.ts`:

```typescript
export const apiService = {
  async saveResume(resumeData: ResumeData): Promise<any> {
    const response = await fetch(`${API_URL}/api/resumes/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ resumeData })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save resume');
    }
    
    return response.json();
  },
  
  async getUserResumes(): Promise<any[]> {
    const response = await fetch(`${API_URL}/api/resumes/list`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get resumes');
    }
    
    const data = await response.json();
    return data.resumes;
  }
};
```

---

## 🎯 How It Works

### User Creates Resume #1-5:
1. User edits resume data
2. Backend generates PDF and YAML
3. Files uploaded to Appwrite storage
4. Metadata saved to database
5. User has 1-5 resumes ✅

### User Creates Resume #6:
1. Backend checks: User has 5 resumes
2. Gets oldest resume (by `createdAt` date)
3. **Deletes:**
   - PDF file from storage
   - YAML file from storage
   - Database record
4. Saves new resume
5. User still has 5 resumes (newest 5) ✅

---

## 📊 Database Query

The `listUserResumes()` function returns resumes ordered by date:

```javascript
const response = await databases.listDocuments(
  APPWRITE_CONFIG.databaseId,
  APPWRITE_CONFIG.collections.resumes,
  [
    Query.equal('userId', userId),
    Query.orderDesc('updatedAt'),  // Newest first
    Query.limit(100)
  ]
);
```

So `resumes[0]` = newest, `resumes[4]` = 5th newest, `resumes[5]` = oldest (to delete)

---

## 🎨 Display Last 5 Resumes in Dashboard

In `/client/src/pages/Dashboard.tsx`:

```tsx
const [userResumes, setUserResumes] = useState([]);

useEffect(() => {
  async function loadResumes() {
    const resumes = await apiService.getUserResumes();
    setUserResumes(resumes.slice(0, 5)); // Show only 5
  }
  loadResumes();
}, []);

return (
  <div className="resume-list">
    <h2>Your Recent Resumes (Last 5)</h2>
    {userResumes.map(resume => (
      <div key={resume.$id} className="resume-card">
        <h3>{resume.name}</h3>
        <p>Theme: {resume.theme}</p>
        <p>Updated: {new Date(resume.updatedAt).toLocaleDateString()}</p>
        <a href={resume.lastPdfUrl} target="_blank">View PDF</a>
      </div>
    ))}
  </div>
);
```

---

## ✅ Testing

1. **Login** to your app
2. **Create 6 resumes** with different names
3. **Check Appwrite Console:**
   - Database → resumes collection
   - Storage → resume-pdfs bucket
   - Should see only 5 resumes
4. **First resume should be gone**
5. **Newest 5 should remain** ✅

---

## 🚀 Benefits

- ✅ **Automatic cleanup** - No manual deletion needed
- ✅ **Storage efficient** - Limits storage per user
- ✅ **User-friendly** - Always shows recent work
- ✅ **Scalable** - Works for any number of users

---

## 📝 Summary

1. Add `saveResumeWithLimit()` function
2. Track file IDs in database
3. Delete old files before saving new ones
4. Always keep newest 5 resumes

**Implementation time:** ~30 minutes
**Complexity:** Easy
**Status:** Ready to implement!
