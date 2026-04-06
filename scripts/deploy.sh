#!/bin/bash
set -e
APP_DIR="/home/ubuntu/ShopSmart"
REPO_URL="https://github.com/KirtiGautam620/ShopSmart.git"

echo "Starting Idempotent Deployment..."

mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [ -d ".git" ]; then
    echo "Updating existing repository..."
    git fetch --all
    git reset --hard origin/main
else
    echo "Cloning repository for the first time..."
    git clone "$REPO_URL" .
fi

echo "Setting up Backend..."
cd server
npm install
npx prisma generate
npx prisma db push --accept-data-loss

echo "Setting up Frontend..."
cd ../client
npm install
npm run build

echo "Restarting services..."

if command -v pm2 > /dev/null; then
    pm2 reload all || pm2 start ../server/src/app.js --name "shopsmart-api"
else
    pkill -f "node.*server/src/app.js" || true
    nohup npm run dev --prefix ../server > server.log 2>&1 &
fi

echo "Deployment Complete!"
