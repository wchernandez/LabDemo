# Quick Start Guide

Get AutoTA running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Get Groq API Key

1. Go to https://console.groq.com
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_...`)

## Step 3: Configure Environment

Create `.env.local` file in the root directory:

```bash
GROQ_API_KEY=gsk_...your_key_here
```

## Step 4: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 5: Test It Out!

1. Click "Load Example" on any of the 3 pre-loaded examples
2. Click "Get Hints"
3. See the magic happen! ✨

## Troubleshooting

**Error: "GROQ_API_KEY is not set"**
- Make sure `.env.local` exists in the root directory
- Restart the dev server after creating `.env.local`

**Error: "Failed to generate hints"**
- Check your API key is correct
- Make sure you have internet connection
- Verify your Groq API quota hasn't been exceeded

**Syntax highlighting not working?**
- This is normal on first load - it will work after the component mounts
- Try refreshing the page

## Ready to Deploy?

See the main README.md for Vercel deployment instructions!
