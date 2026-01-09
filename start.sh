#!/bin/bash

# Quick start script for ligam-tv
# This script helps you get started with the project quickly

set -e

echo "======================================"
echo "ligam-tv Quick Start Script"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
    echo ""
    echo "⚠️  Important: Update the following variables in .env:"
    echo "   - SRS_CALLBACK_SECRET (generate a secure random string)"
    echo "   - VITE_SUPABASE_* (your Supabase credentials)"
    echo ""
    read -p "Press Enter to continue after updating .env file..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🔧 What would you like to do?"
echo ""
echo "1) Start all services (SRS + App)"
echo "2) Start only SRS server"
echo "3) Start only the app"
echo "4) Build Docker images"
echo "5) View logs"
echo "6) Stop all services"
echo "7) Run in development mode (npm run dev)"
echo ""

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo "🚀 Starting all services..."
        docker compose up -d
        echo ""
        echo "✅ Services started!"
        echo "   App: http://localhost:80"
        echo "   SRS RTMP: rtmp://localhost:1935/live"
        echo "   SRS HLS: http://localhost:8080/live"
        echo "   SRS API: http://localhost:1985/api/v1"
        echo ""
        echo "View logs with: docker compose logs -f"
        ;;
    2)
        echo "🚀 Starting SRS server..."
        docker compose up -d srs
        echo ""
        echo "✅ SRS server started!"
        echo "   RTMP: rtmp://localhost:1935/live"
        echo "   HLS: http://localhost:8080/live"
        echo "   API: http://localhost:1985/api/v1"
        ;;
    3)
        echo "🚀 Starting app..."
        docker compose up -d app
        echo ""
        echo "✅ App started!"
        echo "   URL: http://localhost:80"
        ;;
    4)
        echo "🔨 Building Docker images..."
        docker compose build
        echo "✅ Build complete!"
        ;;
    5)
        echo "📋 Viewing logs (Ctrl+C to exit)..."
        docker compose logs -f
        ;;
    6)
        echo "🛑 Stopping all services..."
        docker compose down
        echo "✅ Services stopped!"
        ;;
    7)
        echo "🔧 Starting development server..."
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing dependencies..."
            npm install
        fi
        echo ""
        echo "💡 Tip: Start SRS in another terminal with: docker compose up srs"
        echo ""
        npm run dev
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac
