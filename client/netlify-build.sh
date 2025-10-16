#!/bin/bash
set -e

# Display current Node.js version
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Set environment variables for production build
echo "Setting up build environment..."
export NODE_OPTIONS="--max-old-space-size=4096"

# Build with the Netlify-specific Vite configuration
echo "Building with Netlify configuration..."
npm run build -- --config vite.config.netlify.js

echo "Build completed successfully!"
