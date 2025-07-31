import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, BookOpen, Video, Wrench, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  const categories = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Getting Started",
      description: "Learn the basics of using ContentHub",
      articles: 12,
      color: "bg-primary/10 text-primary"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Publishing Content",
      description: "How to create and share your content",
      articles: 8,
      color: "bg-secondary/10 text-secondary"
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Tools & Features",
      description: "Make the most of our platform features",
      articles: 15,
      color: "bg-accent/10 text-accent"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Community",
      description: "Connect with other creators",
      articles: 6,
      color: "bg-success/10 text-success"
    }
  ];

  const popularArticles = [
    {
      title: "How to create your first article",
      category: "Getting Started",
      readTime: "3 min read"
    },
    {
      title: "Video upload guidelines and best practices",
      category: "Publishing Content",
      readTime: "5 min read"
    },
    {
      title: "Using the built-in tools effectively",
      category: "Tools & Features",
      readTime: "4 min read"
    },
    {
      title: "Building your audience on ContentHub",
      category: "Community",
      readTime: "6 min read"
    },
    {
      title: "SEO optimization for your content",
      category: "Publishing Content",
      readTime: "7 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to your questions and learn how to make the most of ContentHub
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search for help articles..." 
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={category.title}
                className="cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mx-auto mb-3`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {category.articles} articles
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Popular Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <Card 
                key={article.title}
                className="cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/contact">
                <Button variant="default" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Feature Requests</CardTitle>
              <CardDescription>
                Have an idea for improving ContentHub? We'd love to hear it!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;