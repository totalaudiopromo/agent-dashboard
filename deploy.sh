#!/bin/bash

echo "🚀 Total Audio Promo Agent Dashboard - Deployment Script"
echo "========================================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run 'git init' first."
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check if remote origin exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote origin already configured"
    ORIGIN_URL=$(git remote get-url origin)
    echo "🔗 Origin URL: $ORIGIN_URL"
else
    echo ""
    echo "📝 Please provide your GitHub repository URL:"
    echo "   Format: https://github.com/USERNAME/REPO-NAME.git"
    read -p "   GitHub URL: " GITHUB_URL
    
    if [ -z "$GITHUB_URL" ]; then
        echo "❌ No URL provided. Exiting."
        exit 1
    fi
    
    echo "🔗 Adding remote origin: $GITHUB_URL"
    git remote add origin "$GITHUB_URL"
fi

echo ""
echo "📤 Pushing to GitHub..."

# Ensure we're on main branch
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Switching to main branch..."
    git checkout -b main
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎯 Next Steps for Vercel Deployment:"
    echo "===================================="
    echo "1. Go to https://vercel.com"
    echo "2. Sign in with your GitHub account"
    echo "3. Click 'New Project'"
    echo "4. Import your repository: $(git remote get-url origin)"
    echo "5. Framework: Next.js (auto-detected)"
    echo "6. Click 'Deploy'"
    echo ""
    echo "🔧 Environment Variables to add in Vercel:"
    echo "   NOTION_TOKEN=your_notion_token"
    echo "   NOTION_COMMAND_CENTER_ID=your_page_id"
    echo ""
    echo "🌐 Your dashboard will be live in 2-3 minutes!"
    echo ""
    echo "📚 Full deployment guide: DEPLOYMENT.md"
else
    echo "❌ Failed to push to GitHub. Please check your credentials and try again."
    exit 1
fi
