#!/bin/bash
# Script to fix Tailwind CSS and dependencies for LiveCV

echo "🧹 Cleaning node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

echo "📦 Installing core dependencies..."
npm install react@18.2.0 react-dom@18.2.0 socket.io-client@4.7.2

echo "📦 Installing dev dependencies..."
npm install -D tailwindcss@3.3.3 postcss@8.4.29 autoprefixer@10.4.15
npm install -D vite@4.4.5 @vitejs/plugin-react@4.0.3 typescript@5.0.2
npm install -D react-router-dom@6.16.0

echo "🔧 Setting up Tailwind CSS..."
npx tailwindcss init -p

echo "✅ Dependencies installation complete!"
echo "🚀 Run 'npm run dev' to start the development server"
