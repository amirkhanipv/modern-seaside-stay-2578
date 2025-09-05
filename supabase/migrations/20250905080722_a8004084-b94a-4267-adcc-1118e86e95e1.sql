-- Fix real-time updates for bookings table
ALTER TABLE public.bookings REPLICA IDENTITY FULL;

-- Add the bookings table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- Ensure proper delete functionality by updating RLS policies
DROP POLICY IF EXISTS "Allow admin delete via anon key" ON public.bookings;
CREATE POLICY "Allow admin delete via anon key"
  ON public.bookings
  FOR DELETE
  TO anon
  USING (true);

-- Ensure update policy works correctly
DROP POLICY IF EXISTS "Allow admin updates via anon key" ON public.bookings;
CREATE POLICY "Allow admin updates via anon key"
  ON public.bookings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);