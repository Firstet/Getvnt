#!/usr/bin/env bash

set -e

echo "======================================================"
echo "🚀 Getvnt Platform - One-Click Production Deployment"
echo "======================================================"

# 1. Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# 2. Build and launch containers
echo "📦 Building and starting containerized services..."
docker compose build --no-cache web api
docker compose up -d --remove-orphans

echo "------------------------------------------------------"
echo "✅ Deployment Successful!"
echo "------------------------------------------------------"
echo " ➔ Unified Web App (Port 80): http://localhost/"
echo " ➔ Public Storefront:        http://localhost/"
echo " ➔ Organizer Workspace:     http://localhost/workspace/"
echo " ➔ Super Admin Center:       http://localhost/admin/"
echo " ➔ API Health Check:         http://localhost/api/v1/health"
echo "======================================================"
