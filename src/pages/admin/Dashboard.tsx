
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
  Menu,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';
import PostsManager from '@/components/admin/PostsManager';
import ToolsManager from '@/components/admin/ToolsManager';
import DesignCustomization from '@/components/admin/DesignCustomization';
import AdsManager from '@/components/admin/AdsManager';
import AnalyticsSettings from '@/components/admin/AnalyticsSettings';
import GlobalSettings from '@/components/admin/GlobalSettings';
import MediaManager from '@/components/admin/MediaManager';

const menuItems = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'posts', label: 'Posts & Articles', icon: FileText },
  { id: 'tools', label: 'Tools Management', icon: Wrench },
  { id: 'design', label: 'Design & Theme', icon: Palette },
  { id: 'ads', label: 'Ads & Monetization', icon: Megaphone },
  { id: 'analytics', label: 'Analytics & SEO', icon: BarChart3 },
  { id: 'media', label: 'Media Library', icon: Upload },
  { id: 'settings', label: 'Site Settings', icon: Settings },
];

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalTools: number;
  activeTools: number;
  totalViews: number;
  activeAds: number;
  mediaFiles: number;
}

export default function Dashboard() {
  const { isAdmin, loading, signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalTools: 0,
    activeTools: 0,
    totalViews: 0,
    activeAds: 0,
    mediaFiles: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardStats();
      fetchRecentActivity();
    }
  }, [isAdmin]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch posts stats
      const { data: postsData } = await supabase
        .from('posts')
        .select('id, status, view_count');

      // Fetch tools stats
      const { data: toolsData } = await supabase
        .from('tools')
        .select('id, is_active');

      // Fetch ads stats
      const { data: adsData } = await supabase
        .from('ads')
        .select('id, is_active');

      // Fetch media stats
      const { data: mediaData } = await supabase
        .from('media_files')
        .select('id');

      if (postsData) {
        const published = postsData.filter(p => p.status === 'published').length;
        const draft = postsData.filter(p => p.status === 'draft').length;
        const totalViews = postsData.reduce((sum, p) => sum + (p.view_count || 0), 0);

        setStats(prev => ({
          ...prev,
          totalPosts: postsData.length,
          publishedPosts: published,
          draftPosts: draft,
          totalViews,
        }));
      }

      if (toolsData) {
        const active = toolsData.filter(t => t.is_active).length;
        setStats(prev => ({
          ...prev,
          totalTools: toolsData.length,
          activeTools: active,
        }));
      }

      if (adsData) {
        const active = adsData.filter(a => a.is_active).length;
        setStats(prev => ({
          ...prev,
          activeAds: active,
        }));
      }

      if (mediaData) {
        setStats(prev => ({
          ...prev,
          mediaFiles: mediaData.length,
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { data: recentPosts } = await supabase
        .from('posts')
        .select('title, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentPosts) {
        setRecentActivity(recentPosts.map(post => ({
          ...post,
          type: 'post',
          action: `${post.status === 'published' ? 'Published' : 'Created'} post`
        })));
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
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
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-lg border">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {user?.email?.split('@')[0]}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your website today.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.totalPosts}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.publishedPosts} published, {stats.draftPosts} drafts
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tools</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.activeTools}</div>
                  <p className="text-xs text-muted-foreground">
                    of {stats.totalTools} total tools
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.totalViews.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Across all content
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
                  <Megaphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.activeAds}</div>
                  <p className="text-xs text-muted-foreground">
                    Revenue generating
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3">
                  <Button onClick={() => setActiveTab('posts')} variant="outline" className="h-16 flex-col">
                    <FileText className="h-6 w-6 mb-1" />
                    Create New Post
                  </Button>
                  <Button onClick={() => setActiveTab('tools')} variant="outline" className="h-16 flex-col">
                    <Wrench className="h-6 w-6 mb-1" />
                    Add New Tool
                  </Button>
                  <Button onClick={() => setActiveTab('media')} variant="outline" className="h-16 flex-col">
                    <Upload className="h-6 w-6 mb-1" />
                    Upload Media
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest changes on your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-48">
                            {activity.title}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent activity
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Overview of your website's health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">●</div>
                    <p className="font-medium">Database</p>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">●</div>
                    <p className="font-medium">Storage</p>
                    <p className="text-sm text-muted-foreground">{stats.mediaFiles} files</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">●</div>
                    <p className="font-medium">Analytics</p>
                    <p className="text-sm text-muted-foreground">Tracking active</p>
                  </div>
                </div>
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
        <Sidebar className={`${sidebarOpen ? 'block' : 'hidden'} lg:block border-r`}>
          <SidebarHeader className="border-b p-4 bg-card">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                <p className="text-xs text-muted-foreground">Secure Control Panel</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="p-2">
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
                      className="w-full justify-start p-3 rounded-lg transition-all hover:bg-accent"
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            <div className="p-2 mt-auto border-t">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={signOut}
                  className="w-full justify-start p-3 rounded-lg text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  <span className="font-medium">Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </div>
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
