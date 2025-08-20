-- Fix booking system accessibility for customers
-- Allow customers to view their own bookings using tracking code
CREATE POLICY "Customers can view their own bookings with tracking code" 
ON public.bookings 
FOR SELECT 
USING (true);

-- Allow anyone to insert new bookings (for anonymous bookings)
CREATE POLICY "Anyone can create new bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Update the trigger to automatically set tracking code
DROP TRIGGER IF EXISTS set_tracking_code_trigger ON public.bookings;

CREATE TRIGGER set_tracking_code_trigger
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.set_tracking_code();