# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OnlyTutor is a tutoring marketplace platform for Singapore built with a microservices architecture. The frontend is Vue.js 3 with Composition API, and the backend consists of 12 independent Node.js microservices. Authentication is handled via Supabase Auth with a custom auth service for JWT token management.

## Development Commands

### Setup

**Windows:**
```bash
# Run the setup script to install all dependencies
setup.bat

# This will:
# - Check Node.js installation
# - Install all dependencies for root, frontend, and 12 services
# - Verify all installations
# - Create .env from env.example if missing
```

**macOS/Linux:**
```bash
# Run the setup script
./setup.sh

# This will:
# - Check Node.js installation
# - Install all dependencies with progress tracking
# - Verify all installations with colorful output
# - Create .env from env.example if missing
```

### Running the Application

**Windows (Recommended):**
```bash
# Kill any processes on development ports first (if needed)
kill-ports.bat

# Start all services
start-dev.bat
# or
npm run dev
```

**macOS/Linux:**
```bash
# Start all services concurrently (recommended for development)
npm run dev
```

**Individual Services:**
```bash
# Start individual services
npm run dev:auth         # Port 3001 - Authentication
npm run dev:users        # Port 3002 - User management
npm run dev:profiles     # Port 3003 - Tutor/Centre profiles
npm run dev:bookings     # Port 3004 - Booking management
npm run dev:messaging    # Port 3005 - Real-time messaging (Socket.io)
npm run dev:reviews      # Port 3006 - Reviews & ratings
npm run dev:notifications # Port 3007 - Notifications
npm run dev:analytics    # Port 3008 - Analytics
npm run dev:gamification # Port 3009 - Gamification
npm run dev:earnings     # Port 3010 - Earnings tracking
npm run dev:calendar     # Port 3011 - Google Calendar
npm run dev:maps         # Port 3012 - Google Maps
npm run dev:frontend     # Port 3000 - Frontend
```

### Frontend Development
```bash
cd frontend
npm run dev      # Start Vite dev server on port 3000
npm run build    # Build for production
npm run preview  # Preview production build
```

### Service Development
```bash
cd services/[service-name]
npm run dev      # Start service with nodemon (hot reload)
npm start        # Start service in production mode
```

### Docker Deployment
```bash
docker-compose up -d        # Start all services
docker-compose logs -f      # View logs
docker-compose down         # Stop all services
```

### Troubleshooting

**Port Already in Use (Windows):**
```bash
# Manually kill a specific port
netstat -ano | findstr :3005
taskkill /F /PID [PID]
```

**Port Already in Use (macOS/Linux):**
```bash
# Find and kill process on specific port
lsof -ti:3005 | xargs kill -9
```

## Architecture

### Authentication Flow

**Dual Authentication System:**
The application uses Supabase Auth as the primary authentication provider, with a custom auth service (port 3001) for JWT token generation and password reset functionality.

- **Login/Register**: Frontend uses Supabase client directly (`frontend/src/stores/auth.js`)
- **Password Reset**: Custom auth service handles token generation and email sending
- **Session Management**: Supabase handles session persistence, with user profile data fetched from `public.users` table

**Important**: The auth store (`frontend/src/stores/auth.js`) maintains both:
- `user`: camelCase version for backwards compatibility
- `rawUser`: snake_case version matching database schema

### Microservices Communication

Each service is independent and communicates with:
1. **Supabase Database**: Direct PostgreSQL access via Supabase client
2. **Frontend**: Via API proxies configured in `vite.config.js`
3. **Other Services**: Through HTTP requests (future: RabbitMQ message queue)

**API Proxy Pattern:**
Frontend requests to `/api/[service]/*` are proxied to the respective service:
- `/api/auth/*` → `http://localhost:3001`
- `/api/profiles/*` → `http://localhost:3003`
- etc.

### State Management

**Pinia Store** (`frontend/src/stores/auth.js`):
- Single source of truth for authentication state
- Provides computed properties for `isAuthenticated`, `userType`, `token`
- Methods: `login()`, `register()`, `logout()`, `updateProfile()`, `forgotPassword()`, `resetPassword()`
- Automatically syncs with Supabase auth state changes

### Database Schema

**Key Tables:**
- `users` - All user accounts (students, parents, tutors, centres, admins)
  - Uses snake_case: `first_name`, `last_name`, `user_type`, `date_of_birth`
  - Primary key: `id` (matches Supabase Auth user ID)
- `tutor_profiles` - Extended tutor information
- `centre_profiles` - Tuition centre information
- `bookings` - Booking records with status tracking
- `reviews` - Reviews with ratings (1-5 stars)
- `messages` - Chat messages with Socket.io support
- `notifications` - User notifications
- `analytics_events` - User behavior tracking
- `gamification_points` - Points, badges, leaderboards
- `earnings` - Tutor earnings tracking

**Field Naming Convention:**
- Database: snake_case (`first_name`, `user_type`)
- Frontend: camelCase (`firstName`, `userType`) - handled by store transformation

### Frontend Structure

**Component Organization:**
- `src/components/` - Reusable components (Navbar, Footer, TutorProfileForm)
- `src/pages/` - Route-based page components
- `src/composables/` - Vue composables (useAnimatedBackground, useScrollAnimations)
- `src/stores/` - Pinia stores (auth.js)
- `src/services/` - API clients (api.js, messaging.js)
- `src/lib/` - Third-party integrations (supabase.js)

