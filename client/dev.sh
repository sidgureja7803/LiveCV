#!/bin/bash

# Kill any processes running on port 3000
echo "Checking for processes on port 3000..."
lsof -i :3000 | awk 'NR!=1 {print $2}' | xargs -r kill -9
echo "Port 3000 cleared."

# Start the development server
echo "Starting Vite development server..."
npm run dev
