'use client';

import { useEffect, useCallback, useRef } from 'react';

export interface Job {
  id: string;
  title: string;
  category: string;
  budget: string;
  location: string;
  description: string;
  createdAt: string;
}

interface UseJobNotificationsOptions {
  userId?: string;
  enabled?: boolean;
  pollInterval?: number;
  onNewJob?: (job: Job) => void;
}

export function useJobNotifications(options: UseJobNotificationsOptions = {}) {
  const {
    userId,
    enabled = true,
    pollInterval = 10000, // Poll every 10 seconds
    onNewJob
  } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seenJobIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  // Initialize audio on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create notification sound (simple beep using Web Audio API)
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      audioRef.current = {
        play: () => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.5
          );
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        }
      } as any;
    }
  }, []);

  const checkForNewJobs = useCallback(async () => {
    if (!enabled || !userId) return;

    try {
      const response = await fetch(`/api/jobs?contractorId=${userId}`);
      if (!response.ok) return;

      const data = await response.json();
      const jobs: Job[] = data.jobs || [];

      if (!initializedRef.current) {
        jobs.forEach((job) => seenJobIdsRef.current.add(job.id));
        initializedRef.current = true;
        return;
      }

      // Find jobs not seen yet
      const newJobs = jobs.filter((job) => !seenJobIdsRef.current.has(job.id));

      newJobs.forEach((job) => seenJobIdsRef.current.add(job.id));

      if (newJobs.length > 0) {
        // Play notification sound
        try {
          audioRef.current?.play();
        } catch (error) {
          console.error('Failed to play notification sound:', error);
        }

        // Trigger callback for each new job
        newJobs.forEach(job => {
          onNewJob?.(job);
        });
      }
    } catch (error) {
      console.error('Error checking for new jobs:', error);
    }
  }, [enabled, userId, onNewJob]);

  // Poll for new jobs
  useEffect(() => {
    if (!enabled || !userId) return;

    const interval = setInterval(checkForNewJobs, pollInterval);
    return () => clearInterval(interval);
  }, [enabled, userId, pollInterval, checkForNewJobs]);

  return {
    checkForNewJobs
  };
}
