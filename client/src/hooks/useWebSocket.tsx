import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface WebSocketMessage {
  type: string;
  data: any;
}

export function useWebSocket(userId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const connect = () => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('[WebSocket] Connected to notifications');
        setIsConnected(true);
        setConnectionError(null);
        setReconnectAttempts(0);

        // Authenticate with user ID
        if (userId) {
          wsRef.current?.send(JSON.stringify({
            type: 'authenticate',
            userId
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'welcome':
              console.log('[WebSocket] Welcome message received');
              break;
              
            case 'initial_data':
              // Update React Query cache with initial data
              queryClient.setQueryData(['notifications', userId], message.data.notifications);
              queryClient.setQueryData(['notifications', userId, 'unread-count'], message.data.unreadCount);
              break;
              
            case 'notification':
              // New notification received - invalidate queries to refetch
              queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
              queryClient.invalidateQueries({ queryKey: ['notifications', userId, 'unread-count'] });
              
              // Show browser notification if permitted
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(message.data.title, {
                  body: message.data.message,
                  icon: '/favicon.ico'
                });
              }
              break;
              
            case 'mark_read_response':
              if (message.data.success) {
                queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
                queryClient.invalidateQueries({ queryKey: ['notifications', userId, 'unread-count'] });
              }
              break;
              
            case 'mark_all_read_response':
              queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
              queryClient.invalidateQueries({ queryKey: ['notifications', userId, 'unread-count'] });
              break;
              
            case 'error':
              console.error('[WebSocket] Server error:', message.data.message);
              setConnectionError(message.data.message);
              break;
              
            case 'pong':
              // Heartbeat response
              break;
              
            default:
              console.warn('[WebSocket] Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log('[WebSocket] Connection closed:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, delay);
        } else {
          setConnectionError('Unable to connect to notifications service');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('[WebSocket] Connection error:', error);
        setConnectionError('Connection error occurred');
      };

    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error);
      setConnectionError('Failed to establish connection');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsConnected(false);
  };

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  };

  const markAsRead = (notificationId: string) => {
    return sendMessage({
      type: 'mark_read',
      notificationId
    });
  };

  const markAllAsRead = () => {
    return sendMessage({
      type: 'mark_all_read'
    });
  };

  // Setup heartbeat
  useEffect(() => {
    if (isConnected) {
      const heartbeat = setInterval(() => {
        sendMessage({ type: 'ping' });
      }, 30000); // 30 seconds

      return () => clearInterval(heartbeat);
    }
  }, [isConnected]);

  // Connect when userId changes
  useEffect(() => {
    if (userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('[WebSocket] Notification permission:', permission);
      });
    }
  }, []);

  return {
    isConnected,
    connectionError,
    sendMessage,
    markAsRead,
    markAllAsRead,
    reconnect: () => {
      setReconnectAttempts(0);
      connect();
    }
  };
}