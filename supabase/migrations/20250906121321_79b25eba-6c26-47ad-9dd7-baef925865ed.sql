-- Fix security vulnerability: Remove overly permissive RLS policies on bookings table
-- that allow anyone to view all customer personal information

-- Drop the dangerous policies that allow unrestricted access
DROP POLICY IF EXISTS "Allow admin select via anon key" ON public.bookings;
DROP POLICY IF EXISTS "Allow admin updates via anon key" ON public.bookings;
DROP POLICY IF EXISTS "Allow admin delete via anon key" ON public.bookings;

-- Keep the secure customer access policy (allows customers to view only their own booking with tracking code)
-- This policy already exists and is secure: "Customers can view their own bookings with tracking code"

-- Add a more restrictive admin policy that requires a specific header for admin operations
-- This is a temporary solution until proper authentication is implemented
CREATE POLICY "Admin operations with api key" ON public.bookings
FOR ALL
USING (
  current_setting('request.headers', true)::json->>'x-admin-key' IS NOT NULL
  AND current_setting('request.headers', true)::json->>'x-admin-key' = 'admin-access-2024'
)
WITH CHECK (
  current_setting('request.headers', true)::json->>'x-admin-key' IS NOT NULL
  AND current_setting('request.headers', true)::json->>'x-admin-key' = 'admin-access-2024'
);