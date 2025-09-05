-- Create categories table for portfolio organization
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('عروس', 'wedding', 'عکاسی عروس و داماد'),
  ('کودک', 'children', 'عکاسی کودک و نوزاد'),
  ('اسپرت', 'sport', 'عکاسی ورزشی'),
  ('خانوادگی', 'family', 'عکاسی خانوادگی');

-- Create portfolio images table
CREATE TABLE public.portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create discount plans table
CREATE TABLE public.discount_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  original_price NUMERIC NOT NULL,
  discounted_price NUMERIC,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  features TEXT[] DEFAULT '{}',
  duration_days INTEGER, 
  conditions TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories (public read, admin write)
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify categories"
  ON public.categories FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for portfolio images (public read, admin write)
CREATE POLICY "Portfolio images are viewable by everyone"
  ON public.portfolio_images FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify portfolio images"
  ON public.portfolio_images FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for discount plans (public read, admin write)
CREATE POLICY "Discount plans are viewable by everyone"
  ON public.discount_plans FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify discount plans"
  ON public.discount_plans FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Add triggers for updated_at columns
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_images_updated_at
  BEFORE UPDATE ON public.portfolio_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discount_plans_updated_at
  BEFORE UPDATE ON public.discount_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.portfolio_images (title, description, url, category_id, featured) 
SELECT 
  'عکس نمونه عروس کلاسیک',
  'نمونه کار عکاسی عروس با سبک کلاسیک',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
  id,
  true
FROM public.categories WHERE slug = 'wedding';

INSERT INTO public.portfolio_images (title, description, url, category_id, featured) 
SELECT 
  'پرتره کودک شاد',
  'عکاسی کودک با حالت طبیعی و شاد',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop',
  id,
  true
FROM public.categories WHERE slug = 'children';

INSERT INTO public.discount_plans (name, description, original_price, discounted_price, category_id, features, duration_days, conditions)
SELECT 
  'پکیج طلایی عروس',
  'پکیج کامل عکاسی عروس با تمام امکانات',
  5000000,
  4000000,
  id,
  ARRAY['عکاسی 8 ساعته', 'ویرایش تمام عکس‌ها', 'آلبوم دیجیتال', 'عکاسی پشت صحنه'],
  30,
  'قابل استفاده تا پایان ماه'
FROM public.categories WHERE slug = 'wedding';

-- Enable real-time for new tables
ALTER TABLE public.categories REPLICA IDENTITY FULL;
ALTER TABLE public.portfolio_images REPLICA IDENTITY FULL;
ALTER TABLE public.discount_plans REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_images;
ALTER PUBLICATION supabase_realtime ADD TABLE public.discount_plans;