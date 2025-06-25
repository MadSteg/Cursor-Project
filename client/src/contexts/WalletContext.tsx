import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Simplified context for authentication without wallet functionality
interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Simple login function
  const login = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
  };

  // Simple logout function
  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
  };

  // Check for existing login on mount
  useEffect(() => {
    const savedLogin = localStorage.getItem('userLoggedIn');
    const savedEmail = localStorage.getItem('userEmail');
    
    if (savedLogin === 'true' && savedEmail) {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
    }
  }, []);

  const value: AuthContextType = {
    isLoggedIn,
    userEmail,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Legacy export for compatibility during transition
export const WalletProvider = AuthProvider;
export const useWallet = useAuth;