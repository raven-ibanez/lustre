-- 1. Create Quotation Settings Table
CREATE TABLE IF NOT EXISTS quotation_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    label TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Quotation Results Table
CREATE TABLE IF NOT EXISTS quotation_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    path TEXT NOT NULL,
    form_data JSONB NOT NULL,
    final_price_low NUMERIC NOT NULL,
    final_price_high NUMERIC NOT NULL,
    tier TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS (Optional)
ALTER TABLE quotation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_results ENABLE ROW LEVEL SECURITY;

-- Allow public read for settings (so customers can calculate)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read on settings') THEN
        CREATE POLICY "Allow public read on settings" ON quotation_settings FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on results') THEN
        CREATE POLICY "Allow public insert on results" ON quotation_results FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on settings') THEN
        CREATE POLICY "Allow service role all on settings" ON quotation_settings FOR ALL USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on results') THEN
        CREATE POLICY "Allow service role all on results" ON quotation_results FOR ALL USING (true);
    END IF;
END $$;
