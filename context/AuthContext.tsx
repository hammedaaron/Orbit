import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, IS_SUPABASE_CONFIGURED } from '../supabaseClient';
import { User } from 'https://esm.sh/@supabase/supabase-js@2.48.1';

type ViewState = 'landing' | 'auth' | 'splash' | 'app' | 'docs';
type DocType = 'documentation' | 'architecture' | 'changelog';

interface AuthContextType {
  view: ViewState;
  docType: DocType | null;
  goToAuth: () => void;
  goToDocs: (type: DocType) => void;
  goToLanding: () => void;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  username: string | null;
  isGuest: boolean;
}

const VIEW_STORAGE_KEY = 'orbit_view_state';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewState>(() => {
    const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
    return (savedView as ViewState) || 'landing';
  });
  
  const [docType, setDocType] = useState<DocType | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(!IS_SUPABASE_CONFIGURED);

  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) {
      // Create a persistent local mock user
      const mockUser = { id: 'local-commander', email: 'commander@orbit.local' } as User;
      setUser(mockUser);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user && view === 'landing') setView('app');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && view === 'auth') {
        setView('splash');
        setTimeout(() => setView('app'), 4000);
      }
    });

    return () => subscription.unsubscribe();
  }, [view]);

  useEffect(() => {
    localStorage.setItem(VIEW_STORAGE_KEY, view);
  }, [view]);

  const goToAuth = () => setView('auth');
  const goToLanding = () => {
    setView('landing');
    setDocType(null);
  };
  const goToDocs = (type: DocType) => {
    setDocType(type);
    setView('docs');
    window.scrollTo(0, 0);
  };

  const signIn = async (email: string, pass: string) => {
    if (!IS_SUPABASE_CONFIGURED) {
      setView('splash');
      setTimeout(() => setView('app'), 4000);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const signUp = async (email: string, pass: string) => {
    if (!IS_SUPABASE_CONFIGURED) return;
    const { error } = await supabase.auth.signUp({ email, password: pass });
    if (error) throw error;
  };

  const logout = async () => {
    if (IS_SUPABASE_CONFIGURED) await supabase.auth.signOut();
    setView('landing');
    setDocType(null);
  };

  const username = user?.email?.split('@')[0] || 'Commander';

  return (
    <AuthContext.Provider value={{ 
      view, 
      docType, 
      goToAuth, 
      goToDocs, 
      goToLanding, 
      signIn, 
      signUp,
      logout, 
      user, 
      username,
      isGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};