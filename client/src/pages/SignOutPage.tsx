import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

export default function SignOutPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        // Call the logout endpoint
        await apiRequest('POST', '/api/auth/logout');
        
        // Show success toast
        toast({
          title: 'Signed Out',
          description: 'You have been successfully signed out.',
          variant: 'default',
        });
        
        // Redirect to home page after logout
        setTimeout(() => {
          setLocation('/');
        }, 1500);
      } catch (error) {
        console.error('Error signing out:', error);
        toast({
          title: 'Sign Out Failed',
          description: 'There was a problem signing you out. Please try again.',
          variant: 'destructive',
        });
      }
    };

    performSignOut();
  }, [setLocation, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <Spinner className="w-12 h-12 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Signing Out</h1>
      <p className="text-muted-foreground">Please wait while we sign you out...</p>
    </div>
  );
}