-- Add foreign key constraint between homepage_portfolio and portfolio_images
ALTER TABLE public.homepage_portfolio 
ADD CONSTRAINT homepage_portfolio_portfolio_image_id_fkey 
FOREIGN KEY (portfolio_image_id) 
REFERENCES public.portfolio_images(id) 
ON DELETE CASCADE;