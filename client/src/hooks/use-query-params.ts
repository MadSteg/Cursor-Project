/**
 * Custom hook to parse and return URL query parameters
 * @returns Object containing query parameters as key-value pairs
 */
export function useQueryParams(): Record<string, string> {
  // If we're on the client-side
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    
    // Convert URLSearchParams to a plain object
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    
    return params;
  }
  
  // Return empty object if not on client-side
  return {};
}