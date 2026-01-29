/*
  # Create CarSwap Platform Tables

  1. New Tables
    - `profiles` - User profiles for car owners and renters
    - `cars` - Car listings with details and pricing
    - `bookings` - Rental bookings and reservations
    - `reviews` - Reviews and ratings for cars and users
    - `messages` - Messages between users
    - `car_images` - Store multiple images per car

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for data ownership

  3. Features
    - Track listing status, booking history
    - Average ratings calculated from reviews
    - Message thread management
*/

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  verification_status TEXT DEFAULT 'pending',
  total_trips INT DEFAULT 0,
  total_hosted INT DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  is_car_owner BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT,
  license_plate TEXT UNIQUE,
  color TEXT,
  transmission TEXT,
  fuel_type TEXT,
  seats INT DEFAULT 5,
  price_per_day DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT DEFAULT 'available',
  total_bookings INT DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS car_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  pickup_location TEXT,
  dropoff_location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can read published cars"
  ON cars FOR SELECT
  TO authenticated
  USING (status = 'available');

CREATE POLICY "Car owners can manage own cars"
  ON cars FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Anyone can read car images"
  ON car_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Car owners can manage car images"
  ON car_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cars
      WHERE cars.id = car_images.car_id
      AND cars.owner_id = auth.uid()
    )
  );

CREATE POLICY "Renters can read own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = renter_id OR auth.uid() = owner_id)
  WITH CHECK (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Users can read reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE INDEX idx_cars_owner_id ON cars(owner_id);
CREATE INDEX idx_cars_location ON cars(location);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_bookings_car_id ON bookings(car_id);
CREATE INDEX idx_bookings_renter_id ON bookings(renter_id);
CREATE INDEX idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);

-- Insert multiple rows into the cars table
INSERT INTO cars (
  id, owner_id, title, description, brand, model, year, license_plate, color, transmission, fuel_type, seats, price_per_day, location, latitude, longitude, status, total_bookings, average_rating, is_featured, created_at, updated_at
) VALUES
 