import { Button } from "@/components/ui/button";
import { Menu, Search, Sun, Moon, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              ContentHub
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/articles')} 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Articles
            </button>
            <button 
              onClick={() => navigate('/videos')} 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Videos
            </button>
            <button 
              onClick={() => navigate('/tools')} 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Tools
            </button>
            <button 
              onClick={() => navigate('/contact')} 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </button>
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
            
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" onClick={() => navigate('/admin')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/auth')}>
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button variant="default" onClick={() => navigate('/auth')}>
                  Create
                </Button>
              </>
            )}
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
              <button 
                onClick={() => { navigate('/articles'); setIsOpen(false); }} 
                className="block px-3 py-2 text-foreground hover:text-primary font-medium w-full text-left"
              >
                Articles
              </button>
              <button 
                onClick={() => { navigate('/videos'); setIsOpen(false); }} 
                className="block px-3 py-2 text-foreground hover:text-primary font-medium w-full text-left"
              >
                Videos
              </button>
              <button 
                onClick={() => { navigate('/tools'); setIsOpen(false); }} 
                className="block px-3 py-2 text-foreground hover:text-primary font-medium w-full text-left"
              >
                Tools
              </button>
              <button 
                onClick={() => { navigate('/contact'); setIsOpen(false); }} 
                className="block px-3 py-2 text-foreground hover:text-primary font-medium w-full text-left"
              >
                About
              </button>
              <div className="flex space-x-2 px-3 py-2 pt-4 border-t">
                {user ? (
                  <>
                    {isAdmin && (
                      <Button variant="outline" size="sm" onClick={() => { navigate('/admin'); setIsOpen(false); }}>
                        Admin
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" onClick={() => { navigate('/auth'); setIsOpen(false); }}>
                      Sign In
                    </Button>
                    <Button variant="default" className="flex-1" onClick={() => { navigate('/auth'); setIsOpen(false); }}>
                      Create
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;