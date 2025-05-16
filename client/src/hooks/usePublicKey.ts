/**
 * Hook for getting the user's TaCo public key
 */
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

interface TacoKey {
  id: number;
  name: string;
  publicKey: string;
  createdAt: string;
}

interface UsePublicKeyOptions {
  keyName?: string; // Optionally specify a particular key name
}

export function usePublicKey(options: UsePublicKeyOptions = {}) {
  const { isAuthenticated, user } = useAuth();
  const { keyName } = options;

  const { data, isLoading, error } = useQuery({
    queryKey: ['taco', 'keys'],
    queryFn: async () => {
      const response = await fetch('/api/taco/keys');
      if (!response.ok) {
        throw new Error('Failed to fetch TaCo keys');
      }
      return await response.json();
    },
    enabled: isAuthenticated,
  });

  let publicKey: string | null = null;

  if (data && Array.isArray(data.keys)) {
    if (keyName) {
      // Find a specific key by name
      const key = data.keys.find((k: TacoKey) => k.name === keyName);
      publicKey = key ? key.publicKey : null;
    } else {
      // Get the first key (primary key)
      publicKey = data.keys.length > 0 ? data.keys[0].publicKey : null;
    }
  }

  return {
    publicKey,
    keys: data?.keys || [],
    isLoading,
    error,
  };
}

export default usePublicKey;