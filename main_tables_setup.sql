-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Menu Items (Products) Table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    base_price NUMERIC NOT NULL DEFAULT 0,
    category UUID REFERENCES categories(id) ON DELETE SET NULL,
    popular BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    image_url TEXT,
    available BOOLEAN DEFAULT true,
    discount_price NUMERIC,
    discount_active BOOLEAN DEFAULT false,
    discount_start_date TIMESTAMPTZ,
    discount_end_date TIMESTAMPTZ,
    raw_price NUMERIC NOT NULL DEFAULT 0,
    markup_type TEXT DEFAULT 'jewelry',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Variations Table (e.g. Ring Size, Metal Material Pricing)
CREATE TABLE IF NOT EXISTS variations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Add Ons Table
CREATE TABLE IF NOT EXISTS add_ons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    account_number TEXT,
    account_name TEXT,
    qr_code_url TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    value TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    shipping_fee NUMERIC NOT NULL DEFAULT 0,
    payment_proof_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC NOT NULL DEFAULT 0,
    raw_price NUMERIC DEFAULT 0,
    markup_type TEXT DEFAULT 'jewelry',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all new tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow public read for static resources, public insert for orders, full control for service_role/admin)
DO $$
BEGIN
    -- Categories Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on categories') THEN
        CREATE POLICY "Allow public read on categories" ON categories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on categories') THEN
        CREATE POLICY "Allow service role all on categories" ON categories FOR ALL USING (true);
    END IF;

    -- Menu Items Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on menu_items') THEN
        CREATE POLICY "Allow public read on menu_items" ON menu_items FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on menu_items') THEN
        CREATE POLICY "Allow service role all on menu_items" ON menu_items FOR ALL USING (true);
    END IF;

    -- Variations Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on variations') THEN
        CREATE POLICY "Allow public read on variations" ON variations FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on variations') THEN
        CREATE POLICY "Allow service role all on variations" ON variations FOR ALL USING (true);
    END IF;

    -- Add Ons Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on add_ons') THEN
        CREATE POLICY "Allow public read on add_ons" ON add_ons FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on add_ons') THEN
        CREATE POLICY "Allow service role all on add_ons" ON add_ons FOR ALL USING (true);
    END IF;

    -- Payment Methods Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on payment_methods') THEN
        CREATE POLICY "Allow public read on payment_methods" ON payment_methods FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on payment_methods') THEN
        CREATE POLICY "Allow service role all on payment_methods" ON payment_methods FOR ALL USING (true);
    END IF;

    -- Site Settings Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on site_settings') THEN
        CREATE POLICY "Allow public read on site_settings" ON site_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on site_settings') THEN
        CREATE POLICY "Allow service role all on site_settings" ON site_settings FOR ALL USING (true);
    END IF;

    -- Orders Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on orders') THEN
        CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on orders') THEN
        CREATE POLICY "Allow public read on orders" ON orders FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on orders') THEN
        CREATE POLICY "Allow service role all on orders" ON orders FOR ALL USING (true);
    END IF;

    -- Order Items Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on order_items') THEN
        CREATE POLICY "Allow public insert on order_items" ON order_items FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on order_items') THEN
        CREATE POLICY "Allow public read on order_items" ON order_items FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on order_items') THEN
        CREATE POLICY "Allow service role all on order_items" ON order_items FOR ALL USING (true);
    END IF;
END $$;
