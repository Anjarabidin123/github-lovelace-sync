-- Update existing profile untuk user tokoanjar
UPDATE profiles 
SET 
  username = 'tokoanjar',
  email = 'tokoanjar036@gmail.com',
  display_name = 'Toko Anjar'
WHERE display_name = 'TOKO ANJAR' AND username IS NULL;