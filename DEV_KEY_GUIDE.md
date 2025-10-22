# Appwrite Dev Key Implementation Guide

## Changes Made:

1. **Added Dev Key to Appwrite Client Configuration**
   - Updated `/client/src/config/appwrite.ts` with Dev Key support
   - Used `@ts-ignore` for TypeScript compatibility
   - Added detailed error logging for troubleshooting

2. **Enhanced Registration Process**
   - Added retry mechanism for account creation
   - Improved error handling and detailed console logs
   - Added proper toast notifications for user feedback

3. **Added Debug Information to Registration UI**
   - Added technical error details in development mode
   - Improved error messages for better user experience

## How Appwrite Dev Keys Work

### Purpose
Dev Keys bypass certain restrictions in the Appwrite platform during development:
- Skip CORS checks (important for local development)
- Bypass rate limits
- Provide better error messages during testing

### Security Note
Dev Keys should NEVER be used in production. They are for development and testing only.

## Troubleshooting Registration Issues

### Common Error Codes

- **400 Bad Request**
  - Possible causes:
    - Invalid email format
    - Password requirements not met (min 8 characters)
    - Missing required fields

- **409 Conflict**
  - Account with that email already exists

- **429 Too Many Requests**
  - Rate limiting (Dev Key should help with this)

### Debug Process

1. **Check the browser console** (F12 → Console)
   - Look for detailed error logs with 🔄 and ⏳ symbols
   - Check if there are CORS errors

2. **Verify Appwrite Setup**
   - Make sure `localhost` platform is added in Appwrite Console
   - Email/Password auth is enabled
   - Dev Key has proper permissions

3. **Connection Issues**
   - Ensure `https://nyc.cloud.appwrite.io/v1` endpoint is working
   - Check network connectivity to Appwrite

## Dev Key Management

### Creating Dev Keys
1. Go to Appwrite Console
2. Navigate to API Keys
3. Create Dev Key with these permissions:
   - users.write
   - users.read
   - documents.write
   - documents.read
   - databases.read
   - databases.write

### Using Dev Keys in Different Environments
For local development, you can set the key directly in code or use environment variables:

```
# In .env
VITE_APPWRITE_DEV_KEY=your-dev-key-here
```

```typescript
// In code
client.setDevKey(devKey);
```

## Next Steps

1. Test registration with different browsers
2. Check account creation in Appwrite Console
3. Consider server-side account creation if client-side fails
