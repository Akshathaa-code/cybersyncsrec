GRANT DELETE ON public.documents TO anon, authenticated;
CREATE POLICY "Public delete documents" ON public.documents FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "Public delete study documents" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'study-documents');