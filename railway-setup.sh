#!/bin/bash

# Railway setup script
echo "Setting up Railway deployment..."

# Check if required environment variables are set
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
  echo "WARNING: TELEGRAM_BOT_TOKEN is not set"
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "WARNING: NEXT_PUBLIC_SUPABASE_URL is not set"
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "WARNING: SUPABASE_SERVICE_ROLE_KEY is not set"
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build Next.js app
echo "Building Next.js application..."
npm run build

echo "Setup complete!"

