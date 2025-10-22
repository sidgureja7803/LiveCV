# LiveCV Appwrite Setup Guide

This guide will help you fix the 400 Bad Request issues with Appwrite authentication and configure your application properly.

## 1. Environment Configuration

Make sure your `.env` files are correctly set up:

### Server Environment (.env in server folder)

```
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here
APPWRITE_DATABASE_ID=livecv-production
SESSION_SECRET=your_secure_session_secret
```

### Client Environment (.env in client folder)

```
VITE_API_URL=http://localhost:5001
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=livecv-production
```

## 2. Appwrite Platform Configuration

1. Log in to your [Appwrite Console](https://cloud.appwrite.io)
2. Go to your project
3. Navigate to **Settings** → **API Keys**
4. Create a new API key with these permissions:
   - users.write
   - users.read
   - documents.write
   - documents.read
   - databases.read
   - databases.write
   - storage.read
   - storage.write

5. Navigate to **Authentication** settings
6. Make sure Email/Password authentication is enabled
7. Configure Platform settings:
   - Add http://localhost:5173 to the allowed platforms
   - Enable Auth Fallback on custom domains

## 3. CORS Configuration

The 400 Bad Request error is often caused by CORS issues. In your Appwrite console:

1. Go to **Settings** → **CORS**
2. Add these domains to the allowed origins:
   - http://localhost:5173
   - http://localhost:5001
   - https://yourdomain.com (if you have a production domain)

## 4. Testing Your Setup

1. Start your server with `npm start` in the server directory
2. Start your client with `npm run dev` in the client directory
3. Open http://localhost:5173 in your browser
4. Try to register a new user
5. Check server logs for any error messages

## 5. Common Issues and Solutions

### 400 Bad Request

- Make sure your CORS settings are correct
- Check that your Appwrite Project ID matches in both client and server
- Verify that your API key has the necessary permissions
- Ensure the Appwrite database and collections exist

### Authentication Failures

- Double check that Email/Password authentication is enabled in Appwrite
- Make sure your frontend URL is listed in the allowed platforms
- Use complex passwords (at least 8 characters)
- Check if the email is already registered

## 6. Deployment Considerations

When deploying your application:

1. Update your `.env` files with production URLs
2. Add your production domain to Appwrite CORS settings
3. Create a separate API key for production
4. Use HTTPS for all communications

For more help, visit the [Appwrite Documentation](https://appwrite.io/docs)
