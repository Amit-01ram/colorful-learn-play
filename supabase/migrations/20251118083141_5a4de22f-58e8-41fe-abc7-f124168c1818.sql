-- Fix critical security vulnerabilities

-- 1. Fix profiles table - Remove public email exposure
-- Drop the overly permissive policy that exposes all profile data including emails
DROP POLICY IF EXISTS "Public profile data readable" ON public.profiles;

-- Create a more restrictive policy - users can see all profile data for their own profile
-- Public can only see non-sensitive fields (handled at application level)
CREATE POLICY "Users can view own complete profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Ensure video_consent_logs has proper access control
-- Drop any existing public read policies
DROP POLICY IF EXISTS "Anyone can view consent logs" ON public.video_consent_logs;

-- Keep the insert policy (may already exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'video_consent_logs' 
    AND policyname = 'Anyone can log consent'
  ) THEN
    CREATE POLICY "Anyone can log consent"
    ON public.video_consent_logs
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

-- Admin read policy (may already exist, so use DO block)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'video_consent_logs' 
    AND policyname = 'Admins can view consent logs'
  ) THEN
    CREATE POLICY "Admins can view consent logs"
    ON public.video_consent_logs
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.is_admin = true
      )
    );
  END IF;
END $$;

-- 3. Verify RLS is enabled on critical tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- 4. Ensure video_analytics is properly restricted
-- Drop any overly permissive policies
DROP POLICY IF EXISTS "Anyone can view analytics" ON public.video_analytics;

-- Admin view policy should already exist from previous migrations
-- Insert policy should already exist too

-- 5. Add explanatory comments
COMMENT ON TABLE public.video_consent_logs IS 'Logs user consent for adult content viewing. IP addresses stored for legal compliance. NEVER expose this data publicly - only admins can view, anyone can insert for consent logging.';

COMMENT ON TABLE public.profiles IS 'User profile data. Email addresses are sensitive PII and should only be visible to the user themselves or admins. Public queries should select only non-sensitive fields (avatar_url, full_name, id).';

COMMENT ON COLUMN public.video_consent_logs.ip_address IS 'Stored for legal compliance. NEVER expose publicly.';
COMMENT ON COLUMN public.profiles.email IS 'Sensitive PII. Only visible to profile owner and admins.';