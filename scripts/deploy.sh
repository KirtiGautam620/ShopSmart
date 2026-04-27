#!/bin/bash
set -e

# Dynamically get AWS Details
AWS_REGION=$(aws configure get region || echo "us-east-1")
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

CLIENT_REPO="shopsmart-client"
SERVER_REPO="shopsmart-server"

echo "Using Registry: $ECR_REGISTRY"

echo "Logging into Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

echo "Stopping existing containers..."
docker stop $CLIENT_REPO $SERVER_REPO 2>/dev/null || true
docker rm $CLIENT_REPO $SERVER_REPO 2>/dev/null || true

echo "Pulling latest images from ECR..."
docker pull $ECR_REGISTRY/$CLIENT_REPO:latest
docker pull $ECR_REGISTRY/$SERVER_REPO:latest

echo "Setting up Docker network..."
docker network create shopsmart-net 2>/dev/null || true

echo "Starting ShopSmart Server..."
docker run -d \
  --name $SERVER_REPO \
  --network shopsmart-net \
  -p 5001:5001 \
  -e DATABASE_URL="file:/app/prisma/dev.db" \
  -e JWT_SECRET="${JWT_SECRET:-shopsmartsecret}" \
  --restart always \
  $ECR_REGISTRY/$SERVER_REPO:latest

echo "Starting ShopSmart Client (Nginx)..."
docker run -d \
  --name $CLIENT_REPO \
  --network shopsmart-net \
  -e API_URL=http://$SERVER_REPO:5001 \
  -p 80:80 \
  --restart always \
  $ECR_REGISTRY/$CLIENT_REPO:latest

echo "Deployment Complete! Cleaning up old images..."
docker image prune -f
