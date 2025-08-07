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

Open http://localhost:4000/ with your browser to see the result.

## Cache Configuration

The LRU cache is configured to:
- Store up to 1000 user records
- TTL of 15 minutes per cached record
- Cache key is the Supabase user ID (UUID)
