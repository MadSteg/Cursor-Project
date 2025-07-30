import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Notification {
  id: string;
  userId: string;
  type: 'brand_request' | 'reward_earned' | 'receipt_shared' | 'system_update';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
}

export function useNotifications(userId: string) {
  const queryClient = useQueryClient();

  // Get all notifications
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/notifications/${userId}`);
      const data = await response.json();
      return data.success ? data.notifications : [];
    },
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Get unread count
  const { data: unreadData } = useQuery({
    queryKey: ['notifications', userId, 'unread-count'],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/notifications/${userId}/unread-count`);
      const data = await response.json();
      return data.success ? data.count : 0;
    },
    enabled: !!userId,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const unreadCount = unreadData || 0;

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiRequest('POST', `/api/notifications/${userId}/${notificationId}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', userId, 'unread-count'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/notifications/${userId}/read-all`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', userId, 'unread-count'] });
    },
  });

  // Request brand access mutation
  const requestBrandAccessMutation = useMutation({
    mutationFn: async ({ brandName, receiptId, incentive }: { 
      brandName: string; 
      receiptId: string; 
      incentive: string; 
    }) => {
      const response = await apiRequest('POST', `/api/brands/${brandName}/request-access`, {
        userId,
        receiptId,
        incentive
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });

  const markAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const requestBrandAccess = (brandName: string, receiptId: string, incentive: string) => {
    requestBrandAccessMutation.mutate({ brandName, receiptId, incentive });
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    requestBrandAccess,
    refetch,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isRequestingAccess: requestBrandAccessMutation.isPending,
  };
}