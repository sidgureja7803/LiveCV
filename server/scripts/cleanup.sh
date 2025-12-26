#!/bin/bash

# LiveCV Project Cleanup Script
# This script removes unnecessary files from the repository

echo "🧹 Starting LiveCV project cleanup..."

# Find and delete .DS_Store files recursively
echo "Removing .DS_Store files..."
find . -name ".DS_Store" -type f -delete
echo "✓ .DS_Store files removed"

# Remove macOS resource fork files
echo "Removing macOS resource fork files..."
find . -name "._*" -type f -delete
echo "✓ Resource fork files removed"

# Remove accidentally committed build artifacts (if any exist outside ignored directories)
echo "Checking for build artifacts outside ignored directories..."

# Remove any .log files in the root
if ls *.log 1> /dev/null 2>&1; then
    echo "Removing log files from root..."
    rm -f *.log
    echo "✓ Log files removed"
else
    echo "✓ No log files found in root"
fi

# Remove any .tmp files
echo "Removing temporary files..."
find . -name "*.tmp" -type f -delete
echo "✓ Temporary files removed"

# Remove vim swap files
echo "Removing vim swap files..."
find . -name "*.swp" -type f -delete
find . -name "*.swo" -type f -delete
find . -name "*~" -type f -delete
echo "✓ Vim swap files removed"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Note: This script only removes files that should not be in version control."
echo "Build artifacts in node_modules/ and dist/ are already ignored by .gitignore"
