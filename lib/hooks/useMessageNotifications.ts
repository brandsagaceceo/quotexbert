'use client';

import { useEffect, useRef, useState } from 'react';

export interface MessageNotificationOptions {
  enabled?: boolean;
  soundEnabled?: boolean;
  browserNotificationsEnabled?: boolean;
}

export function useMessageNotifications(options: MessageNotificationOptions = {}) {
  const {
    enabled = true,
    soundEnabled = true,
    browserNotificationsEnabled = true
  } = options;

  const audioContextRef = useRef<AudioContext | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Initialize audio context and request notification permission
  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return;

    // Initialize Web Audio API for sound
    if (soundEnabled) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Request notification permission
    if (browserNotificationsEnabled && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, [enabled, soundEnabled, browserNotificationsEnabled]);

  const playSound = () => {
    if (!soundEnabled || !audioContextRef.current) return;

    try {
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Create a pleasant notification sound (two-tone)
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  const showBrowserNotification = (title: string, options?: NotificationOptions) => {
    if (!browserNotificationsEnabled || notificationPermission !== 'granted') return;

    try {
      const notification = new Notification(title, {
        icon: '/icon.svg',
        badge: '/favicon.svg',
        ...options
      });

      // Close notification after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    } catch (error) {
      console.error('Error showing browser notification:', error);
    }
  };

  const notifyNewMessage = (senderName: string, messagePreview: string, conversationId: string) => {
    if (!enabled) return;

    // Play sound
    if (soundEnabled) {
      playSound();
    }

    // Show browser notification
    if (browserNotificationsEnabled && notificationPermission === 'granted') {
      const notification = showBrowserNotification(`New message from ${senderName}`, {
        body: messagePreview,
        tag: `message-${conversationId}`,
        requireInteraction: false
      });

      if (notification) {
        notification.onclick = () => {
          window.focus();
          window.location.href = `/messages?threadId=${conversationId}`;
        };
      }
    }
  };

  return {
    playSound,
    showBrowserNotification,
    notifyNewMessage,
    notificationPermission,
    requestNotificationPermission: () => {
      if ('Notification' in window) {
        return Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
          return permission;
        });
      }
      return Promise.resolve('denied' as NotificationPermission);
    }
  };
}
