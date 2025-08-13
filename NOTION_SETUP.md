# 🚀 Notion Integration Setup Guide

## What I've Fixed

The "Failed to fetch" error was caused by trying to call Notion API functions directly from the client-side dashboard. I've fixed this by:

1. **Created an API route** at `app/api/notion/route.ts` that runs server-side
2. **Updated the dashboard** to call the API route instead of importing functions
3. **Moved all Notion logic** to the server where environment variables are available

## 🔧 Required Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Your Notion API token (get this from https://www.notion.so/my-integrations)
NOTION_TOKEN=your_notion_integration_token_here

# The ID of your Command Center page in Notion
# You can find this in the URL when you're on the page:
# https://www.notion.so/YourWorkspace/PageTitle-1234567890abcdef1234567890abcdef
# The ID is the last part: 1234567890abcdef1234567890abcdef
NOTION_COMMAND_CENTER_ID=your_notion_page_id_here
```

## 📋 Setup Steps

### 1. Get Your Notion API Token
1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Total Audio Promo Dashboard")
4. Select your workspace
5. Copy the "Internal Integration Token"

### 2. Get Your Page ID
1. Open your Command Center page in Notion
2. Copy the URL
3. Extract the page ID (the last part after the dash)
4. Example: `https://www.notion.so/MyWorkspace/Command-Center-1234567890abcdef1234567890abcdef`
   - Page ID: `1234567890abcdef1234567890abcdef`

### 3. Create Environment File
1. Create `.env.local` in your project root
2. Add your token and page ID
3. Restart your Next.js development server

### 4. Test the Integration
1. Click "🧪 Test Notion Sync" - should add a metrics block
2. Click "🚀 Generate Epic Command Center Layout" - should create the full layout

## 🎯 What Each Button Does

- **🧪 Test Notion Sync**: Adds a single metrics update block to your page
- **🚀 Generate Epic Command Center Layout**: Completely rebuilds your page with a comprehensive layout including:
  - Business milestones
  - Agent status
  - Platform health
  - Recent activity
  - Quick actions

## 🔍 Troubleshooting

If you still get errors:

1. **Check environment variables** are set correctly
2. **Verify your Notion token** has access to the page
3. **Ensure the page ID** is correct
4. **Check browser console** for detailed error messages
5. **Restart your dev server** after adding environment variables

## 🚀 Next Steps

Once working, you can:
- Set up automatic syncing every 30 minutes
- Customize the layout content
- Add more metrics and data sources
- Integrate with your real business data

The integration should now work perfectly! 🎉
