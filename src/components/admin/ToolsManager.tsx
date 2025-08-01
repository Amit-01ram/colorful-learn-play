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

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  embed_code: string;
  category: string;
  thumbnail_url: string;
  is_featured: boolean;
  is_active: boolean;
  homepage_position: number;
  created_at: string;
}

export default function ToolsManager() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    embed_code: '',
    category: 'other' as 'productivity' | 'design' | 'development' | 'marketing' | 'analytics' | 'other',
    thumbnail_url: '',
    is_featured: false,
    is_active: true,
    homepage_position: 0,
  });
  const { toast } = useToast();

  const categories = [
    { value: 'productivity', label: 'Productivity' },
    { value: 'design', label: 'Design' },
    { value: 'development', label: 'Development' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch tools',
        variant: 'destructive',
      });
    } else {
      setTools(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTool) {
      const { error } = await supabase
        .from('tools')
        .update(formData)
        .eq('id', editingTool.id);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update tool',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Tool updated successfully',
        });
        setIsDialogOpen(false);
        fetchTools();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('tools')
        .insert([formData]);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to create tool',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Tool created successfully',
        });
        setIsDialogOpen(false);
        fetchTools();
        resetForm();
      }
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description,
      url: tool.url,
      embed_code: tool.embed_code,
      category: tool.category,
      thumbnail_url: tool.thumbnail_url,
      is_featured: tool.is_featured,
      is_active: tool.is_active,
      homepage_position: tool.homepage_position,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tool',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Tool deleted successfully',
      });
      fetchTools();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      url: '',
      embed_code: '',
      category: 'other',
      thumbnail_url: '',
      is_featured: false,
      is_active: true,
      homepage_position: 0,
    });
    setEditingTool(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tools Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTool ? 'Edit Tool' : 'Create New Tool'}</DialogTitle>
              <DialogDescription>
                {editingTool ? 'Update the tool details below' : 'Fill in the details to create a new tool'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tool Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Tool name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tool description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Tool URL</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="embed_code">Embed Code (Optional)</Label>
                <Textarea
                  id="embed_code"
                  value={formData.embed_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, embed_code: e.target.value }))}
                  placeholder="<iframe src='...'></iframe>"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homepage_position">Homepage Position</Label>
                  <Input
                    id="homepage_position"
                    type="number"
                    value={formData.homepage_position}
                    onChange={(e) => setFormData(prev => ({ ...prev, homepage_position: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTool ? 'Update Tool' : 'Create Tool'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tools</CardTitle>
          <CardDescription>Manage your tools and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell className="font-medium">{tool.name}</TableCell>
                  <TableCell>
                    {categories.find(cat => cat.value === tool.category)?.label || tool.category}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      tool.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tool.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{tool.is_featured ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{tool.homepage_position}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(tool)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(tool.id)}>
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
    </div>
  );
}