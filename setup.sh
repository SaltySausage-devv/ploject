#!/bin/bash

# =============================================================================
# TutorConnect Setup Script
# =============================================================================
# This script installs all dependencies for the entire project
# so that npm start / npm run dev works instantly
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Progress tracking
TOTAL_STEPS=15
CURRENT_STEP=0

# Print colored output
print_header() {
    echo ""
    echo -e "${CYAN}=============================================================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}=============================================================================${NC}"
    echo ""
}

print_step() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    echo ""
    echo -e "${BLUE}[${CURRENT_STEP}/${TOTAL_STEPS}]${NC} ${GREEN}$1${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# =============================================================================
# Pre-flight Checks
# =============================================================================

print_header "TutorConnect Setup - Pre-flight Checks"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node -v)
    print_success "Node.js is installed: $NODE_VERSION"
else
    print_error "Node.js is not installed!"
    print_info "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    print_success "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed!"
    exit 1
fi

# Check if .env file exists
if [ -f ".env" ]; then
    print_success ".env file exists"
else
    print_warning ".env file not found!"
    print_info "You may need to create a .env file with your Supabase credentials"
    print_info "See env.example for reference"
fi

# =============================================================================
# Installation Process
# =============================================================================

print_header "Installing Dependencies"

# Root dependencies
print_step "Installing root dependencies"
npm install
print_success "Root dependencies installed"

# Frontend dependencies
print_step "Installing frontend dependencies"
cd frontend
npm install --loglevel=error
cd ..
print_success "Frontend dependencies installed"

# Service: auth
print_step "Installing auth service dependencies"
cd services/auth
npm install
cd ../..
print_success "Auth service dependencies installed"

# Service: users
print_step "Installing users service dependencies"
cd services/users
npm install
cd ../..
print_success "Users service dependencies installed"

# Service: profiles
print_step "Installing profiles service dependencies"
cd services/profiles
npm install
cd ../..
print_success "Profiles service dependencies installed"

# Service: bookings
print_step "Installing bookings service dependencies"
cd services/bookings
npm install
cd ../..
print_success "Bookings service dependencies installed"

# Service: messaging
print_step "Installing messaging service dependencies"
cd services/messaging
npm install
cd ../..
print_success "Messaging service dependencies installed"

# Service: reviews
print_step "Installing reviews service dependencies"
cd services/reviews
npm install
cd ../..
print_success "Reviews service dependencies installed"

# Service: notifications
print_step "Installing notifications service dependencies"
cd services/notifications
npm install
cd ../..
print_success "Notifications service dependencies installed"

# Service: analytics
print_step "Installing analytics service dependencies"
cd services/analytics
npm install
cd ../..
print_success "Analytics service dependencies installed"

# Service: gamification
print_step "Installing gamification service dependencies"
cd services/gamification
npm install
cd ../..
print_success "Gamification service dependencies installed"

# Service: earnings
print_step "Installing earnings service dependencies"
cd services/earnings
npm install
cd ../..
print_success "Earnings service dependencies installed"

# Service: calendar
print_step "Installing calendar service dependencies"
cd services/calendar
npm install
cd ../..
print_success "Calendar service dependencies installed"

# Service: maps
print_step "Installing maps service dependencies"
cd services/maps
npm install
cd ../..
print_success "Maps service dependencies installed"

# =============================================================================
# Verification
# =============================================================================

print_header "Verifying Installation"

# Count node_modules directories
MODULES_COUNT=$(find . -name "node_modules" -type d | wc -l | xargs)
print_success "Found $MODULES_COUNT node_modules directories"

# Check if all services have node_modules
MISSING_MODULES=0

check_modules() {
    if [ ! -d "$1/node_modules" ]; then
        print_error "Missing node_modules in $1"
        MISSING_MODULES=$((MISSING_MODULES + 1))
    else
        print_success "node_modules exists in $1"
    fi
}

check_critical_package() {
    if [ ! -d "$1/node_modules/$2" ]; then
        print_warning "$2 missing in $1, reinstalling..."
        cd "$1"
        npm install --loglevel=error
        cd - > /dev/null
        if [ ! -d "$1/node_modules/$2" ]; then
            print_error "$2 still missing after reinstall in $1"
            MISSING_MODULES=$((MISSING_MODULES + 1))
        fi
    fi
}

check_modules "."
check_modules "frontend"
check_critical_package "frontend" "@vueuse/motion"
check_critical_package "frontend" "vue"
check_modules "services/auth"
check_modules "services/users"
check_modules "services/profiles"
check_modules "services/bookings"
check_modules "services/messaging"
check_critical_package "services/messaging" "isomorphic-dompurify"
check_critical_package "services/messaging" "socket.io"
check_modules "services/reviews"
check_modules "services/notifications"
check_modules "services/analytics"
check_modules "services/gamification"
check_modules "services/earnings"
check_modules "services/calendar"
check_critical_package "services/calendar" "axios"
check_critical_package "services/calendar" "googleapis"
check_modules "services/maps"

# =============================================================================
# Summary
# =============================================================================

print_header "Setup Complete!"

if [ $MISSING_MODULES -eq 0 ]; then
    print_success "All dependencies installed successfully!"
    echo ""
    print_info "You can now run:"
    echo -e "  ${GREEN}npm run dev${NC}            - Start all services in development mode"
    echo -e "  ${GREEN}npm run dev:frontend${NC}   - Start only the frontend"
    echo -e "  ${GREEN}npm run dev:messaging${NC}  - Start messaging service"
    echo -e "  ${GREEN}npm run build${NC}          - Build for production"
    echo ""
    print_info "Helper scripts:"
    echo -e "  ${GREEN}./kill-ports.sh${NC}        - Kill all processes on development ports"
    echo -e "  ${GREEN}./start-dev.sh${NC}         - Start development environment (if available)"
    echo ""

    if [ ! -f ".env" ]; then
        print_warning "Don't forget to create your .env file with Supabase credentials!"
        if [ -f "env.example" ]; then
            print_info "Creating .env from env.example..."
            cp env.example .env
            print_success ".env file created. Please edit it with your credentials."
        else
            print_info "Copy env.example to .env and fill in your values"
        fi
    fi
else
    print_error "Setup completed with $MISSING_MODULES errors"
    print_info "Please check the error messages above and try again"
    exit 1
fi

print_header "Happy Coding! 🚀"
