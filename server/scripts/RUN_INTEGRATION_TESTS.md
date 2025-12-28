# Quick Start: Running Integration Tests

## Prerequisites

1. **Install Dependencies** (if not already done)
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment**
   - Ensure `server/.env` has all required Appwrite credentials
   - Required variables:
     - `APPWRITE_ENDPOINT`
     - `APPWRITE_PROJECT_ID`
     - `APPWRITE_API_KEY`
     - `APPWRITE_DATABASE_ID`

3. **Start the Server**
   ```bash
   cd server
   npm start
   ```
   
   Keep this terminal running!

## Run Automated Tests

In a **new terminal**:

```bash
cd server
node scripts/test-integration.js
```

## Expected Output

```
╔════════════════════════════════════════════════════════════╗
║      LiveCV Frontend-Backend Integration Tests            ║
╚════════════════════════════════════════════════════════════╝

Base URL: http://localhost:3001
Appwrite Endpoint: https://sgp.cloud.appwrite.io/v1
Appwrite Project: 694e7d64003cdc2bc774

Checking if server is running...
✅ Server is running

📝 Creating test user...
✅ Test user created: test-1735123456789@livecv-test.com (ID: abc123)
✅ Session created for test user

╔════════════════════════════════════════════════════════════╗
║         SUBTASK 7.1: Test Resume Creation Flow            ║
╚════════════════════════════════════════════════════════════╝

Test 1: Create new resume via API
✅ PASS: POST /api/resume creates new resume
   Status: 201 (Expected 201)

... (more tests)

╔════════════════════════════════════════════════════════════╗
║                      Test Summary                          ║
╚════════════════════════════════════════════════════════════╝

Total Tests: 17
✅ Passed: 17
❌ Failed: 0
Success Rate: 100.0%
```

## Troubleshooting

### Error: Cannot connect to server

**Problem:** Server is not running

**Solution:**
```bash
cd server
npm start
```

### Error: Invalid credentials

**Problem:** Appwrite credentials are incorrect or missing

**Solution:**
1. Check `server/.env` file
2. Verify all Appwrite variables are set correctly
3. Test Appwrite connection manually

### Error: RenderCV not installed

**Problem:** PDF generation tests show status 500

**Solution:**
```bash
pip install rendercv
```

Note: This is optional. Tests will still pass, but PDF generation will be skipped.

## Manual Testing

For manual testing, see: `server/scripts/manual-integration-tests.md`

## More Information

- Full documentation: `server/scripts/INTEGRATION_TESTS_README.md`
- Summary: `INTEGRATION_TESTS_SUMMARY.md`
- Manual checklist: `server/scripts/manual-integration-tests.md`

## Quick Commands

```bash
# Start server
cd server && npm start

# Run tests (in new terminal)
cd server && node scripts/test-integration.js

# View test documentation
cat server/scripts/INTEGRATION_TESTS_README.md

# View manual test checklist
cat server/scripts/manual-integration-tests.md
```

## Test Coverage

- ✅ Resume creation flow (5 tests)
- ✅ PDF generation flow (5 tests)
- ✅ Resume limit flow (7 tests)
- **Total: 17 automated integration tests**

## Success Criteria

All tests should pass with:
- ✅ Test user created and cleaned up
- ✅ All API endpoints responding correctly
- ✅ Resume CRUD operations working
- ✅ PDF generation working (or gracefully failing if RenderCV not installed)
- ✅ Resume limit enforced correctly
- ✅ Oldest resume deleted when limit reached
- ✅ Storage cleanup executed

## Exit Codes

- `0` - All tests passed ✅
- `1` - One or more tests failed ❌

Perfect for CI/CD integration!
