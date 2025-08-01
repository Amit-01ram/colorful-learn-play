import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash } from 'lucide-react';

interface Ad {
  id: string;
  name: string;
  code: string;
  position: string;
  is_active: boolean;
  created_at: string;
}

export default function AdsManager() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    position: 'homepage_top' as 'homepage_top' | 'homepage_middle' | 'homepage_bottom' | 'post_before' | 'post_inside' | 'post_after',
    is_active: true,
  });
  const { toast } = useToast();

  const positions = [
    { value: 'homepage_top', label: 'Homepage - Top' },
    { value: 'homepage_middle', label: 'Homepage - Middle' },
    { value: 'homepage_bottom', label: 'Homepage - Bottom' },
    { value: 'post_before', label: 'Post - Before Content' },
    { value: 'post_inside', label: 'Post - Inside Content' },
    { value: 'post_after', label: 'Post - After Content' },
  ];

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch ads',
        variant: 'destructive',
      });
    } else {
      setAds(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAd) {
      const { error } = await supabase
        .from('ads')
        .update(formData)
        .eq('id', editingAd.id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update ad',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Ad updated successfully',
        });
        setIsDialogOpen(false);
        fetchAds();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('ads')
        .insert([formData]);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to create ad',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Ad created successfully',
        });
        setIsDialogOpen(false);
        fetchAds();
        resetForm();
      }
    }
  };

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad);
    setFormData({
      name: ad.name,
      code: ad.code,
      position: ad.position,
      is_active: ad.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete ad',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Ad deleted successfully',
      });
      fetchAds();
    }
  };

  const toggleAdStatus = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from('ads')
      .update({ is_active: !isActive })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update ad status',
        variant: 'destructive',
      });
    } else {
      fetchAds();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      position: 'homepage_top',
      is_active: true,
    });
    setEditingAd(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ads Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Ad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAd ? 'Edit Ad' : 'Create New Ad'}</DialogTitle>
              <DialogDescription>
                {editingAd ? 'Update the ad details below' : 'Fill in the details to create a new ad'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Google AdSense Header"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position.value} value={position.value}>
                          {position.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Ad Code</Label>
                <Textarea
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="<script>...</script> or HTML ad code"
                  rows={8}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Paste your Google AdSense code, HTML banner code, or any other ad script here.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAd ? 'Update Ad' : 'Create Ad'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Ads</CardTitle>
          <CardDescription>Manage your advertisement placements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.name}</TableCell>
                  <TableCell>
                    {positions.find(pos => pos.value === ad.position)?.label || ad.position}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={ad.is_active}
                        onCheckedChange={() => toggleAdStatus(ad.id, ad.is_active)}
                      />
                      <span className={`px-2 py-1 rounded text-xs ${
                        ad.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {ad.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(ad.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(ad)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(ad.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ad Integration Guide</CardTitle>
          <CardDescription>How to set up different types of ads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Google AdSense</h3>
            <p className="text-sm text-muted-foreground">
              Copy your AdSense ad code from your Google AdSense dashboard and paste it in the "Ad Code" field above.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Custom HTML/JavaScript</h3>
            <p className="text-sm text-muted-foreground">
              You can add any custom HTML or JavaScript code for banner ads, affiliate links, or custom promotional content.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Position Guidelines</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Homepage Top:</strong> Appears at the top of the homepage</li>
              <li>• <strong>Homepage Middle:</strong> Appears in the middle of the homepage content</li>
              <li>• <strong>Homepage Bottom:</strong> Appears at the bottom of the homepage</li>
              <li>• <strong>Post Before:</strong> Shows before the post content starts</li>
              <li>• <strong>Post Inside:</strong> Appears within the post content (after first paragraph)</li>
              <li>• <strong>Post After:</strong> Shows after the post content ends</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}