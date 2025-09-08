-- Create customer reviews table for admin management
CREATE TABLE public.customer_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_location TEXT,
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on customer_reviews
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for customer_reviews
CREATE POLICY "Customer reviews are viewable by everyone" 
ON public.customer_reviews 
FOR SELECT 
USING (active = true);

CREATE POLICY "Only admins can modify customer reviews" 
ON public.customer_reviews 
FOR ALL 
USING (
  current_setting('request.headers', true)::json->>'x-admin-key' IS NOT NULL
  AND current_setting('request.headers', true)::json->>'x-admin-key' = 'admin-access-2024'
)
WITH CHECK (
  current_setting('request.headers', true)::json->>'x-admin-key' IS NOT NULL
  AND current_setting('request.headers', true)::json->>'x-admin-key' = 'admin-access-2024'
);

-- Create homepage_portfolio table to manage which images appear on homepage
CREATE TABLE public.homepage_portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_image_id UUID NOT NULL,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on homepage_portfolio
ALTER TABLE public.homepage_portfolio ENABLE ROW LEVEL SECURITY;

-- Create policies for homepage_portfolio
CREATE POLICY "Homepage portfolio is viewable by everyone" 
ON public.homepage_portfolio 
FOR SELECT 
USING (active = true);

CREATE POLICY "Only admins can modify homepage portfolio" 
ON public.homepage_portfolio 
FOR ALL 
USING (
  current_setting('request.headers', true)::json->>'x-admin-key' IS NOT NULL
  AND current_setting('request.headers', true)::json->>'x-admin-key' = 'admin-access-2024'
)
WITH CHECK (
  current_setting('request.headers', true)::json->>'x-admin-key' IS NOT NULL
  AND current_setting('request.headers', true)::json->>'x-admin-key' = 'admin-access-2024'
);

-- Add updated_at trigger for customer_reviews
CREATE TRIGGER update_customer_reviews_updated_at
BEFORE UPDATE ON public.customer_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for homepage_portfolio
CREATE TRIGGER update_homepage_portfolio_updated_at
BEFORE UPDATE ON public.homepage_portfolio
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample customer reviews
INSERT INTO public.customer_reviews (customer_name, customer_location, review_text, rating, featured, display_order) VALUES
('سارا احمدی', 'تهران', 'تجربه فوق‌العاده‌ای داشتم. کیفیت عکس‌ها بسیار بالا و خدمات عالی بود.', 5, true, 1),
('محمد رضایی', 'اصفهان', 'بسیار راضی هستم از کار نورا استودیو. حرفه‌ای و دقیق.', 5, true, 2),
('فاطمه کریمی', 'شیراز', 'عکس‌های فوق‌العاده زیبا و خاطره‌انگیز. توصیه می‌کنم.', 5, true, 3),
('علی حسینی', 'مشهد', 'خدمات بسیار حرفه‌ای و کیفیت عالی. ممنون از تیم نورا.', 5, false, 4);