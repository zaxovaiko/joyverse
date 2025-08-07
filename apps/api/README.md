# Joyverse API

API server for Joyverse built with Elysia and Bun runtime.

## Features

- **Bearer Token Authentication**: JWT validation with Supabase
- **User Lookup**: Database queries with LRU caching
- **Protected Routes**: Secure endpoints with auth middleware

## Environment Variables

```bash
DATABASE_URL=postgresql://...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Development

To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

## Auth Middleware

### Protected Routes

Routes that use the auth middleware require a valid Bearer token:

```bash
# Valid request
curl -H "Authorization: Bearer <supabase-jwt-token>" http://localhost:3000/protected

# Response
{
  "message": "Hello authenticated user!",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Public Routes

Public routes work without authentication:

```bash
curl http://localhost:3000/
# Response: { "message": "API is running" }
```

## Database Schema

The middleware expects a `users` table with a `supabaseId` field:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  supabase_id UUID UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age SMALLINT NOT NULL,
  city TEXT,
  country TEXT,
  bio TEXT NOT NULL,
  onboarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

## Cache Configuration

The LRU cache is configured to:
- Store up to 1000 user records
- TTL of 15 minutes per cached record
- Cache key is the Supabase user ID (UUID)