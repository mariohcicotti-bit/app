import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFetchingProfile = useRef(false);

  const fetchProfile = async (userId) => {
    if (isFetchingProfile.current) return;
    
    isFetchingProfile.current = true;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
      isFetchingProfile.current = false;
    }
  };

  useEffect(() => {
    // Buscar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user && event !== 'INITIAL_SESSION') {
        await fetchProfile(session.user.id);
      } else if (!session) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    try {
      console.log('SignUp attempt:', { email, passwordLength: password.length });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      console.log('SignUp response:', { data, error });
      if (error) {
        console.error('SignUp error details:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('SignUp catch error:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('SignIn attempt:', { email, passwordLength: password.length });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('SignIn response:', { data, error });
      if (error) {
        console.error('SignIn error details:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('SignIn catch error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      throw error;
    }
  };

  const getTrialDaysRemaining = () => {
    if (!profile) return 0;
    if (profile.is_pro_member) return null;

    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const daysSinceCreation = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 7 - daysSinceCreation);
    
    return daysRemaining;
  };

  const canGeneratePDF = () => {
    if (!profile) return false;
    if (profile.is_pro_member) return true;
    
    const daysRemaining = getTrialDaysRemaining();
    return daysRemaining > 0;
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    getTrialDaysRemaining,
    canGeneratePDF,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
