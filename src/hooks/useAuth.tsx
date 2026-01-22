import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

const API_BASE_URL = 'http://192.168.2.185:5000';

interface User {
  id: string;
  email: string;
  fullName: string;
  empId: string;
  role?: string;
  user_metadata?: {
    full_name: string;
    emp_id: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isRecovering: boolean;
  signUp: (email: string, password: string, fullName: string, empId: string) => Promise<{ error: Error | null }>;
  signIn: (emailOrEmpId: string, password: string) => Promise<{ error: Error | null, isAdmin?: boolean }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === 'Admin' || parsedUser.email === 'admin@elderline.com');
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, empId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName, empId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      return await signIn(email, password);
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (emailOrEmpId: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailOrEmpId, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const token = data.token;
      const userData = data.user || data; // Handle different response shapes

      const adaptedUser: User = {
        id: userData.id || userData.email,
        email: userData.email,
        fullName: userData.fullName || userData.full_name || userData.fullName,
        empId: userData.empId || userData.emp_id || userData.empId,
        role: userData.role,
        user_metadata: {
          full_name: userData.fullName || userData.full_name,
          emp_id: userData.empId || userData.emp_id
        }
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(adaptedUser));
      
      setUser(adaptedUser);
      const userIsAdmin = adaptedUser.role === 'Admin' || adaptedUser.email === 'admin@elderline.com';
      setIsAdmin(userIsAdmin);

      return { error: null, isAdmin: userIsAdmin };
    } catch (error: any) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    return { error: new Error('Password reset not implemented for this API') };
  };

  const updatePassword = async (password: string) => {
    return { error: new Error('Password update not implemented for this API') };
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAdmin(false);
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isRecovering, signUp, signIn, resetPassword, updatePassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
