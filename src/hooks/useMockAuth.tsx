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
  CreatorProfile,
  StorefrontAccessState,
  AffiliateLink,
  BusinessProfile,
  BusinessEntityType,
  BusinessCategory,
  BusinessOperatingDuration,
} from '@/data/mock/types';
import {
  loadCreatorProfiles,
  saveCreatorProfiles,
  loadStorefrontAccess,
  saveStorefrontAccess,
  loadAffiliateLink,
} from '@/lib/creator-persistence';

type MockRole = 'ADMIN' | 'PARTNER';

interface SignupData {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  stateProvince?: string;
  partnerType: PartnerType;
  creatorName?: string;
  website?: string;
  creatorProfiles?: CreatorProfile[];
  legalBusinessName?: string;
  brandName?: string;
  businessWebsite?: string;
  businessDescription?: string;
  businessCategory?: BusinessCategory;
  businessEntityType?: BusinessEntityType;
  businessRegistrationNumber?: string;
  registrationLocation?: string;
  businessMailingAddress?: string;
  businessOperatingDuration?: BusinessOperatingDuration;
  businessProfiles?: BusinessProfile[];
  bookOfBusinessDescription?: string;
  estimatedVolumeDescription?: string;
  partnershipExpectations?: string;
  acquisitionMethods?: string[];
  acquisitionOtherDetail?: string;
  purchasesAdvertising?: 'YES' | 'NO';
  advertisingPlatforms?: string[];
  advertisingPlatformOtherDetail?: string;
  hasDecisionAuthority?: 'YES' | 'NO';
  decisionMakerName?: string;
  decisionMakerRole?: string;
  decisionMakerEmail?: string;
  confirmAccurate: boolean;
  confirmNoGuarantee: boolean;
  acceptTerms: boolean;
}

