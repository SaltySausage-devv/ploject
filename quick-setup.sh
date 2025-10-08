#!/bin/bash

# =============================================================================
# TutorConnect Quick Setup Script
# =============================================================================
# Fast parallel installation of all dependencies
# =============================================================================

echo "🚀 TutorConnect Quick Setup - Installing all dependencies..."
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install --silent &

# Install frontend dependencies
echo "🎨 Installing frontend dependencies..."
(cd frontend && npm install --silent) &

# Install all service dependencies in parallel
echo "⚙️  Installing service dependencies..."

(cd services/auth && npm install --silent) &
(cd services/users && npm install --silent) &
(cd services/profiles && npm install --silent) &
(cd services/bookings && npm install --silent) &
(cd services/messaging && npm install --silent) &
(cd services/reviews && npm install --silent) &
(cd services/notifications && npm install --silent) &
(cd services/analytics && npm install --silent) &
(cd services/gamification && npm install --silent) &
(cd services/earnings && npm install --silent) &
(cd services/calendar && npm install --silent) &
(cd services/maps && npm install --silent) &

# Wait for all background jobs to complete
wait

echo ""
echo "✅ All dependencies installed!"
echo ""
echo "Run 'npm run dev' to start all services"
echo "Run 'npm run dev:frontend' to start only the frontend"
echo ""
