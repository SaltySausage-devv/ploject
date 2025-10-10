# OnlyTutor Setup Guide

Complete guide for setting up and running the OnlyTutor development environment.

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional)
- **Supabase Account** - [Sign up](https://supabase.com/)

## Quick Start

### Windows

```bash
# 1. Install all dependencies
setup.bat

# 2. Configure environment variables
# Edit .env file with your Supabase credentials

# 3. Start all services
start-dev.bat
```

### macOS/Linux

```bash
# 1. Make scripts executable
chmod +x setup.sh kill-ports.sh

# 2. Install all dependencies
./setup.sh

# 3. Configure environment variables
# Edit .env file with your Supabase credentials

# 4. Start all services
npm run dev
```

## Scripts Overview

### Setup Scripts

**`setup.bat` / `setup.sh`**
- Installs all dependencies for root, frontend, and 12 microservices
- Verifies installations
- Creates .env from env.example if missing
- Shows progress and completion status

### Startup Scripts

**`start-dev.bat` (Windows only)**
- Checks if dependencies are installed
- Creates .env if missing
- Starts all 12 services + frontend with concurrently
- Shows all service URLs

**`npm run dev` (All platforms)**
- Starts all services using concurrently
- Recommended for macOS/Linux

### Cleanup Scripts

**`kill-ports.bat` (Windows)**
- Kills all processes on ports 3000-3012
- Use when getting "port already in use" errors

**`kill-ports.sh` (macOS/Linux)**
- Same as above for Unix-based systems
- Requires execution permission: `chmod +x kill-ports.sh`

## Port Reference

| Port | Service | Description |
|------|---------|-------------|
| 3000 | Frontend | Vue.js application |
| 3001 | Auth | Authentication & JWT |
| 3002 | Users | User management |
| 3003 | Profiles | Tutor/Centre profiles |
| 3004 | Bookings | Booking management |
| 3005 | Messaging | Real-time chat (Socket.io) |
| 3006 | Reviews | Reviews & ratings |
| 3007 | Notifications | Email/SMS notifications |
| 3008 | Analytics | Analytics & reporting |
| 3009 | Gamification | Badges & points |
| 3010 | Earnings | Earnings tracking |
| 3011 | Calendar | Google Calendar API |
| 3012 | Maps | Google Maps API |

## Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Configuration
JWT_SECRET=your_random_jwt_secret_key_here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Optional: Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@onlytutor.sg

# Optional: SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Optional: Google APIs
GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Troubleshooting

### "Port already in use" Error

**Windows:**
```bash
kill-ports.bat
```

**macOS/Linux:**
```bash
./kill-ports.sh
```

### Dependencies Not Installing

**Check Node.js version:**
```bash
node -v  # Should be 18+
npm -v   # Should be 9+
```

**Clear npm cache:**
```bash
npm cache clean --force
```

**Reinstall dependencies:**
```bash
# Windows
rd /s /q node_modules
setup.bat

# macOS/Linux
rm -rf node_modules
./setup.sh
```

### Service Won't Start

**Check if .env file exists:**
```bash
# Windows
dir .env

# macOS/Linux
ls -la .env
```

**Check service-specific logs:**
```bash
# Start individual service to see detailed logs
npm run dev:messaging
```

### Frontend Not Connecting to Backend

**Verify proxy configuration:**
- Check `frontend/vite.config.js` for proxy settings
- Ensure all backend services are running
- Check browser console for CORS errors

### Supabase Connection Issues

**Verify credentials:**
- Check SUPABASE_URL is correct
- Check SUPABASE_ANON_KEY is correct
- Test connection in Supabase dashboard

## Individual Service Commands

Start specific services for debugging:

```bash
# Frontend only
npm run dev:frontend

# Backend service only
npm run dev:messaging

# Multiple services
npm run dev:auth & npm run dev:users & npm run dev:frontend
```

## Database Setup

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key
3. Run the database schema (if available):
   ```bash
   # Import schema through Supabase dashboard SQL editor
   # Or use psql:
   psql -h your-db-host -U postgres -d postgres -f database/schema.sql
   ```

## Development Workflow

1. **First Time Setup:**
   - Run `setup.bat` or `./setup.sh`
   - Configure `.env` file
   - Test with `npm run dev`

2. **Daily Development:**
   - Run `kill-ports.bat` or `./kill-ports.sh` (if needed)
   - Run `npm run dev`
   - Access frontend at http://localhost:3000

3. **Debugging Specific Service:**
   - Stop all services (Ctrl+C)
   - Run specific service: `npm run dev:messaging`
   - Check logs for errors

## Production Deployment

See [CLAUDE.md](./CLAUDE.md) for detailed deployment instructions.

Quick commands:
```bash
# Build frontend
npm run build

# The build will be in frontend/dist
```

## Need Help?

1. Check [CLAUDE.md](./CLAUDE.md) for architecture details
2. Check [README.md](./README.md) for project overview
3. Create an issue on GitHub
4. Check service logs for detailed error messages

---

**OnlyTutor** - Making education accessible, one connection at a time. 🎓
