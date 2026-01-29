import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  is_car_owner: boolean;
  average_rating: number;
  total_trips: number;
  total_hosted: number;
}

export interface Car {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  brand: string;
  model: string;
  year: number | null;
  price_per_day: number;
  location: string;
  seats: number;
  transmission: string | null;
  fuel_type: string | null;
  color: string | null;
  status: string;
  average_rating: number;
  total_bookings: number;
  created_at: string;
}

export interface CarImage {
  id: string;
  car_id: string;
  image_url: string;
  is_primary: boolean;
}

export interface Booking {
  id: string;
  car_id: string;
  renter_id: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
}
