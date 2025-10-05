-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_en TEXT,
  name_it TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create portfolio_images table
CREATE TABLE public.portfolio_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_en TEXT,
  title_it TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create homepage_portfolio table
CREATE TABLE public.homepage_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_image_id UUID REFERENCES public.portfolio_images(id) ON DELETE CASCADE NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(portfolio_image_id)
);

-- Create customer_reviews table
CREATE TABLE public.customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_name_en TEXT,
  customer_name_it TEXT,
  review_text TEXT NOT NULL,
  review_text_en TEXT,
  review_text_it TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create discount_plans table
CREATE TABLE public.discount_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL,
  plan_name_en TEXT,
  plan_name_it TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_months INTEGER,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  plan_type TEXT NOT NULL,
  plan_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  called BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (these tables contain public content)
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read portfolio_images" ON public.portfolio_images FOR SELECT USING (true);
CREATE POLICY "Public read homepage_portfolio" ON public.homepage_portfolio FOR SELECT USING (true);
CREATE POLICY "Public read customer_reviews" ON public.customer_reviews FOR SELECT USING (true);
CREATE POLICY "Public read discount_plans" ON public.discount_plans FOR SELECT USING (true);
CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT USING (true);

-- Allow public inserts for bookings (anyone can create a booking)
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Create function for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_images_updated_at BEFORE UPDATE ON public.portfolio_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_homepage_portfolio_updated_at BEFORE UPDATE ON public.homepage_portfolio
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_reviews_updated_at BEFORE UPDATE ON public.customer_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discount_plans_updated_at BEFORE UPDATE ON public.discount_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate tracking code
CREATE OR REPLACE FUNCTION public.generate_tracking_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := 'BK' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM public.bookings WHERE tracking_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX idx_portfolio_images_category ON public.portfolio_images(category_id);
CREATE INDEX idx_portfolio_images_featured ON public.portfolio_images(is_featured);
CREATE INDEX idx_homepage_portfolio_order ON public.homepage_portfolio(display_order);
CREATE INDEX idx_customer_reviews_featured ON public.customer_reviews(is_featured);
CREATE INDEX idx_bookings_tracking ON public.bookings(tracking_code);
CREATE INDEX idx_bookings_status ON public.bookings(status);