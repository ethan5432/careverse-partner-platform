'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StorefrontBuilderPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/partner/store');
  }, [router]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-cv-muted">Redirecting to store editor...</p>
    </div>
  );
}
