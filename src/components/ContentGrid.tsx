import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Play, Download, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'tool';
  category: string;
  readTime?: string;
  views: string;
  image: string;
  featured?: boolean;
}

const ContentGrid = () => {
  const navigate = useNavigate();
  // Mock data - replace with real content later
  const contentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Building Modern Web Applications with React',
      description: 'Learn the latest React patterns and best practices for building scalable applications.',
      type: 'article',
      category: 'Development',
      readTime: '8 min read',
      views: '2.1k',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      featured: true
    },
    {
      id: '2',
      title: 'Complete Guide to Design Systems',
      description: 'Master the art of creating consistent and scalable design systems.',
      type: 'video',
      category: 'Design',
      readTime: '15 min',
      views: '3.5k',
      image: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=400&h=250&fit=crop'
    },
    {
      id: '3',
      title: 'Color Palette Generator',
      description: 'Generate beautiful color palettes for your next project with AI assistance.',
      type: 'tool',
      category: 'Design',
      views: '1.8k',
      image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=400&h=250&fit=crop'
    },
    {
      id: '4',
      title: 'TypeScript Best Practices',
      description: 'Advanced TypeScript techniques for better code quality and developer experience.',
      type: 'article',
      category: 'Development',
      readTime: '12 min read',
      views: '4.2k',
      image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop'
    },
    {
      id: '5',
      title: 'SEO Optimization Masterclass',
      description: 'Learn how to optimize your website for search engines and improve rankings.',
      type: 'video',
      category: 'Marketing',
      readTime: '22 min',
      views: '5.1k',
      image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=250&fit=crop'
    },
    {
      id: '6',
      title: 'Code Snippet Manager',
      description: 'Organize and share your code snippets with syntax highlighting and tags.',
      type: 'tool',
      category: 'Development',
      views: '2.7k',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop'
    }
  ];

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
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
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
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {item.title}
              </CardTitle>
              <CardDescription className="text-base">
                {item.description}
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
                      navigate('/articles');
                    } else if (item.type === 'video') {
                      navigate('/videos');
                    } else if (item.type === 'tool') {
                      navigate('/tools');
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
    </section>
  );
};

export default ContentGrid;