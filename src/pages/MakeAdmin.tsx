
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function MakeAdmin() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      console.log('Making user admin:', email);
      
      // First, try to update existing profile
      const { data: updateResult, error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('email', email)
        .select();

      if (updateError || !updateResult || updateResult.length === 0) {
        // Profile doesn't exist, try to create it
        console.log('Profile not found, attempting to create...');
        
        // Get the user from auth.users
        const { data: authUser } = await supabase.auth.admin.listUsers();
        const targetUser = authUser?.users?.find(u => u.email === email);
        
        if (targetUser) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                user_id: targetUser.id,
                email: email,
                full_name: targetUser.user_metadata?.full_name || '',
                is_admin: true
              }
            ]);

          if (insertError) {
            throw insertError;
          }
        } else {
          throw new Error('User not found in auth system');
        }
      }

      toast({
        title: 'Success!',
        description: `User ${email} has been made an admin. They need to sign out and sign in again to see the changes.`,
      });
      setEmail('');
    } catch (error: any) {
      console.error('Error making user admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const makeCurrentUserAdmin = async () => {
    if (!user?.email) {
      toast({
        title: 'Error',
        description: 'No user is currently signed in',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    try {
      console.log('Making current user admin:', user.email);
      
      const { error } = await supabase
        .from('profiles')
        .upsert([
          {
            user_id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            is_admin: true
          }
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success!',
        description: `You are now an admin. Please sign out and sign in again to access the admin dashboard.`,
      });
    } catch (error: any) {
      console.error('Error making current user admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <UserCheck className="h-5 w-5" />
              Make User Admin
            </CardTitle>
            <CardDescription>
              Grant admin privileges to any user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMakeAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : 'Make Admin'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {user && (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
              <CardTitle className="text-sm">Quick Fix</CardTitle>
              <CardDescription>
                Make yourself ({user.email || 'current user'}) an admin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={makeCurrentUserAdmin} 
                className="w-full" 
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Processing...' : 'Make Me Admin'}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Steps to access admin:</strong><br />
            1. Click "Make Me Admin" above<br />
            2. Sign out completely<br />
            3. Sign back in<br />
            4. Go to /admin or click Admin Dashboard button
          </p>
        </div>
      </div>
    </div>
  );
}
