# Appwrite NYC Endpoint Fix - Complete Guide

## ✅ Fixed Issues

1. **Updated Appwrite Endpoint** - Now using `https://nyc.cloud.appwrite.io/v1` instead of the general endpoint
2. **Fixed Registration Function** - Improved user ID generation and error handling
3. **Enhanced Error Logging** - Added detailed console logs to help troubleshoot further issues
4. **Hardcoded Critical Values** - Added fallback values directly in code to avoid .env issues

## Changes Made

### 1. Updated Client Configuration (`client/src/config/appwrite.ts`)
```typescript
// Use the NYC endpoint directly to avoid .env issues
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '68e970330382476bf61';

client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

console.log('Appwrite client configured with:', { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID });
```

### 2. Updated Server Configuration (`server/config/appwrite.js`)
```javascript
// Set Appwrite configuration from environment variables
const endpoint = process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID || '68e970330382476bf61';
const apiKey = process.env.APPWRITE_API_KEY || '';

console.log('Server Appwrite configuration:', { endpoint, projectId: projectId ? '✓ Set' : '❌ Missing' });
```

### 3. Fixed Registration Function (`client/src/contexts/AuthContext.tsx`)
```typescript
const register = async (email: string, password: string, name: string) => {
  try {
    console.log('Registering with:', { email, name, endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT });
    
    // Generate a simple unique ID that works in all browsers
    const generateId = () => {
      return 'uid_' + Math.random().toString(36).substring(2, 15) + 
        Math.random().toString(36).substring(2, 15) + 
        Date.now().toString(36);
    };
    const userId = generateId();
    
    // Create account with the explicit userId
    await account.create(userId, email, password, name);
    console.log('Account created successfully');
    
    // Automatically login after registration
    await login(email, password);
    console.log('Auto-login successful');
    
    return { success: true };
  } catch (error) {
    // Enhanced error logging...
  }
};
```

## Verifying Your Setup

1. Open browser console (F12) and check for:
   - Appwrite client configuration logs
   - Any error messages during registration attempts
   
2. Make sure your `.env` files are correctly set up:
   
   **Client .env**
   ```
   VITE_API_URL=http://localhost:5001
   VITE_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=68e970330382476bf61
   VITE_APPWRITE_DATABASE_ID=livecv-production
   ```
   
   **Server .env**
   ```
   FRONTEND_URL=http://localhost:5173
   APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=68e970330382476bf61
   APPWRITE_API_KEY=your-api-key-here
   APPWRITE_DATABASE_ID=livecv-production
   ```

## Appwrite Console Setup

1. Make sure you have a platform entry in Appwrite console for `localhost`
2. Ensure Email/Password authentication is enabled
3. Check that the API key has proper permissions (users.read, users.write)

## Common Error Messages and Solutions

### "general_bad_request" (400)
- **Cause**: Missing platform configuration in Appwrite console
- **Solution**: Add `localhost` as a platform in Appwrite console

### "Invalid project ID" or "Project not found"
- **Cause**: Incorrect project ID in client/server config
- **Solution**: Double check your project ID matches Appwrite console

### "Invalid API key"
- **Cause**: API key doesn't exist or has insufficient permissions
- **Solution**: Create a new API key with proper permissions

## Testing Authentication Flow

1. Register: Try registering with a new email address
2. Login: After registering, try logging in
3. Check session: After login, check if session is maintained

## Still Having Issues?

1. Try incognito/private browser window
2. Clear browser cookies and localStorage
3. Check network requests in browser console (F12 → Network tab)
4. Verify your Appwrite console settings
