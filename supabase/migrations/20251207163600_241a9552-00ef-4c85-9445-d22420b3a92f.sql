-- Add RLS policies for customer_reviews management

-- Allow public INSERT on customer_reviews
CREATE POLICY "Public insert customer_reviews" 
ON public.customer_reviews 
FOR INSERT 
WITH CHECK (true);

-- Allow public UPDATE on customer_reviews
CREATE POLICY "Public update customer_reviews" 
ON public.customer_reviews 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow public DELETE on customer_reviews
CREATE POLICY "Public delete customer_reviews" 
ON public.customer_reviews 
FOR DELETE 
USING (true);