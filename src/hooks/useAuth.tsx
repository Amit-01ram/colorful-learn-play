
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

  const checkAdminStatus = async (userId: string, userEmail: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      // Set a timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.log('⏰ Admin check timeout - defaulting to false');
        resolve(false);
      }, 10000); // 10 second timeout

      try {
        console.log('🔍 Starting admin check for:', userEmail, 'userId:', userId);
        
        // Query the profiles table to check admin status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin, email, user_id')
          .eq('user_id', userId)
          .maybeSingle(); // Use maybeSingle instead of single to handle no results

        console.log('📋 Profile query result:', { profile, profileError });

        if (profileError) {
          console.error('❌ Profile query error:', profileError);
          clearTimeout(timeoutId);
          resolve(false);
          return;
        }

        if (!profile) {
          console.log('⚠️ Profile not found, creating new profile for:', userEmail);
          
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: userId,
              email: userEmail,
              full_name: userEmail.split('@')[0],
              is_admin: false
            })
            .select('is_admin')
            .maybeSingle();

          if (insertError) {
            console.error('❌ Error creating profile:', insertError);
            clearTimeout(timeoutId);
            resolve(false);
            return;
          }

          console.log('✅ Profile created successfully:', newProfile);
          clearTimeout(timeoutId);
          resolve(false); // New profiles default to non-admin
          return;
        }

        const adminStatus = profile?.is_admin || false;
        console.log('🔑 Profile found - admin status:', adminStatus, 'for user:', userEmail);
        clearTimeout(timeoutId);
        resolve(adminStatus);
        
      } catch (error) {
        console.error('💥 Unexpected error in checkAdminStatus:', error);
        clearTimeout(timeoutId);
        resolve(false);
      }
    });
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing authentication...');
        
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          if (mounted) setLoading(false);
          return;
        }

        console.log('📱 Initial session check:', initialSession ? 'Session found' : 'No session');

        if (initialSession && initialSession.user && mounted) {
          console.log('👤 Setting up user session for:', initialSession.user.email);
          setSession(initialSession);
          setUser(initialSession.user);
          
          console.log('🔍 Checking admin status for initial session...');
          try {
            const adminStatus = await checkAdminStatus(initialSession.user.id, initialSession.user.email || '');
            if (mounted) {
              setIsAdmin(adminStatus);
              console.log('✅ Initial admin status set to:', adminStatus);
            }
          } catch (error) {
            console.error('💥 Error in initial admin check:', error);
            if (mounted) {
              setIsAdmin(false);
            }
          }
        }

        if (mounted) {
          console.log('🏁 Initial auth setup complete, setting loading to false');
          setLoading(false);
        }
      } catch (error) {
        console.error('💥 Error in initializeAuth:', error);
        if (mounted) setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
        
        if (!mounted) {
          console.log('⚠️ Component unmounted, ignoring auth change');
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 User logged in, checking admin status...');
          
          // Use setTimeout to defer admin check and prevent blocking
          setTimeout(async () => {
            try {
              const adminStatus = await checkAdminStatus(session.user.id, session.user.email || '');
              if (mounted) {
                setIsAdmin(adminStatus);
                setLoading(false); // Ensure loading is set to false
                console.log('🔑 Auth change - admin status updated to:', adminStatus);
              }
            } catch (error) {
              console.error('💥 Error checking admin status in auth change:', error);
              if (mounted) {
                setIsAdmin(false);
                setLoading(false); // Ensure loading is set to false even on error
              }
            }
          }, 0);
        } else {
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
            console.log('👋 User logged out, resetting admin status');
          }
        }
        
        // Make sure loading is false after auth state change
        if (mounted) {
          setLoading(false);
          console.log('🏁 Auth state change complete, loading set to false');
        }
      }
    );

    initializeAuth();

    return () => {
      console.log('🧹 Cleaning up auth provider');
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

  console.log('📊 Current auth state:', { 
    userEmail: user?.email || 'None', 
    isAdmin, 
    loading,
    hasSession: !!session,
    userId: user?.id || 'None'
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
