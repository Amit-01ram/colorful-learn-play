import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, User, Eye, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";
import SEOHead from "@/components/SEOHead";

interface Article {
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

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
      incrementViewCount(slug);
    }
  }, [slug]);

  const fetchArticle = async (articleSlug: string) => {
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
        .eq('slug', articleSlug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (articleSlug: string) => {
    try {
      await supabase.rpc('increment_post_views', { post_slug: articleSlug });
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

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/articles')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
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
        title={article.seo_title || article.title}
        description={article.seo_description || article.excerpt || article.content.substring(0, 160)}
        keywords={article.seo_keywords}
        image={article.thumbnail_url}
        url={`${window.location.origin}/articles/${article.slug}`}
        type="article"
        publishedTime={article.published_at}
        author={article.profiles?.full_name}
      />
      
      <Navigation />
      
      <article className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Ad Placement */}
          <AdPlacement position="post_before" postId={article.id} className="mb-8" />
          
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/articles')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {article.categories && (
                <Badge variant="outline">
                  {article.categories.name}
                </Badge>
              )}
              <Badge className="bg-green-600 text-white">
                <BookOpen className="h-3 w-3 mr-1" />
                Article
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              {article.title}
            </h1>
            
            {article.excerpt && (
              <p className="text-xl text-muted-foreground mb-6">
                {article.excerpt}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {article.profiles?.full_name && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {article.profiles.full_name}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(article.published_at)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {getReadTime(article.content)}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {article.view_count || 0} views
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.thumbnail_url && (
            <div className="mb-8">
              <img 
                src={article.thumbnail_url}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Middle Ad Placement */}
          <AdPlacement position="post_inside" postId={article.id} className="mb-8" />

          <Separator className="mb-8" />

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
            
            {/* Sidebar Ad */}
            <div className="lg:col-span-1">
              <AdPlacement position="homepage_middle" postId={article.id} />
            </div>
          </div>
          
          {/* Bottom Ad Placement */}
          <AdPlacement position="post_after" postId={article.id} className="mt-8" />
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ArticleDetail;