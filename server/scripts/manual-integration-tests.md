# Manual Integration Test Checklist

This document provides a comprehensive checklist for manually testing the frontend-backend integration of the LiveCV application.

## Prerequisites

- [ ] Server is running (`cd server && npm start`)
- [ ] Client is running (`cd client && npm run dev`)
- [ ] Appwrite is configured and accessible
- [ ] Test user account created (or use existing account)

## Subtask 7.1: Resume Creation Flow

### Test 1: Create New Resume

**Steps:**
1. Navigate to the template selector page
2. Select any template (e.g., "Classic")
3. Fill out the resume form with test data:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Add at least one experience entry
   - Add at least one education entry
   - Add some skills
4. Click "Save" or "Create Resume"

**Expected Results:**
- [ ] Resume is created successfully
- [ ] Success message is displayed
- [ ] User is redirected to dashboard or resume editor
- [ ] No console errors

**Validation:**
- [ ] Check browser console for errors
- [ ] Check network tab for successful API call (201 status)
- [ ] Verify response contains resume ID

### Test 2: Verify Resume in Dashboard

**Steps:**
1. Navigate to the dashboard
2. Look for the newly created resume

**Expected Results:**
- [ ] Resume appears in the dashboard
- [ ] Resume name is displayed correctly
- [ ] Resume theme is shown
- [ ] Last modified date is shown
- [ ] Resume count indicator shows correct number (e.g., "1/5 resumes")

**Validation:**
- [ ] Resume data matches what was entered
- [ ] Click on resume to open it
- [ ] All data is preserved

### Test 3: Retrieve Resume by ID

**Steps:**
1. Note the resume ID from the URL or dashboard
2. Navigate directly to `/resume/{id}` or use the edit button
3. Verify the resume loads

**Expected Results:**
- [ ] Resume loads successfully
- [ ] All fields are populated with correct data
- [ ] No loading errors
- [ ] Form is editable

### Test 4: Update Resume Data

**Steps:**
1. Open an existing resume
2. Modify some fields:
   - Change the name
   - Update experience description
   - Add a new skill
3. Click "Save"

**Expected Results:**
- [ ] Save operation succeeds
- [ ] Success message is displayed
- [ ] Changes are persisted
- [ ] Refreshing the page shows updated data

**Validation:**
- [ ] Check network tab for PUT request (200 status)
- [ ] Navigate away and back to verify persistence
- [ ] Check last modified date is updated

---

## Subtask 7.2: PDF Generation Flow

### Test 1: Generate PDF Preview

**Steps:**
1. Open an existing resume
2. Click "Preview PDF" or similar button
3. Wait for PDF to generate

**Expected Results:**
- [ ] Loading indicator appears
- [ ] PDF preview is displayed (in iframe or new tab)
- [ ] PDF contains correct resume data
- [ ] PDF uses the selected theme
- [ ] No generation errors

**Validation:**
- [ ] Check network tab for render API call
- [ ] Verify PDF content matches resume data
- [ ] Check for any rendering issues

### Test 2: Test Theme Switching

**Steps:**
1. Open an existing resume
2. Change the theme to "Classic"
3. Generate PDF preview
4. Change theme to "ModernCV"
5. Generate PDF preview again
6. Repeat for "Sb2nov" theme

**Expected Results:**
- [ ] Each theme generates successfully
- [ ] PDF layout changes with each theme
- [ ] Content remains the same across themes
- [ ] No errors during theme switching

**Validation:**
- [ ] Compare PDFs visually
- [ ] Verify theme-specific styling is applied
- [ ] Check that all sections are rendered

### Test 3: Download PDF

**Steps:**
1. Open an existing resume
2. Generate PDF preview
3. Click "Download PDF" button

**Expected Results:**
- [ ] PDF file downloads to computer
- [ ] File name is appropriate (e.g., "John_Doe_Resume.pdf")
- [ ] PDF opens correctly in PDF viewer
- [ ] Content is complete and formatted correctly

**Validation:**
- [ ] Open downloaded PDF
- [ ] Verify all sections are present
- [ ] Check for any formatting issues

### Test 4: Get YAML Representation

**Steps:**
1. Open browser developer tools
2. Navigate to Network tab
3. Generate a PDF preview
4. Find the YAML API call (if exposed)
5. Inspect the YAML response

**Expected Results:**
- [ ] YAML is properly formatted
- [ ] Contains all resume data
- [ ] Follows RenderCV schema
- [ ] No syntax errors

**Alternative (if YAML endpoint is not exposed):**
- Check server logs for YAML generation
- Verify no YAML conversion errors

### Test 5: Save Resume with PDF Generation

**Steps:**
1. Open an existing resume
2. Make some changes to the data
3. Select a theme
4. Click "Save and Generate PDF" (if available)

**Expected Results:**
- [ ] Resume is saved successfully
- [ ] PDF is generated automatically
- [ ] Both operations complete without errors
- [ ] PDF reflects the latest changes

---

## Subtask 7.3: Resume Limit Flow

### Test 1: Create 5 Resumes

**Steps:**
1. Navigate to template selector
2. Create Resume 1 with minimal data
3. Return to dashboard
4. Create Resume 2 with minimal data
5. Repeat until 5 resumes are created

