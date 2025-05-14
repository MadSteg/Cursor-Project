import { useLocation } from 'wouter';
import { useMemo } from 'react';

/**
 * Custom hook to parse and return URL query parameters
 * @returns Object containing query parameters as key-value pairs
 */
export function useQueryParams(): Record<string, string> {
  const [location] = useLocation();
  
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const result: Record<string, string> = {};
    
    params.forEach((value, key) => {
      result[key] = value;
    });
    
    return result;
  }, [location]);
}