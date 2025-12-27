# Implementation Plan: LiveCV Project Audit and Fixes

## Overview

This implementation plan breaks down the audit and fixes for the LiveCV resume builder into discrete, actionable tasks. The focus is on ensuring proper configuration, implementing a 5-resume limit per user, cleaning up unnecessary files, and verifying all integrations work correctly.

## Tasks

- [x] 1. Configuration Validation and Startup Checks
  - Create configuration validator to verify all required environment variables
  - Add startup validation to server
  - Ensure Appwrite connectivity is verified on startup
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 1.1 Create configuration validator module
  - Create `server/config/validateConfig.js`
  - Implement `validateAppwriteConfig()` function to check required env vars
  - Implement `validateRenderCVConfig()` function to check RenderCV installation
  - Return detailed error messages for missing configuration
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 1.2 Integrate configuration validation with server startup
  - Import validator in `server/server.js`
  - Call validation functions before starting server
  - Log validation results
  - Exit gracefully if critical config is missing
  - _Requirements: 1.3, 1.4_

- [x] 2. File Structure Cleanup
  - Remove all unnecessary files from the repository
  - Update .gitignore to prevent future commits of system files
  - Create cleanup script for automated maintenance
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 2.1 Remove .DS_Store files
  - Delete `.DS_Store` from root directory
  - Delete `client/.DS_Store`
  - Delete `server/.DS_Store`
  - Delete `images/.DS_Store`
  - _Requirements: 4.1_

- [x] 2.2 Update .gitignore files
  - Add macOS system files to root `.gitignore` (.DS_Store, .AppleDouble, .LSOverride)
  - Add common IDE files if not already present
  - Add temporary files and build artifacts
  - Verify node_modules and dist folders are ignored
  - _Requirements: 4.2_

- [x] 2.3 Create automated cleanup script
  - Create `server/scripts/cleanup.sh`
  - Add command to find and delete .DS_Store files recursively
  - Add command to remove accidentally committed build artifacts
  - Make script executable (chmod +x)
  - Document script usage in README
  - _Requirements: 4.3_

- [x] 3. Resume Limit Service Implementation
  - Implement 5-resume limit per user
  - Automatically delete oldest resume when limit is reached
  - Clean up associated files from Appwrite storage
  - _Requirements: 1.5_

- [x] 3.1 Create resume limit service
  - Create `server/services/resumeLimitService.js`
  - Define RESUME_LIMIT constant (5)
  - Implement `enforceResumeLimit(userId)` function
  - Implement `deleteResumeWithFiles(resumeId)` function
  - Implement `getResumeCount(userId)` function
  - Handle errors gracefully (file may not exist in storage)
  - _Requirements: 1.5_

- [x] 3.2 Integrate resume limit with resume creation
  - Import resumeLimitService in `server/controllers/resumeController.js`
  - Call `enforceResumeLimit(userId)` before creating new resume
  - Log which resumes are deleted
  - Return resume count in response
  - _Requirements: 1.5_

- [x] 3.3 Add resume count to dashboard API
  - Update `getUserResumes` endpoint to include count
  - Return `{ resumes: [], count: X, limit: 5, remaining: Y }`
  - Ensure count is accurate after deletions
  - _Requirements: 1.5_

- [x] 3.4 Update frontend dashboard to show resume count
  - Modify `client/src/pages/Dashboard.tsx`
  - Display "X/5 resumes" indicator
  - Show remaining slots available
  - Add visual indicator when approaching limit (4/5 or 5/5)
  - _Requirements: 1.5_

- [x] 3.5 Add frontend warning modal for resume limit
  - Create warning modal component
  - Show modal when user attempts to create resume at limit
  - Display which resume will be deleted (oldest)
  - Provide "Cancel" and "Continue" options
  - Allow user to download oldest resume before deletion
  - _Requirements: 1.5_

- [x] 4. Checkpoint - Verify Core Functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. RenderCV Integration Verification
  - Verify RenderCV is properly installed and configured
  - Test PDF generation for all themes
  - Validate YAML conversion
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 5.1 Verify RenderCV installation
  - Check if RenderCV is installed (`rendercv --version`)
  - Verify Python version is 3.8+
  - Test RenderCV CLI with sample YAML
  - Document installation steps if missing
  - _Requirements: 5.1, 5.4_

- [x] 5.2 Test PDF generation for all themes
  - Generate PDF for classic theme
  - Generate PDF for moderncv theme
  - Generate PDF for sb2nov theme
  - Generate PDF for engineeringresumes theme
  - Generate PDF for engineeringclassic theme
  - Verify all PDFs are valid and render correctly
  - _Requirements: 5.2, 5.3, 5.5_

- [x] 5.3 Validate theme synchronization
  - Verify all template IDs in `client/src/config/templates.ts` match RenderCV themes
  - Check theme mapping in `server/utils/jsonToYamlMapper.js`
  - Ensure engineeringclassic maps to engineeringresumes correctly
  - Test theme selection in frontend
  - _Requirements: 2.1, 2.4, 5.2_

- [x] 5.4 Test YAML validation
  - Test `validateRenderCVYaml()` function with valid YAML
  - Test with invalid YAML (missing required fields)
  - Test with malformed YAML syntax
  - Verify error messages are descriptive
  - _Requirements: 5.4_

- [-] 6. API Endpoint Verification
  - Test all resume API endpoints
  - Test all render API endpoints
  - Verify authentication middleware
  - Verify error handling
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [-] 6.1 Test resume CRUD endpoints
  - Test GET /api/resume/:id (with and without auth)
  - Test GET /api/resume/user/all (requires auth)
  - Test POST /api/resume (requires auth)
  - Test PUT /api/resume/:id (requires auth)
  - Test DELETE /api/resume/:id (requires auth)
  - Verify 401 responses for unauthorized requests
  - _Requirements: 6.1, 6.4_