**Expected Results:**
- [ ] All 5 resumes are created successfully
- [ ] Dashboard shows "5/5 resumes"
- [ ] Resume count indicator shows limit reached
- [ ] No errors during creation

**Validation:**
- [ ] Count all resumes in dashboard
- [ ] Verify count indicator is accurate
- [ ] Check for any visual indicators of limit

### Test 2: Verify Resume Count in Dashboard

**Steps:**
1. Navigate to dashboard
2. Look for resume count indicator

**Expected Results:**
- [ ] Count shows "5/5 resumes"
- [ ] Limit indicator is visible
- [ ] Remaining slots shows "0"
- [ ] Visual indicator shows limit reached (e.g., red/orange color)

### Test 3: Attempt to Create 6th Resume

**Steps:**
1. With 5 resumes already created
2. Navigate to template selector
3. Select a template
4. Attempt to create a new resume

**Expected Results:**
- [ ] Warning modal appears before creation
- [ ] Modal explains that oldest resume will be deleted
- [ ] Modal shows which resume will be deleted (name and date)
- [ ] Modal provides "Cancel" and "Continue" options
- [ ] User can download oldest resume before deletion (optional)

**Validation:**
- [ ] Modal content is clear and informative
- [ ] Modal styling is consistent with app design
- [ ] Cancel button works correctly

### Test 4: Confirm Creation and Verify Deletion

**Steps:**
1. In the warning modal, click "Continue" or "Confirm"
2. Wait for operation to complete
3. Navigate to dashboard

**Expected Results:**
- [ ] New resume is created successfully
- [ ] Oldest resume is automatically deleted
- [ ] Dashboard shows "5/5 resumes"
- [ ] New resume appears in the list
- [ ] Oldest resume is no longer in the list
- [ ] Success message is displayed

**Validation:**
- [ ] Count the resumes in dashboard (should be 5)
- [ ] Verify oldest resume ID is gone
- [ ] Verify new resume ID is present
- [ ] Check resume order (newest should be first)

### Test 5: Verify Storage Files Cleanup

**Steps:**
1. After creating 6th resume and deleting oldest
2. Check Appwrite storage (if you have access)
3. Or check server logs for cleanup messages

**Expected Results:**
- [ ] PDF file for deleted resume is removed from storage
- [ ] YAML file for deleted resume is removed from storage
- [ ] No orphaned files remain
- [ ] Server logs show cleanup operations

**Validation (if Appwrite access available):**
- [ ] Navigate to Appwrite console
- [ ] Check "resume-pdfs" bucket
- [ ] Check "resume-yamls" bucket
- [ ] Verify deleted resume files are gone

**Alternative Validation:**
- [ ] Check server logs for "Deleted file" messages
- [ ] Verify no storage errors in logs

### Test 6: Verify Total Count Remains at 5

**Steps:**
1. After creating multiple resumes beyond the limit
2. Refresh the dashboard
3. Count the resumes

**Expected Results:**
- [ ] Dashboard always shows exactly 5 resumes
- [ ] Count indicator shows "5/5"
- [ ] No more than 5 resumes are ever displayed
- [ ] Newest resumes are kept, oldest are deleted

---

## Additional Integration Tests

### Authentication Flow

**Steps:**
1. Log out of the application
2. Try to access dashboard without authentication
3. Try to create a resume without authentication
4. Log back in

**Expected Results:**
- [ ] Unauthenticated requests are blocked
- [ ] User is redirected to login page
- [ ] After login, user can access protected routes
- [ ] Session persists across page refreshes

### Error Handling

**Steps:**
1. Disconnect from internet
2. Try to save a resume
3. Reconnect to internet
4. Try again

**Expected Results:**
- [ ] Error message is displayed when offline
- [ ] Error message is user-friendly
- [ ] Operation succeeds when back online
- [ ] No data is lost

### Data Persistence

**Steps:**
1. Create a resume with detailed data
2. Close the browser completely
3. Reopen the browser
4. Log back in
5. Open the resume

**Expected Results:**
- [ ] All data is preserved
- [ ] No data loss occurred
- [ ] Resume loads correctly
- [ ] All fields are populated

---

## Test Results Summary

### Subtask 7.1: Resume Creation Flow
- [ ] All tests passed
- [ ] Some tests failed (list below)
- [ ] Tests not completed

**Failed Tests:**
- 

**Notes:**


### Subtask 7.2: PDF Generation Flow
- [ ] All tests passed
- [ ] Some tests failed (list below)
- [ ] Tests not completed

**Failed Tests:**
- 

**Notes:**


### Subtask 7.3: Resume Limit Flow
- [ ] All tests passed
- [ ] Some tests failed (list below)
- [ ] Tests not completed

**Failed Tests:**
- 

**Notes:**


---

## Overall Assessment

**Total Tests Completed:** _____ / 20

**Success Rate:** _____%

**Critical Issues Found:**
1. 
2. 
3. 

**Minor Issues Found:**
1. 
2. 
3. 

**Recommendations:**
1. 
2. 
3. 

---

## Sign-off

**Tester Name:** _____________________

**Date:** _____________________

**Signature:** _____________________

**Status:** 
- [ ] All tests passed - Ready for production
- [ ] Minor issues found - Can proceed with caution
- [ ] Critical issues found - Requires fixes before deployment
