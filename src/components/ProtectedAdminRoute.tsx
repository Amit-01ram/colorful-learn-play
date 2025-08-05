
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2, Shield, AlertTriangle, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { user, isAdmin, loading } = useAuth();

  console.log('ProtectedAdminRoute - User:', user?.email, 'IsAdmin:', isAdmin, 'Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verifying credentials...</p>
          <p className="text-xs text-muted-foreground">
            User: {user?.email || 'None'} | Admin: {isAdmin ? 'Yes' : 'No'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to auth');
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
              You don't have administrator privileges to access this area.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p><strong>Current User:</strong> {user.email}</p>
              <p><strong>Admin Status:</strong> {isAdmin ? 'Yes' : 'No'}</p>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Please contact your administrator to grant you admin privileges in the database.
            </p>
            
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Return to Website
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('Admin access granted, rendering dashboard');
  return <>{children}</>;
}
