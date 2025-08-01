import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Wrench, 
  Palette, 
  Megaphone, 
  BarChart3, 
  Settings, 
  Upload, 
  LogOut,
  Menu
} from 'lucide-react';
import PostsManager from '@/components/admin/PostsManager';
import ToolsManager from '@/components/admin/ToolsManager';
import DesignCustomization from '@/components/admin/DesignCustomization';
import AdsManager from '@/components/admin/AdsManager';
import AnalyticsSettings from '@/components/admin/AnalyticsSettings';
import GlobalSettings from '@/components/admin/GlobalSettings';
import MediaManager from '@/components/admin/MediaManager';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'posts', label: 'Posts', icon: FileText },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'ads', label: 'Ads', icon: Megaphone },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'media', label: 'Media', icon: Upload },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Dashboard() {
  const { isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">No change</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={() => setActiveTab('posts')} variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Create New Post
                </Button>
                <Button onClick={() => setActiveTab('tools')} variant="outline" className="h-20 flex-col">
                  <Wrench className="h-6 w-6 mb-2" />
                  Add New Tool
                </Button>
                <Button onClick={() => setActiveTab('media')} variant="outline" className="h-20 flex-col">
                  <Upload className="h-6 w-6 mb-2" />
                  Upload Media
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case 'posts':
        return <PostsManager />;
      case 'tools':
        return <ToolsManager />;
      case 'design':
        return <DesignCustomization />;
      case 'ads':
        return <AdsManager />;
      case 'analytics':
        return <AnalyticsSettings />;
      case 'media':
        return <MediaManager />;
      case 'settings':
        return <GlobalSettings />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar */}
        <Sidebar className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <SidebarHeader className="border-b p-4">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      isActive={activeTab === item.id}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={signOut}>
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 pt-16 lg:pt-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}