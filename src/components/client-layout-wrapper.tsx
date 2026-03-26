"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Lazy load heavy components to reduce initial bundle size
const AuthProvider = dynamic(() => import('@/components/auth-provider').then(mod => ({ default: mod.AuthProvider })), {
  ssr: false
});

const UnifiedLayout = dynamic(() => import('@/components/layout/unified-layout').then(mod => ({ default: mod.UnifiedLayout })), {
  ssr: false
});

const ErrorBoundary = dynamic(() => import('@/components/error-boundary').then(mod => ({ default: mod.ErrorBoundary })), {
  ssr: false
});

const ReferralHandler = dynamic(() => import('@/components/referral-handler').then(mod => ({ default: mod.ReferralHandler })), {
  ssr: false
});

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UnifiedLayout>
          <ReferralHandler />
          {children}
        </UnifiedLayout>
      </AuthProvider>
    </ErrorBoundary>
  );
}