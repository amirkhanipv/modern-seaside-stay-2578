import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type HomepagePortfolio = Database["public"]["Tables"]["homepage_portfolio"]["Row"];

export interface HomepagePortfolioWithImage {
  id: string;
  portfolio_image_id: string;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  portfolio_image: {
    id: string;
    title: string;
    description: string | null;
    url: string;
    featured: boolean;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
}

export async function fetchHomepagePortfolio(): Promise<HomepagePortfolioWithImage[]> {
  const { data, error } = await supabase
    .from("homepage_portfolio")
    .select(`
      *,
      portfolio_image:portfolio_images!inner(
        id,
        title,
        description,
        url,
        featured,
        category:categories(
          id,
          name,
          slug
        )
      )
    `)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as HomepagePortfolioWithImage[];
}

export async function addToHomepagePortfolio(portfolioImageId: string, displayOrder: number = 0): Promise<HomepagePortfolio> {
  const { data, error } = await supabase
    .from("homepage_portfolio")
    .insert({
      portfolio_image_id: portfolioImageId,
      display_order: displayOrder,
      active: true
    })
    .select()
    .maybeSingle()
    .setHeader('x-admin-key', 'admin-access-2024');

  if (error) {
    throw new Error(error.message);
  }

  return data as HomepagePortfolio;
}

export async function removeFromHomepagePortfolio(id: string): Promise<void> {
  const { error } = await supabase
    .from("homepage_portfolio")
    .delete()
    .eq("id", id)
    .setHeader('x-admin-key', 'admin-access-2024');

  if (error) {
    console.error('Delete error:', error);
    throw new Error(error.message);
  }
}

export async function updateHomepagePortfolioOrder(id: string, displayOrder: number): Promise<HomepagePortfolio> {
  const { data, error } = await supabase
    .from("homepage_portfolio")
    .update({ 
      display_order: displayOrder,
      updated_at: new Date().toISOString() 
    })
    .eq("id", id)
    .select()
    .maybeSingle()
    .setHeader('x-admin-key', 'admin-access-2024');

  if (error) {
    throw new Error(error.message);
  }

  return data as HomepagePortfolio;
}