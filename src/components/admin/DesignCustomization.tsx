import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Settings {
  [key: string]: string;
}

export default function DesignCustomization() {
  const [settings, setSettings] = useState<Settings>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fonts = [
    'Inter',
    'Arial',
    'Helvetica',
    'Georgia',
    'Times New Roman',
    'Verdana',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('category', ['general', 'theme']);

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
        description: 'Design settings updated successfully',
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

  const handleFileUpload = async (key: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${key}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload file',
        variant: 'destructive',
      });
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    setSettings(prev => ({ ...prev, [key]: publicUrl.publicUrl }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Design Customization</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand Assets</CardTitle>
            <CardDescription>Upload and manage your brand assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo">Site Logo</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="logo"
                  value={settings.site_logo || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, site_logo: e.target.value }))}
                  placeholder="Logo URL"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('site_logo', file);
                  }}
                  className="w-auto"
                />
              </div>
              {settings.site_logo && (
                <img src={settings.site_logo} alt="Logo preview" className="h-16 object-contain" />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="favicon"
                  value={settings.site_favicon || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, site_favicon: e.target.value }))}
                  placeholder="Favicon URL"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('site_favicon', file);
                  }}
                  className="w-auto"
                />
              </div>
              {settings.site_favicon && (
                <img src={settings.site_favicon} alt="Favicon preview" className="h-8 w-8" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Scheme</CardTitle>
            <CardDescription>Customize your site's color palette</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primary_color"
                  type="color"
                  value={settings.primary_color?.replace('hsl(', '#').replace(')', '') || '#3b82f6'}
                  onChange={(e) => {
                    const hex = e.target.value;
                    // Convert hex to HSL format
                    setSettings(prev => ({ ...prev, primary_color: hex }));
                  }}
                  className="w-16 h-10"
                />
                <Input
                  value={settings.primary_color || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                  placeholder="hsl(221, 83%, 53%)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="secondary_color"
                  type="color"
                  value={settings.secondary_color?.replace('hsl(', '#').replace(')', '') || '#f1f5f9'}
                  onChange={(e) => {
                    const hex = e.target.value;
                    setSettings(prev => ({ ...prev, secondary_color: hex }));
                  }}
                  className="w-16 h-10"
                />
                <Input
                  value={settings.secondary_color || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, secondary_color: e.target.value }))}
                  placeholder="hsl(210, 40%, 98%)"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Configure fonts and text styling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="body_font">Body Font</Label>
              <Select value={settings.body_font || 'Inter'} onValueChange={(value) => setSettings(prev => ({ ...prev, body_font: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heading_font">Heading Font</Label>
              <Select value={settings.heading_font || 'Inter'} onValueChange={(value) => setSettings(prev => ({ ...prev, heading_font: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="font_size">Base Font Size (px)</Label>
                <Input
                  id="font_size"
                  type="number"
                  value={settings.font_size || '16'}
                  onChange={(e) => setSettings(prev => ({ ...prev, font_size: e.target.value }))}
                  placeholder="16"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="line_height">Line Height</Label>
                <Input
                  id="line_height"
                  value={settings.line_height || '1.6'}
                  onChange={(e) => setSettings(prev => ({ ...prev, line_height: e.target.value }))}
                  placeholder="1.6"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Layout Preview</CardTitle>
            <CardDescription>Preview your design changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 space-y-4 bg-background">
              <div 
                className="text-2xl font-bold"
                style={{ 
                  fontFamily: settings.heading_font || 'Inter',
                  color: settings.primary_color || 'hsl(221, 83%, 53%)'
                }}
              >
                Sample Heading
              </div>
              <div 
                className="text-base"
                style={{ 
                  fontFamily: settings.body_font || 'Inter',
                  fontSize: settings.font_size ? `${settings.font_size}px` : '16px',
                  lineHeight: settings.line_height || '1.6'
                }}
              >
                This is a preview of how your body text will appear with the selected font and styling options. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </div>
              <div 
                className="px-4 py-2 rounded text-white inline-block"
                style={{ backgroundColor: settings.primary_color || 'hsl(221, 83%, 53%)' }}
              >
                Sample Button
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}