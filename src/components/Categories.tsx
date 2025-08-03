import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Wrench, TrendingUp, Code, Palette, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Articles",
      description: "In-depth guides and tutorials",
      count: "150+ articles",
      color: "bg-primary text-primary-foreground",
      path: "/articles"
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Videos",
      description: "Visual learning experiences",
      count: "80+ videos",
      color: "bg-secondary text-secondary-foreground",
      path: "/videos"
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Tools",
      description: "Useful utilities and resources",
      count: "25+ tools",
      color: "bg-accent text-accent-foreground",
      path: "/tools"
    }
  ];

  const topics = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Development",
      description: "Web development, programming, and software engineering",
      color: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Design",
      description: "UI/UX design, graphics, and creative workflows",
      color: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
    },
    {
      icon: <Megaphone className="h-6 w-6" />,
      title: "Marketing",
      description: "Digital marketing, SEO, and content strategy",
      color: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Business",
      description: "Entrepreneurship, productivity, and growth",
      color: "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Content Types */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
          Explore by Content Type
        </h2>
        <p className="text-xl text-muted-foreground">
          Choose your preferred way to learn and discover
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {categories.map((category, index) => (
          <Card 
            key={category.title}
            className="group cursor-pointer transition-all duration-300 hover:shadow-hover hover:-translate-y-2 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => navigate(category.path)}
          >
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                {category.title}
              </CardTitle>
              <CardDescription className="text-base">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">{category.count}</p>
              <Button 
                variant="outline" 
                className="w-full group-hover:border-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(category.path);
                }}
              >
                Browse {category.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Topics */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
          Browse by Topic
        </h2>
        <p className="text-xl text-muted-foreground">
          Find content tailored to your interests and expertise
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic, index) => (
          <Card 
            key={topic.title}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-card hover:-translate-y-1 border ${topic.color} animate-fade-in-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="text-primary group-hover:scale-110 transition-transform">
                  {topic.icon}
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {topic.title}
                </CardTitle>
              </div>
              <CardDescription className="text-sm mt-2">
                {topic.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Categories;