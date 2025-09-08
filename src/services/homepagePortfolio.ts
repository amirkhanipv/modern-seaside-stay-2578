import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type HomepagePortfolio = Database["public"]["Tables"]["homepage_portfolio"]["Row"];

export async function fetchHomepagePortfolio() {
  const { data, error } = await supabase
    .from("homepage_portfolio")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
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
    .single()
    .setHeader('x-admin-key', 'admin-access-2024');

  if (error) {
    throw new Error(error.message);
  }

  return data;
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

  return data;
}