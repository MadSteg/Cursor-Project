import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UseGalleryPollOptions {
  taskId?: string;
  enabled?: boolean;
  interval?: number;
  maxAttempts?: number;
}

export function useGalleryPoll({
  taskId,
  enabled = true,
  interval = 5000,
  maxAttempts = 12, // Default to 1 minute (12 * 5000ms)
}: UseGalleryPollOptions) {
  const queryClient = useQueryClient();
  const [pollCount, setPollCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [taskCompleted, setTaskCompleted] = useState(false);

  // Task status query
  const taskQuery = useQuery({
    queryKey: taskId ? ['/api/nfts/task', taskId] : null,
    enabled: !!taskId && enabled && pollCount < maxAttempts && !taskCompleted,
    refetchInterval: interval,
    refetchOnWindowFocus: false,
  });

  // Function to refresh the gallery manually
  const refreshGallery = useCallback(() => {
    // Invalidate user's NFT gallery query to force a refresh
    queryClient.invalidateQueries({ queryKey: ['/api/gallery'] });
    setRefreshTrigger(prev => prev + 1);
  }, [queryClient]);

  // Check if task is completed and trigger refresh
  useEffect(() => {
    if (!taskQuery.data) return;

    const { status } = taskQuery.data;
    
    if (status === 'completed') {
      setTaskCompleted(true);
      
      // Wait 2 seconds before refreshing to allow blockchain transaction to be visible
      setTimeout(() => {
        refreshGallery();
      }, 2000);
    }
  }, [taskQuery.data, refreshGallery]);

  // Increment poll count on each fetch
  useEffect(() => {
    if (taskQuery.isFetching) {
      setPollCount(prev => prev + 1);
    }
  }, [taskQuery.isFetching]);

  // If we reach max attempts, try one final refresh
  useEffect(() => {
    if (pollCount >= maxAttempts && !taskCompleted) {
      refreshGallery();
    }
  }, [pollCount, maxAttempts, taskCompleted, refreshGallery]);

  return {
    isPolling: taskQuery.isFetching,
    taskStatus: taskQuery.data?.status || 'unknown',
    pollCount,
    refreshGallery,
    refreshTrigger,
    taskCompleted,
  };
}