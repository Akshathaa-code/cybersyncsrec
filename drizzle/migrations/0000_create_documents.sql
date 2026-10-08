CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_type text NOT NULL DEFAULT 'application/pdf',
  size_bytes bigint,
  storage_path text NOT NULL,
  status text NOT NULL DEFAULT 'uploading',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.documents TO anon, authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read documents" ON public.documents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public insert documents" ON public.documents FOR INSERT TO anon, authenticated
  WITH CHECK (status IN ('uploading','ready','error') AND length(filename) BETWEEN 1 AND 300);
CREATE POLICY "Public update document status" ON public.documents FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (status IN ('uploading','ready','analyzing','analyzed','error'));

CREATE POLICY "Public upload study docs" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'study-documents');
CREATE POLICY "Public read study docs" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'study-documents');