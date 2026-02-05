"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

// Detect if keyboard is open on mobile
function useKeyboardVisible() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const handleResize = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;
      
      // Keyboard is likely open if viewport height is significantly smaller than window
      const isOpen = viewport.height < window.innerHeight - 150;
      setIsKeyboardVisible(isOpen);
    };

    window.visualViewport.addEventListener('resize', handleResize);
    window.visualViewport.addEventListener('scroll', handleResize);
    handleResize();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      }
    };
  }, []);

  return isKeyboardVisible;
}

interface AIHelperProps {
  delayMs?: number;
}

export default function ProactiveAIHelper({ delayMs = 8000 }: AIHelperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const isKeyboardVisible = useKeyboardVisible();

  const helpfulTips = [
    {
      title: "Need help getting started?",
      message: "Upload photos of your project or describe what you need. I'll give you an instant estimate!",
      icon: "📸",
      cta: "Try AI Estimator",
      action: () => scrollToEstimator()
    },
    {
      title: "Looking for contractors?",
      message: "Post your project for free and get up to 3 verified contractor bids within 24 hours.",
      icon: "🏗️",
      cta: "Post Project",
      action: () => window.location.href = '/create-lead'
    },
    {
      title: "Want to visualize your space?",
      message: "Use our AI Room Visualizer to see how your renovation will look before you start!",
      icon: "✨",
      cta: "Try Visualizer",
      action: () => window.location.href = '/visualizer'
    },
    {
      title: "Questions about costs?",
      message: "Check out our detailed blog posts on Toronto renovation costs, permits, and contractor selection.",
      icon: "📚",
      cta: "Read Blog",
      action: () => window.location.href = '/blog'
    }
  ];

  const currentTip = helpfulTips[currentTipIndex];

  // Show popup after delay
  useEffect(() => {
    if (isDismissed) return;

    // Check if user permanently dismissed
    const permanentlyDismissed = localStorage.getItem('aiHelperPermanentlyDismissed');
    if (permanentlyDismissed === 'true') {
      console.log('[AIHelper] Permanently dismissed');
      return;
    }

    // Check if user dismissed recently (within 7 days - increased from 24 hours)
    const dismissedTime = localStorage.getItem('aiHelperDismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        console.log('[AIHelper] Skipping auto-open due to recent dismissal');
        return;
      }
    }

    // Only auto-open if hasn't been shown this session
    const shownThisSession = sessionStorage.getItem('aiHelperShownThisSession');
    if (shownThisSession) {
      console.log('[AIHelper] Already shown this session');
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem('aiHelperShownThisSession', 'true');
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, isDismissed]);

  // Detect inactive user (prevent dead clicks)
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!isDismissed && !isVisible) {
          setIsVisible(true);
        }
      }, 15000); // Show after 15s of inactivity
    };

    const trackActivity = () => {
      resetInactivityTimer();
      setClickCount(prev => prev + 1);
    };

    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('click', trackActivity);
    window.addEventListener('scroll', resetInactivityTimer);

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('click', trackActivity);
      window.removeEventListener('scroll', resetInactivityTimer);
    };
  }, [isDismissed, isVisible]);

  // Rotate tips every 20 seconds when visible
  useEffect(() => {
    if (!isVisible) return;

    const tipRotationTimer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % helpfulTips.length);
    }, 20000);

    return () => clearInterval(tipRotationTimer);
  }, [isVisible, helpfulTips.length]);

  const scrollToEstimator = () => {
    const estimatorElement = document.querySelector('[data-estimator]');
    if (estimatorElement) {
      estimatorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('aiHelperDismissed', Date.now().toString());
  };

  const handlePermanentDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('aiHelperPermanentlyDismissed', 'true');
  };

  const handleMinimize = () => {
    setIsVisible(false);
  };

  // Hide when keyboard is visible to prevent overlap with inputs
  if (isKeyboardVisible) {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => {
          setIsVisible(true);
          // Track Clarity event to monitor Help button accessibility
          if (typeof window !== 'undefined' && (window as any).clarity) {
            (window as any).clarity('event', 'help_button_opened', {
              isKeyboardVisible,
              position: 'above_bottom_nav'
            });
          }
        }}
        className="fixed right-3 z-50 bg-gradient-to-r from-rose-700 to-orange-600 text-white p-3 rounded-full shadow-2xl hover:shadow-rose-500/50 transition-all duration-300 hover:scale-110 group pointer-events-auto"
        style={{
          bottom: 'calc(var(--bottom-nav-height, 64px) + env(safe-area-inset-bottom, 0px) + 12px)',
        }}
        aria-label="Open AI Helper"
      >
        <Sparkles className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Help
        </span>
      </button>
    );
  }

  return (
    <div 
      className="fixed right-2 md:right-3 z-50 w-[calc(100vw-1rem)] sm:w-96 max-w-[400px] animate-slide-up pointer-events-auto"
      style={{
        bottom: 'calc(var(--bottom-nav-height, 64px) + env(safe-area-inset-bottom, 0px) + 12px)',
      }}
    >
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl shadow-2xl border-2 border-rose-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 to-orange-600 text-white p-3 md:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-white/20 p-1.5 md:p-2 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg">AI Assistant</h3>
              <p className="text-xs text-rose-100 hidden sm:block">Here to help you!</p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={handleMinimize}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg transition-all"
              aria-label="Minimize"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <div className="text-center mb-3 md:mb-4">
            <div className="text-3xl md:text-5xl mb-2 md:mb-3 animate-bounce">{currentTip.icon}</div>
            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
              {currentTip.title}
            </h4>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {currentTip.message}
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={currentTip.action}
            className="w-full bg-gradient-to-r from-rose-700 to-orange-600 hover:from-rose-800 hover:to-orange-700 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 group text-sm md:text-base"
          >
            <span>{currentTip.cta}</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Tip Navigation */}
          <div className="flex items-center justify-center gap-2 mt-3 md:mt-4">
            {helpfulTips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTipIndex(index)}
                className={`h-1.5 md:h-2 rounded-full transition-all ${
                  index === currentTipIndex
                    ? 'w-6 md:w-8 bg-rose-600'
                    : 'w-1.5 md:w-2 bg-rose-300 hover:bg-rose-400'
                }`}
                aria-label={`Show tip ${index + 1}`}
              />
            ))}
          </div>

          {/* Quick Links - Hidden on mobile to reduce size */}
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-rose-200 hidden sm:block">
            <p className="text-xs text-gray-600 text-center mb-2">Quick Actions:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={scrollToEstimator}
                className="text-xs bg-white hover:bg-rose-50 text-rose-700 font-semibold px-3 py-1.5 rounded-full border border-rose-300 transition-all hover:border-rose-400"
              >
                Get Estimate
              </button>
              <button
                onClick={() => window.location.href = '/visualizer'}
                className="text-xs bg-white hover:bg-orange-50 text-orange-700 font-semibold px-3 py-1.5 rounded-full border border-orange-300 transition-all hover:border-orange-400"
              >
                AI Visualizer
              </button>
              <button
                onClick={() => window.location.href = '/blog'}
                className="text-xs bg-white hover:bg-rose-50 text-rose-700 font-semibold px-3 py-1.5 rounded-full border border-rose-300 transition-all hover:border-rose-400"
              >
                Read Blog
              </button>
            </div>
          </div>
        </div>

        {/* Footer - Hidden on mobile */}
        <div className="bg-rose-100 px-3 md:px-4 py-2 text-center hidden sm:block">
          <p className="text-xs text-rose-700">
            💡 <span className="font-semibold">Pro tip:</span> Try our AI Room Visualizer to see your renovation before you start!
          </p>
        </div>

        {/* Don't show again option */}
        <div className="bg-gray-100 px-3 py-2 text-center border-t border-gray-200">
          <button
            onClick={handlePermanentDismiss}
            className="text-xs text-gray-600 hover:text-gray-800 underline transition-colors"
          >
            Don't show this again
          </button>
        </div>
      </div>
    </div>
  );
}
