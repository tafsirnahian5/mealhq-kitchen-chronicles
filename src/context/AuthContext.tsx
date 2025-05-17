
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cleanupAuthState = () => {
      // Remove all Supabase auth keys from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          cleanupAuthState();
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Clean up any existing auth state to prevent conflicts
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Attempt to sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Check if it's the email not confirmed error and handle it
        if (error.message.includes('Email not confirmed')) {
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email
          });
          
          if (!resendError) {
            toast.info("Your email wasn't verified. We've sent a new verification email.", {
              duration: 6000,
            });
          } else {
            throw new Error("Could not resend verification email: " + resendError.message);
          }
        }
        throw error;
      }

      if (data.user) {
        toast.success("Signed in successfully!");
        
        // Force page reload for a clean state after successful login
        window.location.href = '/home';
      }
    } catch (error: any) {
      toast.error(error.message || "Error signing in");
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    try {
      setLoading(true);
      
      // Clean up any existing auth state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          },
          emailRedirectTo: window.location.origin + '/login'
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Create a record in the users table with email and phone
        const { error: userError } = await supabase
          .from('users')
          .insert({
            name: name,
            email: email,
            phone: phone || null,
            // Default values for other fields will be applied by the database
          });

        if (userError) {
          console.error("Error creating user record:", userError);
        }

        toast.success("Account created successfully! Please verify your email.", {
          duration: 6000,
        });
        
        // Alert user about next steps
        toast.info("Check your email and click the verification link to complete signup.", {
          duration: 8000,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Error signing up");
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clean up auth state first
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        throw error;
      }
      toast.success("Signed out successfully");
      
      // Force page reload for a clean state
      window.location.href = '/login';
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
