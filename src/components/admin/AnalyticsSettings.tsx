import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Search, FileText, Globe } from 'lucide-react';

interface Settings {
  [key: string]: string;
}

export default function AnalyticsSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('category', ['analytics', 'seo']);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch settings',
        variant: 'destructive',
      });
    } else {
      const settingsObj: Settings = {};
      data?.forEach(setting => {
        settingsObj[setting.key] = setting.value || '';
      });
      setSettings(settingsObj);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from('site_settings')
      .update({ value })
      .eq('key', key);

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to update ${key}`,
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      await Promise.all(
        Object.entries(settings).map(([key, value]) => updateSetting(key, value))
      );
      
      toast({
        title: 'Success',
        description: 'Analytics settings updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update some settings',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics & SEO</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Google Analytics
            </CardTitle>
            <CardDescription>Track your website traffic and user behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="google_analytics">Google Analytics Tracking Code</Label>
              <Textarea
                id="google_analytics"
                value={settings.google_analytics || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, google_analytics: e.target.value }))}
                placeholder="<!-- Google tag (gtag.js) -->
<script async src=&quot;https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID&quot;></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>"
                rows={8}
              />
              <p className="text-sm text-muted-foreground">
                Paste your complete Google Analytics tracking code here. You can find this in your Google Analytics dashboard under Admin → Data Streams.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Google Search Console
            </CardTitle>
            <CardDescription>Verify your site with Google Search Console</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="google_search_console">Verification Meta Tag</Label>
              <Input
                id="google_search_console"
                value={settings.google_search_console || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, google_search_console: e.target.value }))}
                placeholder="<meta name=&quot;google-site-verification&quot; content=&quot;your-verification-code&quot; />"
              />
              <p className="text-sm text-muted-foreground">
                Add your Google Search Console verification meta tag. You can find this in Search Console under Settings → Ownership verification.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Robots.txt
            </CardTitle>
            <CardDescription>Control how search engines crawl your site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="robots_txt">Robots.txt Content</Label>
              <Textarea
                id="robots_txt"
                value={settings.robots_txt || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, robots_txt: e.target.value }))}
                placeholder="User-agent: *
Disallow: /admin/
Disallow: /private/

Sitemap: https://yoursite.com/sitemap.xml"
                rows={6}
              />
              <p className="text-sm text-muted-foreground">
                Define rules for search engine crawlers. This will be accessible at yoursite.com/robots.txt
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              SEO Configuration
            </CardTitle>
            <CardDescription>Advanced SEO settings and meta tags</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">SEO Best Practices</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use descriptive titles (50-60 characters)</li>
                  <li>• Write compelling meta descriptions (150-160 characters)</li>
                  <li>• Use relevant keywords naturally</li>
                  <li>• Optimize images with alt text</li>
                  <li>• Create internal links between related content</li>
                  <li>• Ensure fast loading times</li>
                  <li>• Make your site mobile-friendly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard Preview</CardTitle>
          <CardDescription>Sample analytics data visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,234</div>
              <div className="text-sm text-blue-800">Total Visitors</div>
              <div className="text-xs text-blue-600">+12% from last month</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">5,678</div>
              <div className="text-sm text-green-800">Page Views</div>
              <div className="text-xs text-green-600">+8% from last month</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">2:34</div>
              <div className="text-sm text-yellow-800">Avg. Session</div>
              <div className="text-xs text-yellow-600">+5% from last month</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">65%</div>
              <div className="text-sm text-purple-800">Bounce Rate</div>
              <div className="text-xs text-purple-600">-3% from last month</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            This is a preview of what your analytics data might look like once Google Analytics is properly configured.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}