import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Play, Download, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'tool';
  category: string;
  readTime?: string;
  views: number;
  image: string;
  slug: string;
  featured?: boolean;
}

const ContentGrid = () => {
  const navigate = useNavigate();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          excerpt,
          post_type,
          view_count,
          thumbnail_url,
          slug,
          categories(name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching content:', error);
        return;
      }

      const formattedContent: ContentItem[] = posts?.map(post => ({
        id: post.id,
        title: post.title,
        description: post.excerpt || 'No description available',
        type: (post.post_type || 'article') as 'article' | 'video' | 'tool',
        category: post.categories?.name || 'Uncategorized',
        views: post.view_count || 0,
        image: post.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
        slug: post.slug,
        featured: false
      })) || [];

      setContentItems(formattedContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'tool':
        return <Download className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-secondary text-secondary-foreground';
      case 'tool':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
          Latest Content
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover articles, videos, and tools crafted by experts to help you grow and learn.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading content...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentItems.map((item, index) => (
          <Card 
            key={item.id} 
            className={`group cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-2 ${
              item.featured ? 'ring-2 ring-primary/20' : ''
            } animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative overflow-hidden rounded-t-lg">
              <img 
                src={item.image} 
                alt={item.title}
                className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  item.type === 'video' ? 'h-32' : 'h-48'
                }`}
              />
              <div className="absolute top-4 left-4">
                <Badge className={getTypeColor(item.type)}>
                  {getTypeIcon(item.type)}
                  <span className="ml-1 capitalize">{item.type}</span>
                </Badge>
              </div>
              {item.featured && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="animate-pulse-glow">
                    ⭐ Featured
                  </Badge>
                </div>
              )}
            </div>
            
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{item.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Eye className="h-4 w-4 mr-1" />
                  {item.views}
                </div>
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                {item.title}
              </CardTitle>
              <CardDescription className={`${
                item.type === 'video' ? 'text-sm line-clamp-2' : 'text-base'
              } overflow-hidden text-ellipsis`}>
                {item.type === 'video' 
                  ? item.description.substring(0, 60) + (item.description.length > 60 ? '...' : '')
                  : item.description
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                {item.readTime && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {item.readTime}
                  </div>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto"
                  onClick={() => {
                    if (item.type === 'article') {
                      navigate(`/articles/${item.slug}`);
                    } else if (item.type === 'video') {
                      navigate(`/videos/${item.slug}`);
                    } else if (item.type === 'tool') {
                      navigate(`/tools/${item.slug}`);
                    }
                  }}
                >
                  {item.type === 'tool' ? 'Try Tool' : 'Read More'}
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
            ))}
          </div>

          <div className="text-center mt-12 space-x-4">
            <Button variant="hero" size="lg" onClick={() => navigate('/articles')}>
              View All Articles
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/videos')}>
              View All Videos
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default ContentGrid;