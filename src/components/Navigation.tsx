import { Button } from "@/components/ui/button";
import { Menu, Search, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              ContentHub
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#articles" className="text-foreground hover:text-primary transition-colors font-medium">
              Articles
            </a>
            <a href="#videos" className="text-foreground hover:text-primary transition-colors font-medium">
              Videos
            </a>
            <a href="#tools" className="text-foreground hover:text-primary transition-colors font-medium">
              Tools
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </a>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button variant="outline">
              Sign In
            </Button>
            <Button variant="default">
              Create
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-background border-t border-border">
              <a href="#articles" className="block px-3 py-2 text-foreground hover:text-primary font-medium">
                Articles
              </a>
              <a href="#videos" className="block px-3 py-2 text-foreground hover:text-primary font-medium">
                Videos
              </a>
              <a href="#tools" className="block px-3 py-2 text-foreground hover:text-primary font-medium">
                Tools
              </a>
              <a href="#about" className="block px-3 py-2 text-foreground hover:text-primary font-medium">
                About
              </a>
              <div className="flex space-x-2 px-3 py-2">
                <Button variant="outline" className="flex-1">
                  Sign In
                </Button>
                <Button variant="default" className="flex-1">
                  Create
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;