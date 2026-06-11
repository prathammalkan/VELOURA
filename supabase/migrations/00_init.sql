-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT DEFAULT 'Uncategorized',
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Pending Verification',
  total NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'Unpaid',
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert dummy products
INSERT INTO public.products (name, price, category, image, description)
VALUES 
  ('Rose Gold Eternity Ring', 14999, 'Rings', 'https://images.unsplash.com/photo-1605100804763-247f66150ce8?w=800&q=80', 'A beautiful rose gold ring.'),
  ('Diamond Tennis Bracelet', 45999, 'Bracelets', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80', 'Elegant diamond tennis bracelet.'),
  ('Pearl Drop Earrings', 8999, 'Earrings', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80', 'Classic pearl drop earrings.')
ON CONFLICT DO NOTHING;

-- Setup Storage Bucket for Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('veloura-assets', 'veloura-assets', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Setup RLS for products (Public read, Admin write)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products 
  USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.is_admin = true));

-- Setup RLS for orders (User read own, Admin read all, User insert)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.is_admin = true));

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.is_admin = true));

-- Storage RLS
DROP POLICY IF EXISTS "Public can view assets" ON storage.objects;
CREATE POLICY "Public can view assets" ON storage.objects FOR SELECT 
  USING (bucket_id = 'veloura-assets');

DROP POLICY IF EXISTS "Admins can insert assets" ON storage.objects;
CREATE POLICY "Admins can insert assets" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'veloura-assets' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.is_admin = true));

DROP POLICY IF EXISTS "Admins can update assets" ON storage.objects;
CREATE POLICY "Admins can update assets" ON storage.objects FOR UPDATE
  USING (bucket_id = 'veloura-assets' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.is_admin = true));

DROP POLICY IF EXISTS "Admins can delete assets" ON storage.objects;
CREATE POLICY "Admins can delete assets" ON storage.objects FOR DELETE
  USING (bucket_id = 'veloura-assets' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.is_admin = true));