**Routing:**
All routes defined in `frontend/src/main.js` using Vue Router 4 with history mode.

**Key Pages:**
- `/` - Home with animated background (study-themed elements)
- `/login` - Login with auto-logout on mount
- `/register` - Registration with role restrictions (Student/Parent/Tutor only)
- `/dashboard` - User dashboard (role-specific)
- `/profile` - Profile management with role-based forms
- `/search` - Tutor search interface
- `/tutor/:id` - Individual tutor profile
- `/chat/:tutorId` - Real-time chat
- `/messages` - Message list
- `/booking/:id` - Booking interface
- `/analytics` - Analytics dashboard
- `/gamification` - Gamification features

### Styling & Animations

**Theme:**
- Dark cyberpunk theme with orange/yellow accents
- Bootstrap 5 for base styles
- Custom CSS in `frontend/src/style.css`
- Global navbar/footer components

**Animations:**
- Anime.js 4.2.0 for study-themed background elements (books, pencils, math symbols)
- Motion.js for scroll animations
- Optimized to 10 elements for performance
- Hardware-accelerated custom scrollbar (white segmented design)

## Service-Specific Notes

### Auth Service (Port 3001)
- Handles JWT token generation (`/auth/login`, `/auth/register`, `/auth/verify`, `/auth/refresh`)
- Password reset flow: `/auth/forgot-password` generates reset token, `/auth/reset-password` validates and updates
- Uses bcrypt for password hashing (12 rounds)
- Rate limiting: 100 requests per 15 minutes
- Environment variables: `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `FRONTEND_URL`

### Profiles Service (Port 3003)
- Manages tutor and centre profiles
- Handles tutor verification status
- Supports profile creation, updates, and retrieval
- Role-based forms in frontend (`TutorProfileForm.vue`)

### Messaging Service (Port 3005)
- Real-time chat using Socket.io
- Message persistence in Supabase
- Connection handling in `frontend/src/services/messaging.js`

## Important Implementation Details

### User Registration
The register flow creates both:
1. Supabase Auth user (for authentication)
2. Public users table record (for profile data)

These must stay in sync - the `id` field in `public.users` matches the Supabase Auth user ID.

### Role-Based Access
User types: `student`, `parent`, `tutor`, `centre`, `admin`
- Registration UI restricts to: `student`, `parent`, `tutor`
- Dashboard and forms adapt based on `userType`
- Profile forms show different fields per role (e.g., tutors have qualifications, centres have branch info)

### Password Reset Flow
1. User requests reset → Frontend calls Supabase `resetPasswordForEmail()`
2. Supabase sends email with magic link containing recovery token
3. User clicks link → Redirected to `/reset-password` with token in URL
4. Frontend calls Supabase `updateUser()` with new password
5. Success toast shown, auto-redirect to login

**Note**: Custom auth service has backup password reset implementation using JWT tokens stored in database.

### Environment Variables

**Frontend** (`frontend/.env`):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend Services** (root `.env`):
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

## Common Development Patterns

### Adding a New Page
1. Create component in `frontend/src/pages/`
2. Import in `frontend/src/main.js`
3. Add route to `routes` array
4. Update Navbar component if needed

### Adding a New Microservice
1. Create directory in `services/[name]/`
2. Add `package.json` with standard structure
3. Create `src/index.js` with Express app
4. Add dev script to root `package.json`
5. Add proxy config to `frontend/vite.config.js`
6. Add service to `docker-compose.yml`

### Working with Supabase
- Frontend: Use `supabase` client from `frontend/src/lib/supabase.js`
- Backend: Initialize client with `@supabase/supabase-js` in each service
- All database queries use Supabase client, not raw SQL
- Auth state syncs automatically via `onAuthStateChange` listener

### Handling Authentication Errors
- 401 errors trigger automatic logout and redirect to `/login` (see `frontend/src/services/api.js`)
- Token refresh not currently implemented (tokens valid for 7 days)
- Session persistence handled by Supabase client

## Testing & Debugging

### Debugging Authentication
The auth store has extensive console logging:
- Login/register flows: `🔐`, `✅`, `❌` prefixed logs
- Auth state checks: `🔍` prefixed logs
- Profile operations: `👤`, `📊` prefixed logs

Check browser console and service terminal output simultaneously.

### Common Issues
1. **CORS errors**: Ensure service CORS config allows `http://localhost:3000`
2. **Authentication loops**: Check if `initializeAuth()` is called on app mount
3. **Database sync issues**: Verify user record exists in `public.users` with correct `id`
4. **Proxy errors**: Confirm all services are running and ports match `vite.config.js`

## Production Deployment

### Frontend
- Build: `npm run build` in `frontend/`
- Deploy to: Vercel/Netlify
- Update environment variables for production Supabase instance

### Backend Services
- Recommended: Heroku, Railway, or AWS ECS
- Each service deployed independently
- Configure production database URL and JWT secret
- Use environment-based service URLs (not localhost)

### Docker
- Use `docker-compose.yml` for complete stack deployment
- Configure production environment variables in compose file
- Nginx handles load balancing and SSL termination
