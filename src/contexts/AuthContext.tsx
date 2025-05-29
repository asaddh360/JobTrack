
"use client";

import type { User } from '@/types';
import { loginUser as apiLoginUser, registerUser as apiRegisterUser, updateUserProfile as apiUpdateUserProfile } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, passwordIn: string) => Promise<User | null>;
  signup: (userData: Pick<User, 'name' | 'email' | 'password'>) => Promise<User | null>;
  logout: () => void;
  updateProfile: (userId: string, updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'resumeText' | 'coverLetter'>>) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadUserFromStorage = useCallback(() => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem('currentUser'); // Clear corrupted data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = async (email: string, passwordIn: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const user = await apiLoginUser(email, passwordIn);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error("Login failed", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Pick<User, 'name' | 'email' | 'password'>): Promise<User | null> => {
    setIsLoading(true);
    try {
      const user = await apiRegisterUser(userData);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
      }
      return null; // User might already exist or other error
    } catch (error) {
      console.error("Signup failed", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    router.push('/auth/signin');
  };
  
  const updateProfile = async (userId: string, updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'resumeText' | 'coverLetter'>>): Promise<User | null> => {
    setIsLoading(true);
    try {
      const updatedUser = await apiUpdateUserProfile(userId, updates);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error("Profile update failed", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
