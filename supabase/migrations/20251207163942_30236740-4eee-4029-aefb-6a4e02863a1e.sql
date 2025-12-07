-- Add RLS policies for portfolio_images management
CREATE POLICY "Public insert portfolio_images" 
ON public.portfolio_images 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public update portfolio_images" 
ON public.portfolio_images 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public delete portfolio_images" 
ON public.portfolio_images 
FOR DELETE 
USING (true);

-- Add RLS policies for discount_plans management
CREATE POLICY "Public insert discount_plans" 
ON public.discount_plans 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public update discount_plans" 
ON public.discount_plans 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public delete discount_plans" 
ON public.discount_plans 
FOR DELETE 
USING (true);

-- Add RLS policies for homepage_portfolio management
CREATE POLICY "Public insert homepage_portfolio" 
ON public.homepage_portfolio 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public update homepage_portfolio" 
ON public.homepage_portfolio 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public delete homepage_portfolio" 
ON public.homepage_portfolio 
FOR DELETE 
USING (true);

-- Add RLS policies for categories management
CREATE POLICY "Public insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public update categories" 
ON public.categories 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Public delete categories" 
ON public.categories 
FOR DELETE 
USING (true);