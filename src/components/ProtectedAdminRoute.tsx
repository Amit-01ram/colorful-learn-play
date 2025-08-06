
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2, Shield, AlertTriangle, User, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, isAdmin, loading } = useAuth();

  console.log('🛡️ ProtectedAdminRoute render:', {
    userEmail: user?.email || 'No user',
    userId: user?.id || 'No ID', 
    isAdmin, 
    loading,
    timestamp: new Date().toISOString()
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying admin credentials...</p>
          <div className="text-xs text-muted-foreground space-y-1 p-4 bg-muted/30 rounded-lg">
            <p><strong>User:</strong> {user?.email || 'None'}</p>
            <p><strong>User ID:</strong> {user?.id || 'None'}</p>
            <p><strong>Admin Status:</strong> {loading ? 'Checking...' : (isAdmin ? 'Yes' : 'No')}</p>
            <p><strong>Loading:</strong> {loading ? 'True' : 'False'}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🚫 No user found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              Administrator privileges required to access this area.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-3 bg-muted rounded-lg text-sm space-y-2">
              <p><strong>Current User:</strong> {user.email}</p>
              <p><strong>User ID:</strong> <code className="text-xs">{user.id}</code></p>
              <p><strong>Admin Status:</strong> <span className="text-destructive">No</span></p>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>To grant admin access:</strong></p>
              <ol className="text-left list-decimal list-inside space-y-1 text-xs">
                <li>Go to your Supabase dashboard</li>
                <li>Open the Table Editor</li>
                <li>Find the 'profiles' table</li>
                <li>Locate your profile row</li>
                <li>Set 'is_admin' field to true</li>
                <li>Save the changes</li>
              </ol>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="flex-1"
              >
                Return Home
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="default"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('✅ Admin access granted for:', user.email);
  return <>{children}</>;
}
