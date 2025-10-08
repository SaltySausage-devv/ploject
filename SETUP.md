# TutorConnect Setup Guide

This guide will help you set up the TutorConnect project with all dependencies installed so that `npm run dev` works instantly.

## Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)

## Quick Setup

We provide three setup scripts for different use cases:

### Option 1: Full Setup (Recommended)
**Best for first-time setup with detailed progress tracking**

```bash
# macOS/Linux
./setup.sh

# Windows
setup.bat
```

This script:
- ✅ Checks if Node.js and npm are installed
- ✅ Installs all dependencies step-by-step
- ✅ Verifies installation completeness
- ✅ Shows colored progress indicators
- ✅ Provides helpful error messages

### Option 2: Quick Setup (Fastest)
**Best for fast installation using parallel processing**

```bash
./quick-setup.sh
```

This script:
- ⚡ Installs all dependencies in parallel
- ⚡ Faster than sequential installation
- ⚡ Silent output for clean terminal

### Option 3: Using npm
**Best if you prefer npm commands**

```bash
npm run install:all
```

This uses the built-in npm script to install all dependencies sequentially.

## What Gets Installed

The setup scripts install dependencies for:

1. **Root Project**
   - `concurrently` - Run multiple services simultaneously

2. **Frontend** (`/frontend`)
   - Vue 3 + Vite
   - Vue Router
   - Pinia (state management)
   - Bootstrap
   - Anime.js
   - Chart.js
   - Supabase client
   - And more...

3. **Backend Services** (`/services/*`)
   - auth - Authentication service
   - users - User management
   - profiles - User profiles
   - bookings - Booking management
   - messaging - Real-time messaging
   - reviews - Review system
   - notifications - Notification service
   - analytics - Analytics tracking
   - gamification - Gamification features
   - earnings - Earnings tracking
   - calendar - Calendar integration
   - maps - Map integration

## After Setup

### 1. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Then edit `.env` and add your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Other configuration...
```

### 2. Set Up Database

Run the database schema in your Supabase project:

```bash
# Connect to Supabase SQL Editor and run:
# database/schema.sql
```

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed database setup instructions.

### 3. Start Development

Run all services:
```bash
npm run dev
```

Or run only the frontend:
```bash
npm run dev:frontend
# or
cd frontend && npm run dev
```

The frontend will be available at: **http://localhost:3000**

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services (frontend + backend) |
| `npm run dev:frontend` | Start only the frontend |
| `npm run dev:auth` | Start only auth service |
| `npm run dev:users` | Start only users service |
| `npm run build` | Build frontend for production |
| `npm run install:all` | Reinstall all dependencies |

## Troubleshooting

### "command not found: node"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "Permission denied" on macOS/Linux
Make the scripts executable:
```bash
chmod +x setup.sh quick-setup.sh
```

### Port Already in Use
If port 3000 is already in use, you can change it in `frontend/vite.config.js`:
```javascript
server: {
  port: 3001  // Change to any available port
}
```

### Dependencies Not Installing
1. Clear npm cache: `npm cache clean --force`
2. Delete all `node_modules` folders: `find . -name "node_modules" -type d -prune -exec rm -rf {} +`
3. Delete all `package-lock.json` files: `find . -name "package-lock.json" -type f -delete`
4. Run setup script again

### Supabase Connection Issues
- Verify your `.env` file has correct Supabase credentials
- Check that your Supabase project is active
- Ensure your internet connection is working
- See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for more details

## Project Structure

```
ploject/
├── frontend/              # Vue 3 frontend application
├── services/              # Backend microservices
│   ├── auth/             # Authentication service
│   ├── users/            # User management
│   ├── profiles/         # User profiles
│   ├── bookings/         # Booking management
│   ├── messaging/        # Real-time messaging
│   ├── reviews/          # Review system
│   ├── notifications/    # Notifications
│   ├── analytics/        # Analytics
│   ├── gamification/     # Gamification
│   ├── earnings/         # Earnings tracking
│   ├── calendar/         # Calendar
│   └── maps/             # Maps integration
├── database/             # Database schemas and migrations
├── setup.sh              # Full setup script (Unix)
├── quick-setup.sh        # Quick parallel setup (Unix)
├── setup.bat             # Setup script (Windows)
├── package.json          # Root dependencies
└── .env                  # Environment variables (create this)
```

## Development Workflow

1. **First Time Setup**
   ```bash
   ./setup.sh
   cp env.example .env
   # Edit .env with your credentials
   npm run dev
   ```

2. **Daily Development**
   ```bash
   npm run dev
   # or just frontend:
   npm run dev:frontend
   ```

3. **Installing New Dependencies**
   ```bash
   # For frontend
   cd frontend && npm install <package-name>

   # For specific service
   cd services/<service-name> && npm install <package-name>
   ```

4. **Building for Production**
   ```bash
   npm run build
   ```

## Getting Help

- Check [README.md](./README.md) for project overview
- Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for database setup
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- Open an issue on GitHub for bugs or questions

## Quick Reference Card

```bash
# Setup (choose one)
./setup.sh              # Full setup with progress
./quick-setup.sh        # Fast parallel setup
setup.bat              # Windows setup
npm run install:all    # npm-based setup

# Development
npm run dev            # Start everything
npm run dev:frontend   # Frontend only

# Production
npm run build          # Build for production

# Troubleshooting
npm cache clean --force           # Clear npm cache
find . -name "node_modules" -type d -prune -exec rm -rf {} +  # Delete all node_modules
./setup.sh                        # Reinstall everything
```

---

**Ready to code?** Run `./setup.sh` and then `npm run dev` to get started! 🚀
