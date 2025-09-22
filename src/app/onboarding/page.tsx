'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingPage } from '@/components/ui/loading';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await fetch('/api/user/onboarding');
        const data = await response.json();
        
        if (data.ok) {
          const status = data.onboardingStatus;
          
          // Redirect to appropriate onboarding stage
          switch (status) {
            case 'incomplete':
              router.push('/onboarding/welcome');
              break;
            case 'daytypes':
              router.push('/onboarding/daytypes');
              break;
            case 'finance':
              router.push('/onboarding/financesetup');
              break;
            case 'guide':
              router.push('/onboarding/guide');
              break;
            case 'completed':
              router.push('/dashboard');
              break;
            default:
              // If status is null/undefined, redirect to start page
              router.push('/onboarding/start');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  if (loading) {
    return <LoadingPage message="Checking your setup progress..." />;
  }

  return null;
}
