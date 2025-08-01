import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Globe, Settings, Users, Link } from 'lucide-react';

interface Settings {
  [key: string]: string;
}

export default function GlobalSettings() {
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
      .in('category', ['general', 'social']);

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
        description: 'Settings updated successfully',
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

  const isMaintenanceMode = settings.maintenance_mode === 'true';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Global Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Site Information
            </CardTitle>
            <CardDescription>Basic information about your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Site Name</Label>
              <Input
                id="site_name"
                value={settings.site_name || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                placeholder="Your Site Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea
                id="site_description"
                value={settings.site_description || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                placeholder="A brief description of your website"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Site Status
            </CardTitle>
            <CardDescription>Control your site's availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenance_mode"
                checked={isMaintenanceMode}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, maintenance_mode: checked.toString() }))
                }
              />
              <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
            </div>
            
            {isMaintenanceMode && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ When maintenance mode is enabled, visitors will see a maintenance page 
                  instead of your regular site content. Only administrators can access the site.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-semibold">Site Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Total Posts</div>
                  <div className="text-muted-foreground">Loading...</div>
                </div>
                <div>
                  <div className="font-medium">Total Tools</div>
                  <div className="text-muted-foreground">Loading...</div>
                </div>
                <div>
                  <div className="font-medium">Active Ads</div>
                  <div className="text-muted-foreground">Loading...</div>
                </div>
                <div>
                  <div className="font-medium">Media Files</div>
                  <div className="text-muted-foreground">Loading...</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link className="h-5 w-5 mr-2" />
              Social Media Links
            </CardTitle>
            <CardDescription>Connect your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input
                id="facebook_url"
                value={settings.facebook_url || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, facebook_url: e.target.value }))}
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter_url">Twitter URL</Label>
              <Input
                id="twitter_url"
                value={settings.twitter_url || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, twitter_url: e.target.value }))}
                placeholder="https://twitter.com/yourusername"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={settings.linkedin_url || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, linkedin_url: e.target.value }))}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input
                id="instagram_url"
                value={settings.instagram_url || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, instagram_url: e.target.value }))}
                placeholder="https://instagram.com/yourusername"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Management
            </CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Admin Access</h4>
                <p className="text-sm text-blue-700">
                  You currently have administrator privileges. To grant admin access to other users, 
                  you can update their profile in the database or create a user management interface.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Security Settings</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Change your password in your profile settings</li>
                  <li>• Enable two-factor authentication for enhanced security</li>
                  <li>• Regular security audits are recommended</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Technical details about your site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium">Platform</div>
              <div className="text-muted-foreground">React + Supabase</div>
            </div>
            <div>
              <div className="font-medium">Database</div>
              <div className="text-muted-foreground">PostgreSQL</div>
            </div>
            <div>
              <div className="font-medium">Storage</div>
              <div className="text-muted-foreground">Supabase Storage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}