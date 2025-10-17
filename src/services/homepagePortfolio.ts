import { supabase } from "@/integrations/supabase/client";

export interface HomepagePortfolio {
  id: string;
  portfolio_image_id: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export async function fetchHomepagePortfolio(): Promise<HomepagePortfolio[]> {
  const { data, error } = await supabase
    .from("homepage_portfolio")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as HomepagePortfolio[]) ?? [];
}

export async function addToHomepagePortfolio(portfolioImageId: string, displayOrder: number = 0): Promise<HomepagePortfolio> {
  const { data, error } = await supabase
    .from("homepage_portfolio")
    .insert({
      portfolio_image_id: portfolioImageId,
      display_order: displayOrder
    })
    .select()
    .single()
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
    throw new Error(error.message);
  }
}

export async function updateHomepagePortfolioOrder(id: string, displayOrder: number): Promise<HomepagePortfolio> {
  const { data, error } = await supabase
    .from("homepage_portfolio")
    .update({ display_order: displayOrder, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
    .setHeader('x-admin-key', 'admin-access-2024');

  if (error) {
    throw new Error(error.message);
  }

  return data as HomepagePortfolio;
}