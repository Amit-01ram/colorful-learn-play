
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (userId: string, userEmail: string) => {
    try {
      console.log('Checking admin status for user:', userEmail);
      
      // First, check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Profile not found, creating for:', userEmail);
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            email: userEmail,
            full_name: userEmail.split('@')[0], // Use email prefix as default name
            is_admin: false
          })
          .select('is_admin')
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          return false;
        }

        console.log('Profile created successfully');
        return newProfile?.is_admin || false;
      }

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return false;
      }

      console.log('Profile found, admin status:', profile?.is_admin);
      return profile?.is_admin || false;
    } catch (error) {
      console.error('Unexpected error checking admin status:', error);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (mounted) setLoading(false);
          return;
        }

        if (initialSession && initialSession.user && mounted) {
          console.log('Initial session found for:', initialSession.user.email);
          setSession(initialSession);
          setUser(initialSession.user);
          
          const adminStatus = await checkAdminStatus(initialSession.user.id, initialSession.user.email || '');
          if (mounted) {
            setIsAdmin(adminStatus);
            console.log('Initial admin status set:', adminStatus);
          }
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const adminStatus = await checkAdminStatus(session.user.id, session.user.email || '');
          if (mounted) {
            setIsAdmin(adminStatus);
            console.log('Updated admin status:', adminStatus, 'for user:', session.user.email);
          }
        } else {
          if (mounted) {
            setIsAdmin(false);
            console.log('User signed out, admin status reset');
          }
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with:', email);
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      setLoading(false);
    } else {
      console.log('Sign in successful');
      // Loading will be set to false by the auth state change handler
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Attempting to sign up with:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      console.error('Sign up error:', error);
    } else {
      console.log('Sign up successful');
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('Attempting to sign out...');
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
    
    // Clear state regardless of success/failure
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setLoading(false);
  };

  console.log('Current auth state:', { 
    userEmail: user?.email, 
    isAdmin, 
    loading,
    hasSession: !!session 
  });

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
