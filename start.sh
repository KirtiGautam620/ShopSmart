#!/bin/bash
set -e

echo "Starting ShopSmart (Idempotent Mode)"

# Port definitions
SERVER_PORT=5001
CLIENT_PORT=5173

# Helper to kill process by port
kill_port() {
  local port=$1
  local pid=$(lsof -t -i:$port)
  if [ -n "$pid" ]; then
    echo "Cleaning up old process on port $port (PID: $pid)..."
    kill -9 $pid || true
  fi
}

# 1. Clean up old processes
kill_port $SERVER_PORT
kill_port $CLIENT_PORT

# 2. Start Backend
echo "📡 Starting Server on port $SERVER_PORT..."
cd server
npm run dev &
cd ..

# 3. Start Frontend
echo "💻 Starting Client on port $CLIENT_PORT..."
cd client
npm run dev &
cd ..

echo "ShopSmart is initializing in the background!"
echo "   - Backend: http://localhost:$SERVER_PORT"
echo "   - Frontend: http://localhost:$CLIENT_PORT"
