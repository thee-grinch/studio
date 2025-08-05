import { useState, useEffect } from 'react';
import { onAuthChange, type User } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/verify-email'];
const PUBLIC_ROUTES = ['/privacy-policy', '/terms-of-service', '/contact'];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("Auth: Subscribing to auth changes.");
    const unsubscribe = onAuthChange((user) => {
      console.log("Auth: onAuthChange event fired.");
      if (user) {
        console.log("Auth: User is logged in.", user);
        setUser(user);
      } else {
        console.log("Auth: User is logged out.");
        setUser(null);
      }
      setLoading(false);
      console.log("Auth: Loading state set to false.");
    });

    return () => {
      console.log("Auth: Unsubscribing from auth changes.");
      unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (loading) {
      console.log("Auth: Still loading, skipping navigation logic.");
      return;
    };

    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || pathname === '/';

    console.log(`Auth: Checking routes. Path: ${pathname}, IsAuth: ${isAuthRoute}, IsPublic: ${isPublicRoute}, User: ${!!user}`);

    if (user && isAuthRoute) {
      console.log("Auth: User is on auth page, redirecting to /dashboard.");
      router.replace('/dashboard');
    } else if (!user && !isAuthRoute && !isPublicRoute) {
      console.log("Auth: User is not logged in and on a protected page, redirecting to /login.");
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  return { user, loading };
}
