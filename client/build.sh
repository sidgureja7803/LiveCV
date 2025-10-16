#!/bin/bash

# Install dependencies with exact versions to avoid warnings
echo "Installing dependencies..."
npm install --no-audit --loglevel=error

# Clear any previous build
rm -rf dist

# Run the build
echo "Building the application..."
npm run build

echo "Build completed!"
