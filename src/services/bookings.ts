import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];

export async function fetchBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .setHeader('x-admin-key', 'admin-access-2024');

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function updateBookingCalled(id: string, called: boolean): Promise<Booking> {
  const { data, error } = await supabase.functions.invoke('admin-bookings', {
    body: {
      action: 'update_called',
      id,
      data: { called }
    },
    headers: {
      'x-admin-key': 'admin-access-2024'
    }
  });

  if (error) {
    console.error('Function invoke error:', error);
    throw new Error(error.message);
  }

  if (data?.error) {
    console.error('Function response error:', data.error);
    throw new Error(data.error);
  }

  return data as Booking;
}

export async function updateBookingStatus(id: string, status: string): Promise<Booking> {
  const { data, error } = await supabase.functions.invoke('admin-bookings', {
    body: {
      action: 'update_status',
      id,
      data: { status }
    },
    headers: {
      'x-admin-key': 'admin-access-2024'
    }
  });

  if (error) {
    console.error('Function invoke error:', error);
    throw new Error(error.message);
  }

  if (data?.error) {
    console.error('Function response error:', data.error);
    throw new Error(data.error);
  }

  return data as Booking;
}

export async function deleteBookingById(id: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke('admin-bookings', {
    body: {
      action: 'delete',
      id
    },
    headers: {
      'x-admin-key': 'admin-access-2024'
    }
  });

  if (error) {
    console.error('Function invoke error:', error);
    throw new Error(error.message);
  }

  if (data?.error) {
    console.error('Function response error:', data.error);
    throw new Error(data.error);
  }
}