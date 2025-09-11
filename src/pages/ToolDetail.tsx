import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, User, Eye, ExternalLink, Wrench } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";
import SEOHead from "@/components/SEOHead";
import CodeRunner from "@/components/CodeRunner";

interface ToolItem {
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

const ToolDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<ToolItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchTool(slug);
      incrementViewCount(slug);
    }
  }, [slug]);

  const fetchTool = async (toolSlug: string) => {
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
          categories:category_id (
            name,
            slug
          ),
          profiles:author_id (
            full_name
          )
        `)
        .eq('slug', toolSlug)
        .eq('post_type', 'tool')
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setTool(data);
    } catch (error) {
      console.error('Error fetching tool:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (toolSlug: string) => {
    try {
      await supabase.rpc('increment_post_views', { post_slug: toolSlug });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading tool...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Tool Not Found</h2>
            <p className="text-muted-foreground mb-6">The tool you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/tools')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tools
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
        title={tool.seo_title || tool.title}
        description={tool.seo_description || tool.excerpt || tool.content.substring(0, 160)}
        keywords={tool.seo_keywords}
        image={tool.thumbnail_url}
        url={`${window.location.origin}/tools/${tool.slug}`}
        type="article"
        publishedTime={tool.published_at}
        author={tool.profiles?.full_name}
      />
      
      <Navigation />
      
      <article className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Ad Placement */}
          <AdPlacement position="post_before" postId={tool.id} className="mb-8" />
          
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/tools')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Button>

          {/* Tool Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {tool.categories && (
                <Badge variant="outline">
                  {tool.categories.name}
                </Badge>
              )}
              <Badge className="bg-green-600 text-white">
                <Wrench className="h-3 w-3 mr-1" />
                Tool
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              {tool.title}
            </h1>
            
            {tool.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">
                {tool.excerpt}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {tool.profiles?.full_name && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {tool.profiles.full_name}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(tool.published_at)}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {tool.view_count || 0} views
              </div>
            </div>
          </header>

          {/* Tool Thumbnail */}
          {tool.thumbnail_url && (
            <div className="mb-8">
              <img
                src={tool.thumbnail_url}
                alt={tool.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Middle Ad Placement */}
          <AdPlacement position="post_inside" postId={tool.id} className="mb-8" />

          <Separator className="mb-8" />

          {/* Tool Description */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CodeRunner code={tool.content} title={tool.title} />
            </div>
            
            {/* Sidebar Ad */}
            <div className="lg:col-span-1">
              <AdPlacement position="homepage_middle" postId={tool.id} />
            </div>
          </div>
          
          {/* Bottom Ad Placement */}
          <AdPlacement position="post_after" postId={tool.id} className="mt-8" />
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ToolDetail;