-- Setup Supabase Database Tables for Renova Mobil Showroom

-- Enable Row Level Security (RLS) for all tables
-- You can configure RLS policies in Supabase Dashboard

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price BIGINT NOT NULL,
  year INTEGER NOT NULL,
  engine TEXT,
  transmission TEXT,
  image TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  mileage INTEGER DEFAULT 0,
  fuel_type TEXT,
  body_type TEXT,
  condition TEXT CHECK (condition IN ('Baru', 'Bekas')),
  location TEXT,
  seats INTEGER,
  plate_number TEXT,
  color TEXT,
  interior_color TEXT,
  tax_date TEXT,
  previous_owners INTEGER DEFAULT 0,
  service_history TEXT,
  gallery TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  image TEXT,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  date DATE NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inbox table
CREATE TABLE IF NOT EXISTS inbox (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('general', 'test-drive')) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  car_name TEXT,
  booking_date DATE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  date DATE NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About table (single row)
CREATE TABLE IF NOT EXISTS about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  mission TEXT NOT NULL,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (for admin authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('USER', 'ADMIN')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tables
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cars
CREATE POLICY "Allow all operations on cars" ON cars FOR ALL USING (true);

-- RLS Policies for news
CREATE POLICY "Allow all operations on news" ON news FOR ALL USING (true);

-- RLS Policies for testimonials
CREATE POLICY "Allow all operations on testimonials" ON testimonials FOR ALL USING (true);

-- RLS Policies for inbox
CREATE POLICY "Allow all operations on inbox" ON inbox FOR ALL USING (true);

-- RLS Policies for about
CREATE POLICY "Allow all operations on about" ON about FOR ALL USING (true);

-- RLS Policies for users
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_condition ON cars(condition);
CREATE INDEX IF NOT EXISTS idx_cars_is_featured ON cars(is_featured);
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_visible ON testimonials(is_visible);
CREATE INDEX IF NOT EXISTS idx_inbox_is_read ON inbox(is_read);
CREATE INDEX IF NOT EXISTS idx_inbox_date ON inbox(date DESC);

-- Insert default admin user (change password in your app logic)
-- Note: In production, use proper authentication
INSERT INTO users (name, email, role) VALUES
('Admin', 'admin@renova.com', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for uploads bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Allow anonymous uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Users can update their own images" ON storage.objects FOR UPDATE USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own images" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert sample data (optional, remove if not needed)
-- You can import your existing data from constants.tsx