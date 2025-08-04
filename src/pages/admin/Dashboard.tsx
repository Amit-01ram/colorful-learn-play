
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  Shield, 
  LogOut,
  Home,
  Wrench,
  DollarSign,
  Eye,
  TrendingUp,
  Calendar,
  Search
} from 'lucide-react';
import PostsManager from '@/components/admin/PostsManager';
import ThemeToggle from '@/components/admin/ThemeToggle';

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const stats = [
    { title: 'Total Posts', value: '24', icon: FileText, change: '+12%' },
    { title: 'Page Views', value: '12,847', icon: Eye, change: '+8.2%' },
    { title: 'Active Tools', value: '8', icon: Wrench, change: '+2' },
    { title: 'Revenue', value: '$1,247', icon: DollarSign, change: '+15.3%' },
  ];

  const recentActivity = [
    { action: 'New post published', time: '2 hours ago', type: 'post' },
    { action: 'Tool updated', time: '4 hours ago', type: 'tool' },
    { action: 'User registered', time: '6 hours ago', type: 'user' },
    { action: 'Ad performance improved', time: '1 day ago', type: 'ads' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-2" />
              View Website
            </Button>
            <ThemeToggle />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Welcome, {user?.email}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r bg-card/30 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === 'posts' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('posts')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Posts & Articles
            </Button>
            <Button
              variant={activeTab === 'tools' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('tools')}
            >
              <Wrench className="h-4 w-4 mr-2" />
              Tools Management
            </Button>
            <Button
              variant={activeTab === 'ads' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('ads')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Ads Management
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Site Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Overview</h2>
                <p className="text-muted-foreground">
                  Welcome to your admin dashboard. Here's what's happening with your website.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">
                          {stat.change}
                        </span>{' '}
                        from last month
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest actions and updates on your website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div className="h-2 w-2 bg-primary rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant="outline">{activity.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Frequently used actions for managing your website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2"
                      onClick={() => setActiveTab('posts')}
                    >
                      <FileText className="h-6 w-6" />
                      <span>New Post</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2"
                      onClick={() => setActiveTab('tools')}
                    >
                      <Wrench className="h-6 w-6" />
                      <span>Add Tool</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2"
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings className="h-6 w-6" />
                      <span>Settings</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col gap-2"
                      onClick={() => setActiveTab('analytics')}
                    >
                      <BarChart3 className="h-6 w-6" />
                      <span>Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'posts' && <PostsManager />}

          {activeTab === 'tools' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Tools Management</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Tools management interface will be implemented here.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Ads Management</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Ads management interface will be implemented here.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Website Analytics</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Analytics dashboard will be implemented here.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Site Settings</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">Site settings interface will be implemented here.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
