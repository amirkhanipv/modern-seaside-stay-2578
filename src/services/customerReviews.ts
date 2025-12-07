import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type CustomerReview = Database["public"]["Tables"]["customer_reviews"]["Row"];

// Fetch only active reviews for public display
export async function fetchCustomerReviews(): Promise<CustomerReview[]> {
  const { data, error } = await supabase
    .from("customer_reviews")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

// Fetch all reviews for admin panel (including inactive)
export async function fetchAllCustomerReviews(): Promise<CustomerReview[]> {
  const { data, error } = await supabase
    .from("customer_reviews")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchFeaturedReviews(): Promise<CustomerReview[]> {
  const { data, error } = await supabase
    .from("customer_reviews")
    .select("*")
    .eq("active", true)
    .eq("featured", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createCustomerReview(review: Omit<CustomerReview, 'id' | 'created_at' | 'updated_at'>): Promise<CustomerReview> {
  const { data, error } = await supabase
    .from("customer_reviews")
    .insert(review)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as CustomerReview;
}

export async function updateCustomerReview(id: string, review: Partial<CustomerReview>): Promise<CustomerReview> {
  const { data, error } = await supabase
    .from("customer_reviews")
    .update({ ...review, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as CustomerReview;
}

export async function deleteCustomerReview(id: string): Promise<void> {
  const { error } = await supabase
    .from("customer_reviews")
    .delete()
    .eq("id", id);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(error.message);
  }
}