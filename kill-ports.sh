#!/bin/bash

# =============================================================================
# OnlyTutor Port Cleanup Script (macOS/Linux)
# =============================================================================
# This script kills processes running on development ports
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Print colored output
print_header() {
    echo ""
    echo -e "${CYAN}=============================================================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}=============================================================================${NC}"
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

# Function to kill process on specific port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)

    if [ -z "$pids" ]; then
        print_info "Port $port is not in use"
    else
        for pid in $pids; do
            print_warning "Found process $pid on port $port"
            kill -9 $pid 2>/dev/null && print_success "Killed process $pid on port $port" || print_error "Failed to kill process $pid"
        done
    fi
}

# =============================================================================
# Main Script
# =============================================================================

print_header "OnlyTutor - Cleaning Up Development Ports"

echo "Checking for processes on development ports..."
echo ""

# Development ports
PORTS=(3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012)

for port in "${PORTS[@]}"; do
    kill_port $port
done

echo ""
print_header "Port Cleanup Complete!"

print_info "You can now start the development environment with:"
echo "  npm run dev"
echo ""
