import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export function useUnreadMessageCount() {
  const { authUser, isSignedIn } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!authUser?.id || !isSignedIn) {
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/messages/unread-count?userId=${authUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setLoading(false);
    }
  }, [authUser?.id, isSignedIn]);

  // Fetch unread count on mount and when user changes
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Poll for updates every 30 seconds
  useEffect(() => {
    if (!authUser?.id || !isSignedIn) return;

    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [authUser?.id, isSignedIn, fetchUnreadCount]);

  const markMessagesAsRead = useCallback(async (conversationId: string) => {
    if (!authUser?.id) return;

    try {
      // Mark messages as read
      await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          userId: authUser.id
        })
      });

      // Refresh unread count
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [authUser?.id, fetchUnreadCount]);

  const refreshUnreadCount = useCallback(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    markMessagesAsRead,
    refreshUnreadCount
  };
}