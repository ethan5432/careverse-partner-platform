'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockUsers } from '@/data/mock';
import type { MockUser, PartnerType } from '@/data/mock/types';

type MockRole = 'ADMIN' | 'PARTNER';

interface MockAuthContextValue {
  user: MockUser | null;
  loading: boolean;
  login: (email: string, password: string, role: MockRole) => { success: boolean; error?: string };
  logout: () => void;
  switchPartnerType: (type: PartnerType) => void;
  switchStatus: (status: MockUser['status']) => void;
}

const MockAuthContext = createContext<MockAuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'careverse_mock_auth';

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as MockUser;
        setUser(parsed);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const login = useCallback((email: string, _password: string, role: MockRole): { success: boolean; error?: string } => {
    // Mock: accept any email/password. Pick a user matching the role.
    const matchingUser = mockUsers.find(u => u.role === role) || mockUsers[0];
    const loggedIn: MockUser = {
      ...matchingUser,
      email: email || matchingUser.email,
    };
    setUser(loggedIn);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
    } catch {
      // ignore
    }
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const switchPartnerType = useCallback((type: PartnerType) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, partnerType: type };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const switchStatus = useCallback((status: MockUser['status']) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, status };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  return (
    <MockAuthContext.Provider value={{ user, loading, login, logout, switchPartnerType, switchStatus }}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockAuth() {
  const ctx = useContext(MockAuthContext);
  if (!ctx) {
    throw new Error('useMockAuth must be used within MockAuthProvider');
  }
  return ctx;
}
