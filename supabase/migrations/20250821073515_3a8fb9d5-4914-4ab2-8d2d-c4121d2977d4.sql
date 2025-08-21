-- Fix the RLS policies for admin operations
-- First check what policies exist and fix them

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Enable admin updates for service role" ON public.bookings;
DROP POLICY IF EXISTS "Enable admin select for service role" ON public.bookings;

-- Since we're using a hardcoded password system (not proper Supabase auth),
-- we need to allow updates for the service role key (anon key)
-- This is not ideal for production but works for the current setup

-- Allow all updates for now (admin will use anon key)
CREATE POLICY "Allow admin updates via anon key"
ON public.bookings
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Allow all selects for admin
CREATE POLICY "Allow admin select via anon key" 
ON public.bookings
FOR SELECT
TO anon
USING (true);

-- Keep the insert policy for customers
-- The existing "Anyone can create new bookings" policy should remain