-- Create function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE posts 
  SET view_count = view_count + 1 
  WHERE slug = post_slug;
END;
$$;