
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, FileText, Video, Wrench, Phone, HelpCircle, User, Shield, LogOut } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Articles', path: '/articles', icon: FileText },
    { name: 'Videos', path: '/videos', icon: Video },
    { name: 'Tools', path: '/tools', icon: Wrench },
    { name: 'Contact', path: '/contact', icon: Phone },
    { name: 'Help', path: '/help', icon: HelpCircle },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('/')}
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              WebSite
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuLink
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                        onClick={() => handleNavigation(item.path)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
                
                {/* User Menu */}
                {user ? (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-2 w-48">
                        <div className="px-3 py-2 text-sm text-muted-foreground border-b">
                          {user.email}
                        </div>
                        {isAdmin && (
                          <NavigationMenuLink
                            className="flex w-full items-center rounded-md p-3 text-sm hover:bg-accent cursor-pointer"
                            onClick={() => handleNavigation('/admin')}
                          >
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Admin Dashboard
                          </NavigationMenuLink>
                        )}
                        <NavigationMenuLink
                          className="flex w-full items-center rounded-md p-3 text-sm hover:bg-accent cursor-pointer text-destructive"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:bg-primary/90 focus:outline-none cursor-pointer"
                      onClick={() => handleNavigation('/auth')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Admin Login
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => handleNavigation(item.path)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                      </Button>
                    );
                  })}
                  
                  <div className="pt-4 border-t">
                    {user ? (
                      <div className="space-y-2">
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          {user.email}
                        </div>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            className="justify-start w-full"
                            onClick={() => handleNavigation('/admin')}
                          >
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            Admin Dashboard
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="justify-start w-full text-destructive"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleNavigation('/auth')}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Admin Login
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
