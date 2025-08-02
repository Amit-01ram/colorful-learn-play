import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Calendar, User, Play } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

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
  categories: {
    name: string;
    slug: string;
  };
  profiles: {
    full_name: string;
  };
}

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      // For now, we'll fetch from posts table with a specific category or tag for videos
      // You might want to create a separate videos table in the future
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
          categories:category_id (
            name,
            slug
          ),
          profiles:author_id (
            full_name
          )
        `)
        .eq('status', 'published')
        .or('seo_keywords.ilike.%video%,title.ilike.%video%,content.ilike.%video%')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (slug: string) => {
    navigate(`/video/${slug}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWatchTime = (content: string) => {
    // Estimate watch time based on content length
    const wordsPerMinute = 150; // Average speaking pace
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
            <p className="mt-4 text-muted-foreground">Loading videos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Video Content
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Watch expert tutorials, masterclasses, and insights to enhance your skills and stay ahead of the curve.
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {videos.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">No Videos Yet</h3>
              <p className="text-muted-foreground">Check back soon for new video content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <Card 
                  key={video.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleVideoClick(video.slug)}
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={video.thumbnail_url || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop'} 
                      alt={video.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-600 text-white">
                        <Play className="h-3 w-3 mr-1" />
                        Video
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {video.categories && (
                        <Badge variant="outline">{video.categories.name}</Badge>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Eye className="h-4 w-4 mr-1" />
                        {video.view_count || 0}
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-base line-clamp-3">
                      {video.excerpt || video.content.substring(0, 150) + '...'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(video.published_at)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {getWatchTime(video.content)}
                        </div>
                      </div>
                      {video.profiles?.full_name && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {video.profiles.full_name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Videos;