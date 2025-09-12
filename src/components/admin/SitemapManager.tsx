import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Download, RefreshCw, Globe, FileText, Wrench, Copy } from 'lucide-react';

interface SitemapUrl {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  type: 'page' | 'post' | 'tool' | 'category';
}

export default function SitemapManager() {
  const [sitemapUrls, setSitemapUrls] = useState<SitemapUrl[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    generateSitemap();
  }, []);

  const generateSitemap = async () => {
    setIsGenerating(true);
    try {
      const urls: SitemapUrl[] = [];
      const baseUrl = window.location.origin;

      // Add static pages
      const staticPages = [
        { path: '/', priority: '1.0', changefreq: 'daily' },
        { path: '/articles', priority: '0.9', changefreq: 'daily' },
        { path: '/videos', priority: '0.9', changefreq: 'daily' },
        { path: '/tools', priority: '0.9', changefreq: 'weekly' },
        { path: '/contact', priority: '0.6', changefreq: 'monthly' },
        { path: '/help-center', priority: '0.7', changefreq: 'weekly' },
        { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
        { path: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
      ];

      staticPages.forEach(page => {
        urls.push({
          url: `${baseUrl}${page.path}`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: page.changefreq,
          priority: page.priority,
          type: 'page',
        });
      });

      // Add published posts
      const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at, post_type')
        .eq('status', 'published');

      posts?.forEach(post => {
        const path = post.post_type === 'video' ? `/video/${post.slug}` : `/article/${post.slug}`;
        urls.push({
          url: `${baseUrl}${path}`,
          lastmod: new Date(post.updated_at).toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.8',
          type: 'post',
        });
      });

      // Add active tools
      const { data: tools } = await supabase
        .from('tools')
        .select('id, updated_at')
        .eq('is_active', true);

      tools?.forEach(tool => {
        urls.push({
          url: `${baseUrl}/tool/${tool.id}`,
          lastmod: new Date(tool.updated_at).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.7',
          type: 'tool',
        });
      });

      // Add categories
      const { data: categories } = await supabase
        .from('categories')
        .select('slug, created_at');

      categories?.forEach(category => {
        urls.push({
          url: `${baseUrl}/category/${category.slug}`,
          lastmod: new Date(category.created_at).toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.6',
          type: 'category',
        });
      });

      setSitemapUrls(urls);
      setLastGenerated(new Date().toLocaleString());
      
      toast({
        title: 'Success',
        description: `Sitemap generated with ${urls.length} URLs`,
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate sitemap',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateXMLSitemap = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    return xml;
  };

  const downloadSitemap = () => {
    const xml = generateXMLSitemap();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Success',
      description: 'Sitemap downloaded successfully',
    });
  };

  const copySitemapXML = () => {
    const xml = generateXMLSitemap();
    navigator.clipboard.writeText(xml);
    toast({
      title: 'Copied',
      description: 'Sitemap XML copied to clipboard',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return <Globe className="h-4 w-4" />;
      case 'post': return <FileText className="h-4 w-4" />;
      case 'tool': return <Wrench className="h-4 w-4" />;
      case 'category': return <FileText className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'page': return 'bg-blue-100 text-blue-800';
      case 'post': return 'bg-green-100 text-green-800';
      case 'tool': return 'bg-purple-100 text-purple-800';
      case 'category': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sitemap Management</h1>
          <p className="text-muted-foreground">Generate and manage your website's sitemap</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={generateSitemap}
            disabled={isGenerating}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </Button>
          <Button onClick={downloadSitemap} disabled={sitemapUrls.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Download XML
          </Button>
          <Button onClick={copySitemapXML} disabled={sitemapUrls.length === 0} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copy XML
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{sitemapUrls.length}</div>
            <div className="text-sm text-muted-foreground">Total URLs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {sitemapUrls.filter(url => url.type === 'page').length}
            </div>
            <div className="text-sm text-muted-foreground">Static Pages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {sitemapUrls.filter(url => url.type === 'post').length}
            </div>
            <div className="text-sm text-muted-foreground">Posts & Videos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {sitemapUrls.filter(url => url.type === 'tool').length}
            </div>
            <div className="text-sm text-muted-foreground">Tools</div>
          </CardContent>
        </Card>
      </div>

      {lastGenerated && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Last generated: <span className="font-medium">{lastGenerated}</span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* URL List */}
      <Card>
        <CardHeader>
          <CardTitle>Sitemap URLs</CardTitle>
          <CardDescription>
            All URLs that will be included in your sitemap.xml file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Change Frequency</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sitemapUrls.map((url, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(url.type)}
                      <span className="font-mono text-sm truncate max-w-xs">
                        {url.url}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTypeBadgeColor(url.type)}>
                      {url.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{url.lastmod}</TableCell>
                  <TableCell>{url.changefreq}</TableCell>
                  <TableCell>{url.priority}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SEO Tips */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Best Practices</CardTitle>
          <CardDescription>Tips for optimizing your sitemap</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Sitemap Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Keep your sitemap under 50,000 URLs</li>
                  <li>• Update your sitemap regularly</li>
                  <li>• Submit to Google Search Console</li>
                  <li>• Include only canonical URLs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Priority Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Homepage: 1.0 (highest priority)</li>
                  <li>• Main sections: 0.8-0.9</li>
                  <li>• Content pages: 0.6-0.8</li>
                  <li>• Utility pages: 0.3-0.5</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Next Steps</h4>
              <p className="text-sm text-blue-700">
                After downloading your sitemap.xml, upload it to your website's root directory
                and submit it to Google Search Console for better indexing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}