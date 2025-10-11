"use client";

import { useState, useRef, useEffect } from "react";

interface SwipeToActionProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    label: string;
    color: string;
    icon?: React.ReactNode;
  };
  rightAction?: {
    label: string;
    color: string;
    icon?: React.ReactNode;
  };
  threshold?: number;
}

export default function SwipeToAction({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  threshold = 100
}: SwipeToActionProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startX;
    const maxTranslate = 100;
    
    // Only allow swipe if there's an action for that direction
    if (deltaX < 0 && !leftAction) return;
    if (deltaX > 0 && !rightAction) return;
    
    setTranslateX(Math.max(-maxTranslate, Math.min(maxTranslate, deltaX)));
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (Math.abs(translateX) > threshold) {
      if (translateX < 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (translateX > 0 && onSwipeRight) {
        onSwipeRight();
      }
    }
    
    setTranslateX(0);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      handleStart(touch.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      handleMove(touch.clientX);
    }
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse events for testing on desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Prevent scrolling when swiping horizontally
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDragging && Math.abs(translateX) > 10) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => document.removeEventListener('touchmove', preventScroll);
  }, [isDragging, translateX]);

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      {/* Background actions */}
      <div className="absolute inset-0 flex">
        {/* Right action (shows when swiping right) */}
        {rightAction && (
          <div 
            className="flex items-center justify-center px-6 text-white font-semibold"
            style={{ 
              backgroundColor: rightAction.color,
              width: Math.max(0, translateX)
            }}
          >
            {rightAction.icon && <span className="mr-2">{rightAction.icon}</span>}
            <span className="text-sm">{rightAction.label}</span>
          </div>
        )}
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Left action (shows when swiping left) */}
        {leftAction && (
          <div 
            className="flex items-center justify-center px-6 text-white font-semibold"
            style={{ 
              backgroundColor: leftAction.color,
              width: Math.max(0, -translateX)
            }}
          >
            <span className="text-sm">{leftAction.label}</span>
            {leftAction.icon && <span className="ml-2">{leftAction.icon}</span>}
          </div>
        )}
      </div>

      {/* Main content */}
      <div
        className={`relative bg-white transition-transform ${
          isDragging ? 'duration-0' : 'duration-300'
        }`}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleEnd}
      >
        {children}
      </div>
    </div>
  );
}