interface MockAuthContextValue {
  user: MockUser | null;
  loading: boolean;
  application: PartnerApplication | null;
  onboarding: OnboardingProgress;
  emailVerified: boolean;
  creatorProfiles: CreatorProfile[];
  storefrontAccess: StorefrontAccessState;
  affiliateLink: AffiliateLink | null;
  login: (email: string, password: string, role: MockRole) => { success: boolean; error?: string };
  logout: () => void;
  switchPartnerType: (type: PartnerType) => void;
  switchStatus: (status: PartnerStatus) => void;
  signup: (data: SignupData) => { success: boolean; error?: string };
  approveApplication: (applicationId: string) => void;
  rejectApplication: (applicationId: string) => void;
  resendActivationEmail: (applicationId: string) => void;
  activateAccount: (password: string) => { success: boolean; error?: string };
  updateOnboarding: (updates: Partial<OnboardingProgress>) => void;
  isOnboardingComplete: () => boolean;
  setEmailVerified: (verified: boolean) => void;
  requestPasswordReset: (email: string) => { success: boolean; error?: string };
  resetPassword: (email: string, newPassword: string) => { success: boolean; error?: string };
  updateCreatorProfiles: (profiles: CreatorProfile[]) => void;
  hasStorefrontAccess: () => boolean;
  grantStorefrontAccess: () => void;
  refreshStorefrontAccess: () => void;
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
  const [creatorProfiles, setCreatorProfiles] = useState<CreatorProfile[]>([]);
  const [storefrontAccess, setStorefrontAccess] = useState<StorefrontAccessState>('NONE');
  const [affiliateLink, setAffiliateLink] = useState<AffiliateLink | null>(null);

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
      if (stored) {
        const parsedUser = JSON.parse(stored) as MockUser;
        const profiles = loadCreatorProfiles(parsedUser.id);
        setCreatorProfiles(profiles);
        const access = loadStorefrontAccess(parsedUser.id);
        setStorefrontAccess(access);
        const affLink = loadAffiliateLink(parsedUser.id);
        setAffiliateLink(affLink);
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
    if (!data.confirmAccurate || !data.confirmNoGuarantee || !data.acceptTerms) {
      return { success: false, error: 'You must complete all confirmations.' };
    }
    const app: PartnerApplication = {
      id: `app-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      country: data.country,
      stateProvince: data.stateProvince,
      partnerType: data.partnerType,
      creatorName: data.creatorName,
      website: data.website,
      creatorProfiles: data.creatorProfiles,
      legalBusinessName: data.legalBusinessName,
      brandName: data.brandName,
      businessWebsite: data.businessWebsite,
      businessDescription: data.businessDescription,
      businessCategory: data.businessCategory,
      businessEntityType: data.businessEntityType,
      businessRegistrationNumber: data.businessRegistrationNumber,
      registrationLocation: data.registrationLocation,
      businessMailingAddress: data.businessMailingAddress,
      businessOperatingDuration: data.businessOperatingDuration,
      businessProfiles: data.businessProfiles,
      bookOfBusinessDescription: data.bookOfBusinessDescription,
      estimatedVolumeDescription: data.estimatedVolumeDescription,
      partnershipExpectations: data.partnershipExpectations,
      acquisitionMethods: data.acquisitionMethods,
      acquisitionOtherDetail: data.acquisitionOtherDetail,
      purchasesAdvertising: data.purchasesAdvertising,
      advertisingPlatforms: data.advertisingPlatforms,
      advertisingPlatformOtherDetail: data.advertisingPlatformOtherDetail,
      hasDecisionAuthority: data.hasDecisionAuthority,
      decisionMakerName: data.decisionMakerName,
      decisionMakerRole: data.decisionMakerRole,
      decisionMakerEmail: data.decisionMakerEmail,
      confirmAccurate: data.confirmAccurate,
      confirmNoGuarantee: data.confirmNoGuarantee,
      acceptTerms: data.acceptTerms,
      applicationState: 'SUBMITTED',
      accountStatus: 'PENDING_ACTIVATION',
      submittedAt: new Date().toISOString(),
    };
    persistApplication(app);
    if (data.creatorProfiles && data.creatorProfiles.length > 0) {
      const tempId = `u-${Date.now()}`;
      saveCreatorProfiles(tempId, data.creatorProfiles);
    }
    return { success: true };
  }, []);

  const approveApplication = useCallback((_applicationId: string) => {
    setApplication(prev => {
      if (!prev) return prev;
      const updated: PartnerApplication = {
        ...prev,
        applicationState: 'APPROVED' as ApplicationState,
        accountStatus: 'PENDING_ACTIVATION',
        approvedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        activationEmailSentAt: new Date().toISOString(),
      };
      persistApplication(updated);
      return updated;
    });
  }, []);

  const rejectApplication = useCallback((_applicationId: string) => {
    setApplication(prev => {
      if (!prev) return prev;
      const updated: PartnerApplication = {
        ...prev,
        applicationState: 'REJECTED' as ApplicationState,
        rejectedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
      };
      persistApplication(updated);
      return updated;
    });
  }, []);

  const resendActivationEmail = useCallback((_applicationId: string) => {
    setApplication(prev => {
      if (!prev) return prev;
      const updated: PartnerApplication = {
        ...prev,
        activationEmailSentAt: new Date().toISOString(),
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
    if (app.applicationState !== 'APPROVED') {
      return { success: false, error: 'Your application has not been approved yet.' };
    }
    const name = app.partnerType === 'CREATOR'
      ? (app.creatorName || app.fullName)
      : (app.brandName || app.legalBusinessName || app.fullName);
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
    if (app.partnerType === 'CREATOR') {
      const profiles = loadCreatorProfiles(newUser.id);
      setCreatorProfiles(profiles);
      const access = loadStorefrontAccess(newUser.id);
      setStorefrontAccess(access === 'NONE' ? 'LOCKED' : access);
      if (access === 'NONE') {
        saveStorefrontAccess(newUser.id, 'LOCKED');
      }
      const affLink = loadAffiliateLink(newUser.id);
      setAffiliateLink(affLink);
    } else {
      saveStorefrontAccess(newUser.id, 'UNLOCKED');
      setStorefrontAccess('UNLOCKED');
    }
    const updatedApp: PartnerApplication = {
      ...app,
      activatedAt: new Date().toISOString(),
      accountStatus: 'ACTIVE',
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

  const updateCreatorProfiles = useCallback((profiles: CreatorProfile[]) => {
    setCreatorProfiles(profiles);
    if (user) {
      saveCreatorProfiles(user.id, profiles);
    }
  }, [user]);

  const hasStorefrontAccessFn = useCallback(() => {
    if (!user) return false;
    if (user.partnerType === 'BUSINESS') return true;
    return storefrontAccess === 'UNLOCKED';
  }, [user, storefrontAccess]);

  const grantStorefrontAccessFn = useCallback(() => {
    if (user) {
      saveStorefrontAccess(user.id, 'UNLOCKED');
      setStorefrontAccess('UNLOCKED');
    }
  }, [user]);

  const refreshStorefrontAccess = useCallback(() => {
    if (user) {
      const access = loadStorefrontAccess(user.id);
      setStorefrontAccess(access);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const profiles = loadCreatorProfiles(user.id);
      setCreatorProfiles(profiles);
      const access = loadStorefrontAccess(user.id);
      setStorefrontAccess(access);
      const affLink = loadAffiliateLink(user.id);
      setAffiliateLink(affLink);
    } else {
      setCreatorProfiles([]);
      setStorefrontAccess('NONE');
      setAffiliateLink(null);
    }
  }, [user?.id]);

  return (
    <MockAuthContext.Provider
      value={{
        user,
        loading,
        application,
        onboarding,
        emailVerified,
        creatorProfiles,
        storefrontAccess,
        affiliateLink,
        login,
        logout,
        switchPartnerType,
        switchStatus,
        signup,
        approveApplication,
        rejectApplication,
        resendActivationEmail,
        activateAccount,
        updateOnboarding,
        isOnboardingComplete,
        setEmailVerified,
        requestPasswordReset,
        resetPassword,
        updateCreatorProfiles,
        hasStorefrontAccess: hasStorefrontAccessFn,
        grantStorefrontAccess: grantStorefrontAccessFn,
        refreshStorefrontAccess,
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
