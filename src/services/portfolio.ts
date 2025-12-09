import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PortfolioImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  category_id: string;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface DiscountPlan {
  id: string;
  plan_name: string;
  description?: string;
  price: number;
  original_price?: number;
  duration_months?: number;
  features?: string;
  terms?: string;
  category_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert([category])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

// Portfolio Images
export async function fetchPortfolioImages(): Promise<PortfolioImage[]> {
  const { data, error } = await supabase
    .from("portfolio_images")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .order("display_order")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function fetchPortfolioImagesByCategory(categorySlug: string): Promise<PortfolioImage[]> {
  const { data, error } = await supabase
    .from("portfolio_images")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("categories.slug", categorySlug)
    .order("display_order")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function createPortfolioImage(image: Omit<PortfolioImage, 'id' | 'created_at' | 'updated_at' | 'categories'>): Promise<PortfolioImage> {
  const { data, error } = await supabase
    .from("portfolio_images")
    .insert([image])
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updatePortfolioImage(id: string, image: Partial<PortfolioImage>): Promise<PortfolioImage> {
  const { data, error } = await supabase
    .from("portfolio_images")
    .update(image)
    .eq("id", id)
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function deletePortfolioImage(id: string): Promise<void> {
  const { error } = await supabase
    .from("portfolio_images")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

// Discount Plans
export async function fetchDiscountPlans(): Promise<DiscountPlan[]> {
  const { data, error } = await supabase
    .from("discount_plans")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

export async function createDiscountPlan(plan: Omit<DiscountPlan, 'id' | 'created_at' | 'updated_at' | 'categories'>): Promise<DiscountPlan> {
  const { data, error } = await supabase
    .from("discount_plans")
    .insert([plan])
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function updateDiscountPlan(id: string, plan: Partial<DiscountPlan>): Promise<DiscountPlan> {
  const { data, error } = await supabase
    .from("discount_plans")
    .update(plan)
    .eq("id", id)
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function deleteDiscountPlan(id: string): Promise<void> {
  const { error } = await supabase
    .from("discount_plans")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}