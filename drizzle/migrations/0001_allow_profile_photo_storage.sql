CREATE POLICY "Public can read portfolio profile photos"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'portfolio-media' AND name LIKE 'profile/%');

CREATE POLICY "Admins can manage portfolio profile photos"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'portfolio-media' AND name LIKE 'profile/%' AND private.is_admin())
  WITH CHECK (bucket_id = 'portfolio-media' AND name LIKE 'profile/%' AND private.is_admin());