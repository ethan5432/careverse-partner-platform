'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockUsers } from '@/data/mock';
import type {
  MockUser,
  PartnerType,
  PartnerStatus,
  PartnerApplication,
  ApplicationState,
  OnboardingProgress,
} from '@/data/mock/types';

type MockRole = 'ADMIN' | 'PARTNER';

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  stateProvince: string;
  partnerType: PartnerType;
  password: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  displayName?: string;
  website?: string;
  socialPlatform?: string;
  socialHandle?: string;
  legalBusinessName?: string;
  brandName?: string;
  businessWebsite?: string;
  businessDescription?: string;
}

interface MockAuthContextValue {
  user: MockUser | null;
  loading: boolean;
  application: PartnerApplication | null;
  onboarding: OnboardingProgress;
  emailVerified: boolean;
  login: (email: string, password: string, role: MockRole) => { success: boolean; error?: string };
  logout: () => void;
  switchPartnerType: (type: PartnerType) => void;
  switchStatus: (status: PartnerStatus) => void;
  signup: (data: SignupData) => { success: boolean; error?: string };
  approveApplication: (applicationId: string) => void;
  activateAccount: (password: string) => { success: boolean; error?: string };
  updateOnboarding: (updates: Partial<OnboardingProgress>) => void;
  isOnboardingComplete: () => boolean;
  setEmailVerified: (verified: boolean) => void;
  requestPasswordReset: (email: string) => { success: boolean; error?: string };
  resetPassword: (email: string, newPassword: string) => { success: boolean; error?: string };
}

const defaultOnboarding: OnboardingProgress = {
  profileComplete: false,
  storeCustomized: false,
  packagesChosen: false,
  contentAdded: false,
  payoutsSetup: false,
  storePublished: false,
  storeShared: false,
};

const MockAuthContext = createContext<MockAuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'careverse_mock_auth';
const APPLICATION_KEY = 'careverse_mock_application';
const ONBOARDING_KEY = 'careverse_mock_onboarding';
const EMAIL_VERIFIED_KEY = 'careverse_mock_email_verified';

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [application, setApplication] = useState<PartnerApplication | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingProgress>(defaultOnboarding);
  const [emailVerified, setEmailVerifiedState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as MockUser);
      }
      const storedApp = localStorage.getItem(APPLICATION_KEY);
      if (storedApp) {
        setApplication(JSON.parse(storedApp) as PartnerApplication);
      }
      const storedOnboarding = localStorage.getItem(ONBOARDING_KEY);
      if (storedOnboarding) {
        setOnboarding(JSON.parse(storedOnboarding) as OnboardingProgress);
      }
      const storedVerified = localStorage.getItem(EMAIL_VERIFIED_KEY);
      if (storedVerified === 'true') {
        setEmailVerifiedState(true);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const persistApplication = (app: PartnerApplication | null) => {
    setApplication(app);
    try {
      if (app) {
        localStorage.setItem(APPLICATION_KEY, JSON.stringify(app));
      } else {
        localStorage.removeItem(APPLICATION_KEY);
      }
    } catch {
      // ignore
    }
  };

  const persistOnboarding = (ob: OnboardingProgress) => {
    setOnboarding(ob);
    try {
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(ob));
    } catch {
      // ignore
    }
  };

  const persistEmailVerified = (verified: boolean) => {
    setEmailVerifiedState(verified);
    try {
      localStorage.setItem(EMAIL_VERIFIED_KEY, verified ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  const persistUser = (u: MockUser | null) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  };

  const login = useCallback((email: string, _password: string, role: MockRole): { success: boolean; error?: string } => {
    const matchingUser = mockUsers.find(u => u.role === role) || mockUsers[0];
    const loggedIn: MockUser = {
      ...matchingUser,
      email: email || matchingUser.email,
    };
    persistUser(loggedIn);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    persistUser(null);
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

  const switchStatus = useCallback((status: PartnerStatus) => {
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

  const signup = useCallback((data: SignupData): { success: boolean; error?: string } => {
    if (!data.acceptTerms || !data.acceptPrivacy) {
      return { success: false, error: 'You must accept the Terms and Privacy Policy.' };
    }
    if (data.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }
    const app: PartnerApplication = {
      id: `app-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      stateProvince: data.stateProvince,
      partnerType: data.partnerType,
      password: data.password,
      acceptTerms: data.acceptTerms,
      acceptPrivacy: data.acceptPrivacy,
      displayName: data.displayName,
      website: data.website,
      socialPlatform: data.socialPlatform,
      socialHandle: data.socialHandle,
      legalBusinessName: data.legalBusinessName,
      brandName: data.brandName,
      businessWebsite: data.businessWebsite,
      businessDescription: data.businessDescription,
      applicationState: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
    };
    persistApplication(app);
    return { success: true };
  }, []);

  const approveApplication = useCallback((_applicationId: string) => {
    setApplication(prev => {
      if (!prev) return prev;
      const updated: PartnerApplication = {
        ...prev,
        applicationState: 'APPROVED' as ApplicationState,
        approvedAt: new Date().toISOString(),
      };
      persistApplication(updated);
      return updated;
    });
  }, []);

  const activateAccount = useCallback((password: string): { success: boolean; error?: string } => {
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }
    const app = application;
    if (!app) {
      return { success: false, error: 'No application found.' };
    }
    const name = app.partnerType === 'CREATOR'
      ? (app.displayName || `${app.firstName} ${app.lastName}`)
      : (app.brandName || app.legalBusinessName || `${app.firstName} ${app.lastName}`);
    const newUser: MockUser = {
      id: `u-${Date.now()}`,
      name,
      email: app.email,
      role: 'PARTNER',
      partnerType: app.partnerType,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().slice(0, 10),
      lastActive: new Date().toISOString().slice(0, 10),
    };
    persistUser(newUser);
    const updatedApp: PartnerApplication = {
      ...app,
      applicationState: 'APPROVED',
      activatedAt: new Date().toISOString(),
      password,
    };
    persistApplication(updatedApp);
    persistEmailVerified(true);
    persistOnboarding(defaultOnboarding);
    return { success: true };
  }, [application]);

  const updateOnboarding = useCallback((updates: Partial<OnboardingProgress>) => {
    setOnboarding(prev => {
      const updated = { ...prev, ...updates };
      persistOnboarding(updated);
      return updated;
    });
  }, []);

  const isOnboardingComplete = useCallback(() => {
    return Object.values(onboarding).every(v => v === true);
  }, [onboarding]);

  const setEmailVerified = useCallback((verified: boolean) => {
    persistEmailVerified(verified);
  }, []);

  const requestPasswordReset = useCallback((_email: string): { success: boolean; error?: string } => {
    return { success: true };
  }, []);

  const resetPassword = useCallback((_email: string, newPassword: string): { success: boolean; error?: string } => {
    if (newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }
    return { success: true };
  }, []);

  return (
    <MockAuthContext.Provider
      value={{
        user,
        loading,
        application,
        onboarding,
        emailVerified,
        login,
        logout,
        switchPartnerType,
        switchStatus,
        signup,
        approveApplication,
        activateAccount,
        updateOnboarding,
        isOnboardingComplete,
        setEmailVerified,
        requestPasswordReset,
        resetPassword,
      }}
    >
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