- [ ] 6.2 Test render endpoints
  - Test GET /api/render/:id/preview
  - Test GET /api/render/:id/download
  - Test POST /api/render/generate
  - Test GET /api/render/:id/yaml
  - Test GET /api/render/health
  - Test GET /api/render/cache/stats
  - _Requirements: 6.1, 6.2_

- [ ] 6.3 Verify CORS configuration
  - Test preflight requests from frontend URL
  - Verify credentials are allowed
  - Test requests from unauthorized origins (should fail)
  - Check CORS headers in responses
  - _Requirements: 6.3_

- [ ] 6.4 Test error handling
  - Test invalid resume ID format
  - Test non-existent resume ID
  - Test invalid theme parameter
  - Test malformed request body
  - Verify all errors return appropriate status codes (400, 404, 500)
  - Verify error messages are user-friendly
  - _Requirements: 6.2, 9.3_

- [ ] 7. Frontend-Backend Integration Testing
  - Test complete user flows end-to-end
  - Verify data flow from form to PDF
  - Test authentication flow
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 7.1 Test resume creation flow
  - Fill out resume form in frontend
  - Submit to create new resume
  - Verify resume appears in dashboard
  - Verify resume data is saved correctly
  - _Requirements: 7.1, 7.5_

- [ ] 7.2 Test PDF generation flow
  - Edit resume in frontend
  - Trigger PDF preview
  - Verify PDF generates with correct theme
  - Test theme switching
  - Download PDF and verify content
  - _Requirements: 7.4, 7.5_

- [ ] 7.3 Test resume limit flow
  - Create 5 resumes for test user
  - Attempt to create 6th resume
  - Verify warning modal appears
  - Confirm creation
  - Verify oldest resume is deleted
  - Verify storage files are cleaned up
  - _Requirements: 1.5_

- [ ] 8. Checkpoint - Integration Tests Complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Documentation Updates
  - Update README with new features
  - Document 5-resume limit
  - Update environment variable documentation
  - Add troubleshooting guide
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 9.1 Update README with 5-resume limit
  - Add section explaining user resume limits
  - Document automatic cleanup behavior
  - Explain user experience (warning modal, etc.)
  - Add to "Key Features" section
  - _Requirements: 8.1, 8.4_

- [ ] 9.2 Update environment variable documentation
  - Create/update `.env.example` files for client and server
  - Mark required vs optional variables
  - Add comments explaining each variable
  - Verify all variables in actual .env are documented
  - _Requirements: 8.3_

- [ ] 9.3 Update template documentation
  - Verify `server/templates/README.md` is accurate
  - Update main README section on templates
  - Clarify server templates are examples only
  - Document how to add new themes
  - _Requirements: 2.3, 8.1_

- [ ] 9.4 Add troubleshooting guide
  - Add section for common issues
  - Document RenderCV installation problems
  - Document Appwrite connection issues
  - Document PDF generation errors
  - Add solutions for each issue
  - _Requirements: 8.2, 8.5_

- [ ] 10. Security and Error Handling Improvements
  - Verify security best practices
  - Improve error logging
  - Add input validation
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 10.1 Verify security configuration
  - Check if helmet middleware is configured
  - Verify CORS is properly restricted
  - Ensure .env files are in .gitignore
  - Verify no secrets in git history
  - Check API keys are not logged
  - _Requirements: 9.4, 10.1, 10.2, 10.3_

- [ ] 10.2 Improve error logging
  - Add request IDs for tracing
  - Implement structured logging format
  - Add timestamps to all logs
  - Ensure sensitive data is not logged (API keys, passwords)
  - Log resume limit enforcement actions
  - _Requirements: 9.1, 9.2, 9.4, 9.5_

- [ ] 10.3 Add input validation
  - Validate resume data structure before saving
  - Sanitize user inputs
  - Validate theme parameter against whitelist
  - Validate file uploads (if applicable)
  - Return descriptive validation errors
  - _Requirements: 9.3, 10.4_

- [ ] 11. Final Verification and Testing
  - Run complete test suite
  - Verify all requirements are met
  - Test on clean environment
  - _Requirements: All_

- [ ] 11.1 Run manual test checklist
  - Server starts without errors
  - Appwrite connection successful
  - RenderCV working
  - Create/edit/delete resume works
  - PDF generation works for all themes
  - Resume limit enforced correctly
  - All templates visible and working
  - Dashboard shows resume count
  - Warning modal appears at limit
  - _Requirements: All_

- [ ] 11.2 Verify all files are cleaned up
  - No .DS_Store files in repository
  - .gitignore properly configured
  - No unnecessary files committed
  - All documentation is accurate
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 11.3 Test on clean environment
  - Clone repository fresh
  - Follow setup instructions in README
  - Verify all dependencies install correctly
  - Verify application runs without errors
  - Test basic functionality
  - _Requirements: 8.2_

## Notes

- Tasks are organized by priority and dependencies
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Focus on one task at a time for quality
- Test thoroughly before moving to next phase

## Testing Strategy

### Unit Tests
- Configuration validator functions
- Resume limit service functions
- YAML validation functions
- Theme mapping functions

### Integration Tests
- API endpoint responses
- Authentication middleware
- Database operations
- Storage operations

### End-to-End Tests
- Complete user flows
- Resume creation to PDF download
- Resume limit enforcement
- Template selection and PDF generation

### Manual Tests
- Visual verification of PDFs
- UI/UX testing
- Error message clarity
- Documentation accuracy
