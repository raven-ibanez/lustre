-- 1. Create Newsletter Signups Table
CREATE TABLE IF NOT EXISTS newsletter_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Bespoke Requests Table
CREATE TABLE IF NOT EXISTS bespoke_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    jewelry_type TEXT NOT NULL,
    budget TEXT NOT NULL,
    timeline TEXT NOT NULL,
    description TEXT NOT NULL,
    inspiration TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bespoke_requests ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Allow public insert, service role all)
DO $$
BEGIN
    -- Newsletter Signups
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on newsletter') THEN
        CREATE POLICY "Allow public insert on newsletter" ON newsletter_signups FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on newsletter') THEN
        CREATE POLICY "Allow service role all on newsletter" ON newsletter_signups FOR ALL USING (true);
    END IF;

    -- Contact Inquiries
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on contact') THEN
        CREATE POLICY "Allow public insert on contact" ON contact_inquiries FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on contact') THEN
        CREATE POLICY "Allow service role all on contact" ON contact_inquiries FOR ALL USING (true);
    END IF;

    -- Bespoke Requests
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on bespoke') THEN
        CREATE POLICY "Allow public insert on bespoke" ON bespoke_requests FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role all on bespoke') THEN
        CREATE POLICY "Allow service role all on bespoke" ON bespoke_requests FOR ALL USING (true);
    END IF;
END $$;
