-- Create Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    cta_text TEXT,
    cta_link TEXT,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read on hero_slides" ON hero_slides 
    FOR SELECT USING (true);

-- Allow authenticated all (Admin)
CREATE POLICY "Allow service role all on hero_slides" ON hero_slides 
    FOR ALL USING (true);
