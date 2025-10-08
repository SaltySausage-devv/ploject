# Supabase Integration Setup

## ✅ Completed Configuration

### 1. Environment Variables

**Location:** `/frontend/.env`

```env
VITE_SUPABASE_URL=https://kvwoccsugzmtvhoekcqt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Supabase Client Setup

**Location:** `/frontend/src/lib/supabase.js`

- Configured Supabase client with auth persistence
- Auto-refresh tokens enabled
- Session detection enabled

### 3. Auth Store Integration

**Location:** `/frontend/src/stores/auth.js`

**Updated Features:**
- ✅ Login with Supabase Auth (`signInWithPassword`)
- ✅ Register with Supabase Auth (`signUp`)
- ✅ User profile creation in `users` table
- ✅ Automatic session management
- ✅ Auth state change listeners
- ✅ Logout functionality
- ✅ Profile updates
- ✅ Backwards compatibility layer (camelCase field names)

**Database Schema Mapping:**
```
Database (snake_case) → Frontend (camelCase)
- first_name → firstName
- last_name → lastName
- user_type → userType
- date_of_birth → dateOfBirth
- created_at → createdAt
- updated_at → updatedAt
```

## 📋 Next Steps

### Database Setup Required

1. **Deploy Schema to Supabase:**
   ```bash
   # Connect to your Supabase project
   # Run the schema.sql file
   ```

2. **Enable Row Level Security (RLS):**
   - Go to Supabase Dashboard > Authentication > Policies
   - Add policies for the `users` table

3. **Configure Email Templates:**
   - Go to Supabase Dashboard > Authentication > Email Templates
   - Customize confirmation and password reset emails

### Testing Authentication

**Test Login:**
1. Navigate to `/login`
2. Enter credentials
3. Check browser console for Supabase auth responses

**Test Registration:**
1. Navigate to `/register`
2. Fill in user details
3. Check Supabase dashboard for new user entry

### Database Tables Referenced

The auth store currently interacts with:
- `users` table (for user profiles)

**Required `users` table fields:**
- `id` (UUID, primary key, matches auth.users.id)
- `email` (text)
- `first_name` (text)
- `last_name` (text)
- `user_type` (text: 'student', 'tutor', 'centre', 'admin')
- `phone` (text, nullable)
- `date_of_birth` (date, nullable)
- `address` (text, nullable)
- `bio` (text, nullable)
- `created_at` (timestamp with timezone)
- `updated_at` (timestamp with timezone)

## 🔒 Security Notes

1. **Environment Variables:**
   - `.env` file is NOT committed to git (.gitignore configured)
   - ANON key is safe for client-side use
   - Never expose service role key in frontend

2. **Row Level Security:**
   - Must enable RLS policies before production
   - Users should only access their own data

3. **Authentication Flow:**
   - Sessions are stored in localStorage (Supabase default)
   - Auto-refresh handles token expiration
   - Auth state persists across page reloads

## 🧪 Testing Checklist

- [ ] Verify Supabase connection (check browser network tab)
- [ ] Test user registration
- [ ] Test user login
- [ ] Test profile updates
- [ ] Test logout
- [ ] Test session persistence (refresh page)
- [ ] Test auth state changes

## 📦 Installed Packages

```json
{
  "@supabase/supabase-js": "^2.x.x"
}
```

## 🔗 Supabase Dashboard

**Project URL:** https://kvwoccsugzmtvhoekcqt.supabase.co
**Dashboard:** https://supabase.com/dashboard/project/kvwoccsugzmtvhoekcqt

## 📝 Code Examples

### Using Auth in Components

```javascript
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()

    // Access user data
    const user = computed(() => authStore.user)
    const isAuthenticated = computed(() => authStore.isAuthenticated)

    // Login
    const handleLogin = async () => {
      const result = await authStore.login(email, password)
      if (result.success) {
        // Redirect to dashboard
      }
    }

    return { user, isAuthenticated, handleLogin }
  }
}
```

### Direct Supabase Queries

```javascript
import { supabase } from '@/lib/supabase'

// Fetch data
const { data, error } = await supabase
  .from('tutors')
  .select('*')
  .eq('user_id', user.id)

// Insert data
const { data, error } = await supabase
  .from('bookings')
  .insert([{ tutor_id: 1, student_id: 2 }])
```

## ⚠️ Important Notes

1. **Backwards Compatibility:** The auth store exports `user` with camelCase field names for backwards compatibility. Use `rawUser` if you need direct access to snake_case fields.

2. **Database Not Deployed:** The schema.sql file defines the database structure but hasn't been deployed to Supabase yet. You need to run this manually in the Supabase SQL editor.

3. **Mock Data:** Currently, the app uses mock tutor data. This needs to be migrated to Supabase database tables.

4. **Email Confirmation:** By default, Supabase sends confirmation emails. You can disable this in the dashboard for testing.

## 🚀 Ready for Production

Before going live:
1. ✅ Supabase client configured
2. ⏳ Deploy database schema
3. ⏳ Enable RLS policies
4. ⏳ Configure email templates
5. ⏳ Test all auth flows
6. ⏳ Migrate mock data to database
7. ⏳ Add error handling for network failures
8. ⏳ Implement loading states
