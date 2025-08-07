#!/bin/bash

# Simple test script to demonstrate auth middleware functionality
# Note: This requires a real Supabase setup and database

echo "🧪 Testing Joyverse API Auth Middleware"
echo "========================================="

# Test public endpoint
echo "1. Testing public endpoint..."
curl -s http://localhost:3000/ | echo "Public endpoint: $(cat)"

echo

# Test protected endpoint without auth
echo "2. Testing protected endpoint without auth..."
RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/protected)
HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"
echo "Status: $HTTP_CODE"
echo "Body: $BODY"

echo

# Test protected endpoint with invalid token
echo "3. Testing protected endpoint with invalid token..."
RESPONSE=$(curl -s -w "%{http_code}" -H "Authorization: Bearer invalid-token" http://localhost:3000/protected)
HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"
echo "Status: $HTTP_CODE"  
echo "Body: $BODY"

echo

echo "✅ Basic tests completed!"
echo
echo "To test with a valid token:"
echo "curl -H \"Authorization: Bearer <your-supabase-jwt>\" http://localhost:3000/protected"