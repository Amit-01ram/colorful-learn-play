import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, User, Eye, Play } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EnhancedVideoPlayer from "@/components/EnhancedVideoPlayer";
import AdPlacement from "@/components/AdPlacement";
import SEOHead from "@/components/SEOHead";

interface Video {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail_url: string;
  view_count: number;
  published_at: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  author_id: string;
  category_id: string;
  video_url?: string;
  video_duration?: number;
  video_type?: string;
  requires_consent?: boolean;
  consent_text?: string;
  video_transcript?: string;
  categories: {
    name: string;
    slug: string;
  };
  profiles: {
    full_name: string;
  };
}

const VideoDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchVideo(slug);
      incrementViewCount(slug);
    }
  }, [slug]);

  const fetchVideo = async (videoSlug: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          content,
          excerpt,
          thumbnail_url,
          view_count,
          published_at,
          seo_title,
          seo_description,
          seo_keywords,
          author_id,
          category_id,
          video_url,
          video_duration,
          video_type,
          requires_consent,
          consent_text,
          video_transcript,
          categories:category_id (
            name,
            slug
          ),
          profiles:author_id (
            full_name
          )
        `)
        .eq('slug', videoSlug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setVideo(data);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (videoSlug: string) => {
    try {
      await supabase.rpc('increment_post_views', { post_slug: videoSlug });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWatchTime = (content: string) => {
    const wordsPerMinute = 150;
    const wordCount = content.split(' ').length;
    const watchTime = Math.ceil(wordCount / wordsPerMinute);
    return `${watchTime} min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading video...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Video Not Found</h2>
            <p className="text-muted-foreground mb-6">The video you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/videos')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Videos
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={video.seo_title || video.title}
        description={video.seo_description || video.excerpt || video.content.substring(0, 160)}
        keywords={video.seo_keywords}
        image={video.thumbnail_url}
        url={`${window.location.origin}/videos/${video.slug}`}
        type="video"
        publishedTime={video.published_at}
        author={video.profiles?.full_name}
        videoData={{
          duration: video.video_duration,
          uploadDate: video.published_at,
          thumbnailUrl: video.thumbnail_url,
          embedUrl: video.video_url
        }}
      />
      
      <Navigation />
      
      <article className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Ad Placement */}
          <AdPlacement position="post_before" postId={video.id} className="mb-8" />
          
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/videos')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Videos
          </Button>

          {/* Video Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {video.categories && (
                <Badge variant="outline">
                  {video.categories.name}
                </Badge>
              )}
              <Badge className="bg-red-600 text-white">
                <Play className="h-3 w-3 mr-1" />
                Video
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              {video.title}
            </h1>
            
            {video.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">
                {video.excerpt}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {video.profiles?.full_name && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {video.profiles.full_name}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(video.published_at)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {video.video_duration ? `${Math.ceil(video.video_duration / 60)} min` : getWatchTime(video.content)}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {video.view_count || 0} views
              </div>
            </div>
          </header>

          {/* Enhanced Video Player */}
          <div className="mb-8">
            <EnhancedVideoPlayer video={video} />
          </div>

          {/* Middle Ad Placement */}
          <AdPlacement position="post_inside" postId={video.id} className="mb-8" />

          <Separator className="mb-8" />

          {/* Video Description and Transcript */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: video.content }}
              />
              
              {video.video_transcript && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Video Transcript</h3>
                  <div className="p-4 bg-muted rounded-lg text-sm leading-relaxed">
                    {video.video_transcript}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar Ad */}
            <div className="lg:col-span-1">
              <AdPlacement position="homepage_middle" postId={video.id} />
            </div>
          </div>
          
          {/* Bottom Ad Placement */}
          <AdPlacement position="post_after" postId={video.id} className="mt-8" />
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default VideoDetail;