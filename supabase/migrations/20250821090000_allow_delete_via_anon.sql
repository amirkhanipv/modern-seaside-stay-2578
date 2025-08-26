CREATE POLICY "Allow admin delete via anon key"
ON public.bookings
FOR DELETE
TO anon
USING (true);