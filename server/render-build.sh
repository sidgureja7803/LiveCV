#!/bin/bash
set -e

# Display information
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
echo "Installing server dependencies..."
npm install --legacy-peer-deps

# Adding better error logging for startup
echo "console.debug = function(...args) { 
  console.log('[DEBUG]', ...args); 
};" > debug-log.js

# Create a .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating default .env file..."
  cat > .env << EOF
# Server Configuration
PORT=5001
NODE_ENV=production

# MongoDB Connection
MONGODB_URI=REPLACE_WITH_YOUR_MONGODB_URI

# JWT Authentication
JWT_SECRET=REPLACE_WITH_YOUR_SECRET
JWT_EXPIRES_IN=90d
COOKIE_EXPIRES_IN=90

# Frontend URL (CORS)
FRONTEND_URL=https://live-cv-sidgureja.netlify.app

# Session Secret
SESSION_SECRET=REPLACE_WITH_YOUR_SESSION_SECRET

# Email Configuration
EMAIL_FROM=your-email@gmail.com
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# OpenAI API 
OPENAI_API_KEY=REPLACE_WITH_YOUR_OPENAI_KEY

# Add any other necessary environment variables here
EOF

  echo ".env file created. Please update it with your actual values."
  echo "⚠️ Application may not start correctly without proper environment variables!"
fi

echo "Build script completed. Ready to start server."
