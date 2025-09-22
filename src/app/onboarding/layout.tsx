'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LinesBackground } from '@/components/ui/lavender-bg';
import { LoadingPage } from '@/components/ui/loading';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        setLoading(false);
      } catch (error) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <LoadingPage message="Loading onboarding..." />;
  }

  return (
    <div className="min-h-screen bg-black relative">
      <LinesBackground />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
