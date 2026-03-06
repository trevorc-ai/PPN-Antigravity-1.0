-- Set trevorcalton@gmail.com to owner role
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb), 
  '{role}', 
  '"owner"'
) 
WHERE email = 'trevorcalton@gmail.com';
