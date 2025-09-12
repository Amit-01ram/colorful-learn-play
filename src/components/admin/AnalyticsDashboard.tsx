import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Eye, Users, Clock, Video, FileText, TrendingUp, Calendar } from 'lucide-react';

interface AnalyticsData {
  totalPosts: number;
  totalViews: number;
  totalVideoViews: number;
  avgSessionTime: string;
  bounceRate: number;
  topPosts: Array<{ title: string; views: number; slug: string }>;
  recentActivity: Array<{ action: string; time: string; type: string }>;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalPosts: 0,
    totalViews: 0,
    totalVideoViews: 0,
    avgSessionTime: '0:00',
    bounceRate: 0,
    topPosts: [],
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch posts data
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, title, slug, view_count, created_at')
        .eq('status', 'published');

      if (postsError) throw postsError;

      // Fetch video analytics
      const { data: videoAnalytics, error: videoError } = await supabase
        .from('video_analytics')
        .select('*');

      if (videoError) throw videoError;

      // Process the data
      const totalViews = posts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
      const totalVideoViews = videoAnalytics?.length || 0;
      
      // Top posts by views
      const topPosts = posts
        ?.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 5)
        .map(post => ({
          title: post.title,
          views: post.view_count || 0,
          slug: post.slug,
        })) || [];

      // Recent activity (mock data for now)
      const recentActivity = [
        { action: 'New post published', time: '2 hours ago', type: 'post' },
        { action: 'Video watched', time: '4 hours ago', type: 'video' },
        { action: 'Ad impression tracked', time: '6 hours ago', type: 'ads' },
        { action: 'Tool accessed', time: '1 day ago', type: 'tool' },
      ];

      setAnalyticsData({
        totalPosts: posts?.length || 0,
        totalViews,
        totalVideoViews,
        avgSessionTime: '2:34', // Mock data
        bounceRate: 65, // Mock data
        topPosts,
        recentActivity,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Posts',
      value: analyticsData.totalPosts.toString(),
      icon: FileText,
      change: '+12%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Page Views',
      value: analyticsData.totalViews.toLocaleString(),
      icon: Eye,
      change: '+8.2%',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Video Views',
      value: analyticsData.totalVideoViews.toString(),
      icon: Video,
      change: '+15.3%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Avg. Session',
      value: analyticsData.avgSessionTime,
      icon: Clock,
      change: '+5%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="video">Video Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">
                          {stat.change}
                        </span>{' '}
                        from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
                <CardDescription>Most viewed content this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topPosts.map((post, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground">/{post.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{post.views.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  {analyticsData.topPosts.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No posts found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest events on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <span className="px-2 py-1 bg-background rounded text-xs">
                        {activity.type}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>Detailed analytics for your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analyticsData.totalPosts}</div>
                    <div className="text-sm text-blue-800">Published Posts</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analyticsData.totalViews.toLocaleString()}</div>
                    <div className="text-sm text-green-800">Total Views</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {analyticsData.totalPosts > 0 ? Math.round(analyticsData.totalViews / analyticsData.totalPosts) : 0}
                    </div>
                    <div className="text-sm text-purple-800">Avg. Views per Post</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience Insights</CardTitle>
              <CardDescription>Understanding your visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Session Duration</h4>
                  <div className="text-2xl font-bold">{analyticsData.avgSessionTime}</div>
                  <p className="text-sm text-muted-foreground">Average time spent on site</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Bounce Rate</h4>
                  <div className="text-2xl font-bold">{analyticsData.bounceRate}%</div>
                  <p className="text-sm text-muted-foreground">Visitors who leave after one page</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Analytics</CardTitle>
              <CardDescription>Performance metrics for your video content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{analyticsData.totalVideoViews}</div>
                  <div className="text-sm text-red-800">Total Video Events</div>
                  <div className="text-xs text-red-600">All video interactions</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">--</div>
                  <div className="text-sm text-blue-800">Avg. Watch Time</div>
                  <div className="text-xs text-blue-600">Coming soon</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">--</div>
                  <div className="text-sm text-green-800">Completion Rate</div>
                  <div className="text-xs text-green-600">Coming soon</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}