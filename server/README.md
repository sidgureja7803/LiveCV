# LiveCV Server

Backend API for LiveCV Resume Builder application.

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
# Server configuration
PORT=5001
NODE_ENV=development

# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/livecv
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/livecv

# Authentication
JWT_SECRET=your_secure_jwt_secret_key_here

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_PROD=https://yourdomain.com

# Email service (for OTP verification)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=LiveCV <your-email@gmail.com>

# AWS S3 (for resume storage)
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
```

## AWS Deployment Guide

This guide explains how to deploy the LiveCV backend to AWS using Elastic Beanstalk.

### Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. EB CLI installed
4. MongoDB Atlas account (for production database)

### Step 1: Set up MongoDB Atlas

1. Create a new cluster in MongoDB Atlas
2. Set up a database user with read/write permissions
3. Whitelist your IP and AWS VPC IPs
4. Get your connection string (will look like: `mongodb+srv://username:password@cluster.mongodb.net/livecv`)

### Step 2: Prepare Your Application

1. Create a `.ebignore` file in your server directory with the following content:

```
node_modules
npm-debug.log
.env
.git
.gitignore
```

2. Create a `Procfile` in your server directory:

```
web: npm start
```

3. Update your `package.json` scripts to include:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### Step 3: Set up Elastic Beanstalk

1. Navigate to your server directory:

```bash
cd server
```

2. Initialize Elastic Beanstalk:

```bash
eb init
```

Follow the prompts:
- Select your AWS region
- Create a new application or select an existing one
- Select "Node.js" as the platform
- Choose the recommended Node.js version
- Set up SSH if needed

3. Create an Elastic Beanstalk environment:

```bash
eb create livecv-api-production
```

### Step 4: Configure Environment Variables

You can configure environment variables in two ways:

#### Option 1: Using the AWS Management Console

1. Go to the Elastic Beanstalk console
2. Select your environment
3. Go to Configuration > Software
4. Add the environment variables from your `.env` file

#### Option 2: Using the EB CLI

1. Create a file named `.ebextensions/env.config` with the following content:

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    PORT: 5001
    NODE_ENV: production
    MONGODB_URI: mongodb+srv://username:password@cluster.mongodb.net/livecv
    JWT_SECRET: your_secure_jwt_secret_key_here
    FRONTEND_URL: https://yourdomain.com
    EMAIL_SERVICE: gmail
    EMAIL_USER: your-email@gmail.com
    EMAIL_PASSWORD: your-app-password
    EMAIL_FROM: LiveCV <your-email@gmail.com>
    AWS_BUCKET_NAME: your-bucket-name
    AWS_REGION: us-east-1
    AWS_ACCESS_KEY_ID: your_aws_access_key_id
    AWS_SECRET_ACCESS_KEY: your_aws_secret_access_key
```

**Important:** Replace all placeholder values with your actual values.

### Step 5: Deploy Your Application

Deploy your application to Elastic Beanstalk:

```bash
eb deploy
```

### Step 6: Set up Custom Domain (Optional)

1. Register a domain name if you don't have one
2. Go to Route 53 in AWS Console
3. Create a hosted zone for your domain
4. Create a CNAME record pointing to your Elastic Beanstalk URL
5. Configure HTTPS with AWS Certificate Manager

### Step 7: Monitoring and Scaling

1. Set up CloudWatch alarms for monitoring
2. Configure auto-scaling based on traffic
3. Set up SNS notifications for critical events

### Continuous Deployment (Optional)

You can set up continuous deployment with GitHub Actions or AWS CodePipeline to automate deployments when you push to your repository.

Example GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to AWS

on:
  push:
    branches:
      - main
    paths:
      - 'server/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: |
          cd server
          npm ci
          
      - name: Install EB CLI
        run: |
          pip install awsebcli
          
      - name: Deploy to Elastic Beanstalk
        run: |
          cd server
          eb deploy livecv-api-production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: ${{ secrets.AWS_REGION }}
```

### Troubleshooting Common Issues

1. **Connection issues with MongoDB Atlas:**
   - Verify your IP whitelist settings in Atlas
   - Check your connection string and credentials
   - Ensure your Atlas cluster is in the same region as your EB environment

2. **Application crashes:**
   - Check EB logs: `eb logs`
   - SSH into the instance for debugging: `eb ssh`
   - Verify all environment variables are set correctly

3. **Email sending issues:**
   - For Gmail, ensure you're using an App Password, not your regular password
   - Verify SMTP settings and port restrictions

4. **Memory/CPU issues:**
   - Increase instance size in EB configuration
   - Implement proper error handling and resource cleanup
   - Consider implementing caching for frequent operations

## Live Coding Feature Implementation

To implement the live coding feature, we need to ensure our templates are properly loaded and the Socket.IO integration is working correctly.

### Troubleshooting Template Loading Issues

If templates are not loading properly:

1. Verify the template paths in `server/services/templateService.js`
2. Check that template files exist in `server/views/templates/`
3. Ensure the route handlers are properly set up in `server/routes/resumeRoutes.js`

### Implementing Real-time Collaboration

Real-time collaboration is handled through Socket.IO. Key files for this feature:

1. `server/server.js` - Socket.IO server setup
2. `client/src/hooks/useSocketIo.ts` - Client-side Socket.IO hook
3. `client/src/components/ResumeEditor.tsx` - Editor component that uses Socket.IO

Make sure the Socket.IO server is properly initialized in `server.js` and the client is correctly connecting to it.