import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api } from '@/http';

// Function to decode JWT token
const decodeToken = (token: string): any => {
  try {
    // JWT tokens are base64 encoded with 3 parts: header.payload.signature
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Define types
export interface User {
  id: number;
  username: string;
  email: string;
  public_id: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ username: string; email: string; public_id: string; role: string } | null>;
  register: (email: string, username: string, password: string) => Promise<any>;
  googleLogin: (token: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  setTokens: (token: string, refreshToken: string) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(
    localStorage.getItem('refreshToken')
  );
  const [isLoading, setIsLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user data on initial load or token change
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Decode the JWT token to get user information
        const decodedToken = decodeToken(token);
        
        if (decodedToken) {
          // Create user object from token claims
          const userData: User = {
            id: decodedToken.user_id,
            username: decodedToken.username,
            email: decodedToken.email,
            public_id: decodedToken.public_id,
            role: decodedToken.role || 'member'
          };
          
          setUser(userData);
        } else {
          // If token can't be decoded, try to refresh
          const refreshed = await refreshToken();
          if (!refreshed) {
            logout();
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading user:', error);
        // If token is invalid, try to refresh
        const refreshed = await refreshToken();
        if (!refreshed) {
          logout();
        }
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      // Use the api instance which already has the baseURL configured
      const response = await api.post(`/users/login/`, {
        user: identifier, // Can be email or username
        password,
      });

      const { token: accessToken, refresh } = response.data;

      // Store tokens
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refresh);
      
      // Decode the token to get user information
      const decodedToken = decodeToken(accessToken);
      
      if (decodedToken) {
        // Create user object from token claims
        const userData: User = {
          id: decodedToken.user_id,
          username: decodedToken.username,
          email: decodedToken.email,
          public_id: decodedToken.public_id,
          role: decodedToken.role
        };
        
        setUser(userData);
      }
      
      setToken(accessToken);
      setRefreshTokenValue(refresh);
      setIsLoading(false);
      
      return decodedToken ? {
        username: decodedToken.username,
        email: decodedToken.email,
        public_id: decodedToken.public_id,
        role: decodedToken.role
      } : null;
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post(`/users/register/`, {
        email,
        username,
        password,
      });

      if (response.data.verification_sent) {
        setIsLoading(false);
        return response.data;
      }

      const { token: accessToken, refresh } = response.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refresh);
      
      setToken(accessToken);
      setRefreshTokenValue(refresh);
      
      const userResponse = await api.get(`/users/profile/`);
      
      setUser(userResponse.data);
      setIsLoading(false);
      
      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
      throw error;
    }
  };

  const googleLogin = async (googleToken: string) => {
    setIsLoading(true);
    try {
      const response = await api.post(`/users/google-login/`, {
        token: googleToken,
      });

      const { token: accessToken, refresh, user: userData } = response.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refresh);
      
      setToken(accessToken);
      setRefreshTokenValue(refresh);
      setUser(userData);
      setIsLoading(false);
      
      return userData;
    } catch (error) {
      setIsLoading(false);
      console.error('Google login error:', error);
      throw error;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!refreshTokenValue) {
      console.warn('No refresh token available for refresh');
      return false;
    }

    try {
      console.log('AuthContext: Attempting to refresh token');
      const response = await api.post(`/users/token/refresh/`, {
        refresh: refreshTokenValue,
      });

      const { token: newAccessToken, refresh: newRefreshToken } = response.data;
      
      // Store the new access token
      localStorage.setItem('token', newAccessToken);
      setToken(newAccessToken);
      
      // If we get a new refresh token (when ROTATE_REFRESH_TOKENS is true)
      if (newRefreshToken) {
        console.log('AuthContext: Received new refresh token');
        localStorage.setItem('refreshToken', newRefreshToken);
        setRefreshTokenValue(newRefreshToken);
      }

      const decodedToken = decodeToken(newAccessToken);
      
      if (decodedToken) {
        console.log('AuthContext: Token refresh successful');
        const userData: User = {
          id: decodedToken.user_id,
          username: decodedToken.username,
          email: decodedToken.email,
          public_id: decodedToken.public_id,
          role: decodedToken.role
        };
        
        setUser(userData);
        return true;
      }
      console.warn('AuthContext: Could not decode the new access token');
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return false;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await api.post(`/users/logout/`, {
          refresh: refreshToken
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setRefreshTokenValue(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const setTokens = (newToken: string, newRefreshToken: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    
    setToken(newToken);
    setRefreshTokenValue(newRefreshToken);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    googleLogin,
    logout,
    refreshToken,
    setTokens,
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        googleLogin,
        logout,
        refreshToken,
        setTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
