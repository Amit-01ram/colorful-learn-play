import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash, Copy, Image, FileText, Video } from 'lucide-react';

interface MediaFile {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export default function MediaManager() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    const { data, error } = await supabase
      .from('media_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch media files',
        variant: 'destructive',
      });
    } else {
      setMediaFiles(data || []);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('media_files')
        .insert([{
          filename: fileName,
          original_filename: selectedFile.name,
          file_path: publicUrl.publicUrl,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
        }]);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });

      setSelectedFile(null);
      fetchMediaFiles();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      });
    }

    setIsUploading(false);
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([file.filename]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', file.id);

      if (dbError) {
        throw dbError;
      }

      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });

      fetchMediaFiles();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete file',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Success',
      description: 'URL copied to clipboard',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    return FileText;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Media Manager</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Media File</DialogTitle>
              <DialogDescription>
                Upload images, videos, PDFs, and other media files
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Click to select a file</p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </label>
              </div>
              
              {selectedFile && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
          <CardDescription>
            Manage your uploaded files. Click on any URL to copy it to clipboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mediaFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Upload className="h-12 w-12 mx-auto mb-4" />
              <p>No media files uploaded yet</p>
              <p className="text-sm">Upload your first file to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaFiles.map((file) => {
                const FileIcon = getFileIcon(file.mime_type);
                const isImage = file.mime_type.startsWith('image/');
                
                return (
                  <Card key={file.id} className="overflow-hidden">
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      {isImage ? (
                        <img
                          src={file.file_path}
                          alt={file.original_filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileIcon className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate" title={file.original_filename}>
                        {file.original_filename}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {formatFileSize(file.file_size)}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(file.file_path)}
                          className="flex-1"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy URL
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(file)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Guidelines</CardTitle>
          <CardDescription>Best practices for media management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Supported File Types</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Images: JPG, PNG, GIF, WebP, SVG</li>
                <li>• Videos: MP4, WebM, MOV</li>
                <li>• Documents: PDF, DOC, DOCX, TXT</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Best Practices</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Optimize images before uploading</li>
                <li>• Use descriptive filenames</li>
                <li>• Keep file sizes reasonable (under 10MB)</li>
                <li>• Use web-friendly formats</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}