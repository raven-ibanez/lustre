-- 1. Create the Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('categories', 'categories', true),
    ('payment_proofs', 'payment_proofs', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public/admin read and write access to 'categories' bucket
CREATE POLICY "Allow public select on categories" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'categories');

CREATE POLICY "Allow public insert on categories" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'categories');

CREATE POLICY "Allow public update on categories" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'categories');

CREATE POLICY "Allow public delete on categories" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'categories');

-- 3. Allow public/admin read and write access to 'payment_proofs' bucket
CREATE POLICY "Allow public select on payment_proofs" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'payment_proofs');

CREATE POLICY "Allow public insert on payment_proofs" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'payment_proofs');

CREATE POLICY "Allow public update on payment_proofs" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'payment_proofs');

CREATE POLICY "Allow public delete on payment_proofs" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'payment_proofs');
