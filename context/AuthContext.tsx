
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, IS_SUPABASE_CONFIGURED } from '../supabaseClient';
import { User } from 'https://esm.sh/@supabase/supabase-js@2.48.1';
import { SecurityManager } from '../services/persistenceService';

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
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  enterLocalMode: (skipSplash?: boolean) => void;
  unlockVault: (password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  username: string | null;
  isGuest: boolean;
  isCloudActive: boolean;
  isVaultUnlocked: boolean;
}

const VIEW_STORAGE_KEY = 'orbit_view_state';
const LOCAL_MODE_KEY = 'orbit_force_local';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewState>(() => {
    const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
    if (localStorage.getItem(LOCAL_MODE_KEY) === 'true' && savedView === 'app') return 'app';
    return (savedView as ViewState) || 'landing';
  });
  
  const [docType, setDocType] = useState<DocType | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLocalOverride, setIsLocalOverride] = useState(() => localStorage.getItem(LOCAL_MODE_KEY) === 'true');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);

  const isCloudActive = IS_SUPABASE_CONFIGURED && !isLocalOverride;
  const isGuest = !isCloudActive;

  useEffect(() => {
    if (!isCloudActive) {
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
      if (session?.user && (view === 'auth' || view === 'landing')) {
        setView('splash');
        setTimeout(() => setView('app'), 3000);
      }
    });

    return () => subscription.unsubscribe();
  }, [view, isCloudActive]);

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
    if (!isCloudActive) {
      enterLocalMode();
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const signUp = async (email: string, pass: string) => {
    if (!isCloudActive) return;
    const { error } = await supabase.auth.signUp({ email, password: pass });
    if (error) throw error;
  };

  const sendOtp = async (email: string) => {
    if (!isCloudActive) return;
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: { shouldCreateUser: true }
    });
    if (error) throw error;
  };

  const verifyOtp = async (email: string, token: string) => {
    if (!isCloudActive) return;
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });
    if (error) throw error;
  };

  const enterLocalMode = (skipSplash: boolean = false) => {
    localStorage.setItem(LOCAL_MODE_KEY, 'true');
    setIsLocalOverride(true);
    if (skipSplash) {
      setView('app');
    } else {
      setView('splash');
      setTimeout(() => setView('app'), 2000);
    }
  };

  const unlockVault = async (password: string) => {
    try {
      const key = await SecurityManager.deriveKey(password);
      SecurityManager.setKey(key);
      setIsVaultUnlocked(true);
      sessionStorage.setItem('vault_unlocked', 'true');
    } catch (e) {
      throw new Error("Invalid Vault Password");
    }
  };

  const logout = async () => {
    if (IS_SUPABASE_CONFIGURED) await supabase.auth.signOut();
    localStorage.removeItem(LOCAL_MODE_KEY);
    sessionStorage.removeItem('vault_unlocked');
    SecurityManager.setKey(null);
    setIsLocalOverride(false);
    setIsVaultUnlocked(false);
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
      sendOtp,
      verifyOtp,
      enterLocalMode,
      unlockVault,
      logout, 
      user, 
      username,
      isGuest,
      isCloudActive,
      isVaultUnlocked: isVaultUnlocked || sessionStorage.getItem('vault_unlocked') === 'true'
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
