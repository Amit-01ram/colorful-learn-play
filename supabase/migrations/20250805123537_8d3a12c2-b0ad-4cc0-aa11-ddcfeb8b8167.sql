
-- Create a function to make a user admin
CREATE OR REPLACE FUNCTION make_user_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE profiles 
  SET is_admin = true 
  WHERE email = user_email;
  
  -- If no profile exists, create one
  IF NOT FOUND THEN
    INSERT INTO profiles (user_id, email, is_admin)
    SELECT id, email, true
    FROM auth.users 
    WHERE email = user_email;
  END IF;
END;
$$;

-- Make the first user (you) an admin - replace with your actual email
-- SELECT make_user_admin('your-email@example.com');

-- Also, let's ensure the profiles table has the right structure
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;
