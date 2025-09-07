-- Add video-specific fields to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS video_duration INTEGER,
ADD COLUMN IF NOT EXISTS video_type TEXT DEFAULT 'youtube',
ADD COLUMN IF NOT EXISTS requires_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_text TEXT,
ADD COLUMN IF NOT EXISTS video_transcript TEXT;

-- Create ad placements table for posts and videos
CREATE TABLE IF NOT EXISTS public.ad_placements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  position TEXT NOT NULL, -- 'top', 'middle', 'bottom', 'sidebar'
  ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on ad_placements
ALTER TABLE public.ad_placements ENABLE ROW LEVEL SECURITY;

-- Create policies for ad_placements
CREATE POLICY "Ad placements are viewable by everyone" 
ON public.ad_placements 
FOR SELECT 
USING (is_active = true OR (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
)));

CREATE POLICY "Admins can manage ad placements" 
ON public.ad_placements 
FOR ALL 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

-- Create video consent logs table
CREATE TABLE IF NOT EXISTS public.video_consent_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_session TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  consent_type TEXT[] DEFAULT ARRAY['functional'],
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on video_consent_logs
ALTER TABLE public.video_consent_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for video_consent_logs
CREATE POLICY "Users can insert their own consent logs" 
ON public.video_consent_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view consent logs" 
ON public.video_consent_logs 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

-- Create video analytics table
CREATE TABLE IF NOT EXISTS public.video_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_session TEXT,
  event_type TEXT NOT NULL, -- 'play', 'pause', 'ended', 'progress'
  event_data JSONB,
  timestamp_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on video_analytics
ALTER TABLE public.video_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for video_analytics
CREATE POLICY "Users can insert analytics events" 
ON public.video_analytics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view analytics" 
ON public.video_analytics 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

-- Insert default site settings if they don't exist
INSERT INTO public.site_settings (key, value, category, type, description) VALUES
('google_analytics', '', 'analytics', 'text', 'Google Analytics tracking code'),
('google_search_console', '', 'seo', 'text', 'Google Search Console verification meta tag'),
('robots_txt', 'User-agent: *
Disallow: /admin/
Disallow: /private/

Sitemap: https://yoursite.com/sitemap.xml', 'seo', 'text', 'Robots.txt content'),
('default_video_consent', 'This video uses cookies and tracking technologies. By clicking play, you consent to our use of these technologies for analytics and personalization.', 'video', 'text', 'Default consent message for videos'),
('site_title', 'Content Hub', 'seo', 'text', 'Default site title'),
('site_description', 'Your ultimate destination for articles, videos, and tools.', 'seo', 'text', 'Default site description')
ON CONFLICT (key) DO NOTHING;