#!/bin/bash

# NomiSafe Web App - Quick Start Script

echo "======================================"
echo "  NomiSafe Web App - Quick Start"
echo "======================================"
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the nomisafe-web directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    echo ""
fi

# Display configuration info
echo "⚙️  Configuration:"
echo "   - Check src/config/api.js for API settings"
echo "   - Default: Development mode (localhost:8000)"
echo ""

# Start the app
echo "🚀 Starting NomiSafe Web App..."
echo "   App will open at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
