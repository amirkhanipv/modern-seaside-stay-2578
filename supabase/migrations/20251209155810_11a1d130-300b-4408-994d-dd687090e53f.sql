-- Add original_price and terms columns to discount_plans table
ALTER TABLE public.discount_plans 
ADD COLUMN IF NOT EXISTS original_price numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS terms text DEFAULT NULL;