-- Add features column to discount_plans table
ALTER TABLE public.discount_plans 
ADD COLUMN IF NOT EXISTS features text;