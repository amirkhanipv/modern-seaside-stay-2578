import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type CustomerReview = Database["public"]["Tables"]["customer_reviews"]["Row"];

export async function fetchCustomerReviews(): Promise<CustomerReview[]> {
  const { data, error } = await supabase
    .from("customer_reviews")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function fetchAllCustomerReviews(): Promise<CustomerReview[]> {
  const { data, error } = await supabase
    .from("customer_reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .setHeader('x-admin-key', 'admin-access-2024');

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
    .single()
    .setHeader('x-admin-key', 'admin-access-2024');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateCustomerReview(id: string, review: Partial<CustomerReview>): Promise<CustomerReview> {
  const { data, error } = await supabase
    .from("customer_reviews")
    .update({ ...review, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
    .setHeader('x-admin-key', 'admin-access-2024');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteCustomerReview(id: string): Promise<void> {
  const { error } = await supabase
    .from("customer_reviews")
    .delete()
    .eq("id", id)
    .setHeader('x-admin-key', 'admin-access-2024');

  if (error) {
    throw new Error(error.message);
  }
}