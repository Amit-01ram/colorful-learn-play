
-- Fix the search_path warning for increment_post_views function
DROP FUNCTION IF EXISTS public.increment_post_views(text);

CREATE OR REPLACE FUNCTION public.increment_post_views(post_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE posts 
  SET view_count = view_count + 1 
  WHERE slug = post_slug;
END;
$function$;
