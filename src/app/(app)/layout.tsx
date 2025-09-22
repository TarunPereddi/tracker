'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/ui/loading';
import { LinesBackground } from '@/components/ui/lavender-bg';
import { ToastContainer } from '@/components/ui/toast-container';
import { 
  Home, 
  Heart, 
  DollarSign, 
  Briefcase, 
  BookOpen, 
  Calendar,
  Target,
  LogOut,
  Menu,
  X,
  Sparkles,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Overview & Analytics' },
  { name: 'Health', href: '/health', icon: Heart, description: 'Track Wellness' },
  { name: 'Finance', href: '/finance', icon: DollarSign, description: 'Money Management' },
  { name: 'Jobs', href: '/jobs', icon: Briefcase, description: 'Career Tracking' },
  { name: 'Skills', href: '/skills', icon: BookOpen, description: 'Learning Progress' },
  { name: 'Routine', href: '/routine', icon: Target, description: 'Daily Planning' },
  { name: 'Profile', href: '/profile', icon: User, description: 'Account Settings' },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Mobile menu toggle function
  const handleMobileMenuToggle = () => {
    setSidebarOpen(prev => !prev);
  };

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        
        // Check if onboarding is incomplete or missing
        if (!data.user.onboardingStatus || data.user.onboardingStatus !== 'completed') {
          router.push('/onboarding');
          return;
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <LoadingPage message="Initializing your life tracker..." />;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative">
      <LinesBackground />
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
          onTouchEnd={() => setSidebarOpen(false)}
        />
        <div className={`fixed inset-y-0 left-0 flex w-64 flex-col bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h1 className="text-lg font-semibold text-white">LifeFlow</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-3 text-sm font-medium rounded-md transition-colors touch-manipulation ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-500'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white active:bg-gray-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-800 p-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start text-gray-400 hover:text-white border-gray-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gray-900 border-r border-gray-800">
          <div className="flex h-16 items-center px-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <h1 className="text-lg font-semibold text-white">LifeFlow</h1>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-500'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-800 p-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start text-gray-400 hover:text-white border-gray-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex h-16 items-center justify-between px-4 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMobileMenuToggle}
            className="text-gray-400 hover:text-white hover:bg-gray-800 p-3 touch-manipulation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h1 className="text-lg font-semibold text-white">LifeFlow</h1>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1 relative z-10 min-h-screen">
          {children}
        </main>
      </div>
      
      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
