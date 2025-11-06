#!/bin/bash

# Quick script to set environment variables for deployed services
# Run this after all services are deployed

set -e

echo "🔧 Setting Environment Variables for All Services"
echo "================================================="
echo ""

# Load from .env
export $(cat .env | grep -v '^#' | grep -v '^[[:space:]]*$' | xargs)

echo "📄 Configuration loaded from .env"
echo ""

# Set variables for each service
services=(
    "reviews:3006"
    "notifications:3007"
    "analytics:3008"
    "calendar:3009"
    "earnings:3010"
    "gamification:3011"
    "maps:3012"
)

for service_port in "${services[@]}"; do
    IFS=':' read -r service port <<< "$service_port"
    
    echo "⚙️  Setting variables for $service..."
    cd "services/$service"
    
    railway variables \
        --set "NODE_ENV=production" \
        --set "PORT=$port" \
        --set "SUPABASE_URL=$SUPABASE_URL" \
        --set "SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY" \
        --set "JWT_SECRET=$JWT_SECRET"
    
    # Service-specific variables
    if [ "$service" = "maps" ]; then
        railway variables --set "GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY"
    fi
    
    if [ "$service" = "notifications" ]; then
        railway variables \
            --set "TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID" \
            --set "TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN" \
            --set "TWILIO_PHONE_NUMBER=$TWILIO_PHONE_NUMBER"
    fi
    
    cd ../..
    echo "✅ $service configured"
done

# Frontend
echo ""
echo "⚙️  Setting variables for frontend..."
cd frontend

# Get maps URL
cd ../services/maps
MAPS_URL=$(railway domain 2>&1 | grep -o 'https://[^[:space:]]*' | head -1)
cd ../../frontend

railway variables \
    --set "NODE_ENV=production" \
    --set "VITE_SUPABASE_URL=$SUPABASE_URL" \
    --set "VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY" \
    --set "VITE_MAPS_SERVICE_URL=$MAPS_URL"

FRONTEND_URL=$(railway domain 2>&1 | grep -o 'https://[^[:space:]]*' | head -1)

cd ..

echo "✅ Frontend configured"
echo ""

# Update all services with frontend URL
echo "🔄 Updating all services with frontend URL..."
all_services=("auth" "users" "profiles" "bookings" "messaging" "reviews" "notifications" "analytics" "calendar" "earnings" "gamification" "maps")

for service in "${all_services[@]}"; do
    cd "services/$service"
    railway variables --set "FRONTEND_URL=$FRONTEND_URL" 2>/dev/null && echo "✅ $service" || echo "⚠️  $service (skipped)"
    cd ../..
done

echo ""
echo "🎉 All Variables Set!"
echo "===================="
echo ""
echo "🌐 Frontend: $FRONTEND_URL"
echo "🗺️  Maps: $MAPS_URL"

