"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

interface AIHelperProps {
  delayMs?: number;
}

export default function ProactiveAIHelper({ delayMs = 8000 }: AIHelperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);

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

    const timer = setTimeout(() => {
      setIsVisible(true);
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

  const handleMinimize = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 animate-bounce group"
        aria-label="Open AI Helper"
      >
        <Sparkles className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
          Help
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] animate-slide-up">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI Assistant</h3>
              <p className="text-xs text-purple-100">Here to help you!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMinimize}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg transition-all"
              aria-label="Minimize"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-4">
            <div className="text-5xl mb-3 animate-bounce">{currentTip.icon}</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              {currentTip.title}
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {currentTip.message}
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={currentTip.action}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 group"
          >
            <span>{currentTip.cta}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Tip Navigation */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {helpfulTips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTipIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentTipIndex
                    ? 'w-8 bg-purple-600'
                    : 'w-2 bg-purple-300 hover:bg-purple-400'
                }`}
                aria-label={`Show tip ${index + 1}`}
              />
            ))}
          </div>

          {/* Quick Links */}
          <div className="mt-4 pt-4 border-t border-purple-200">
            <p className="text-xs text-gray-600 text-center mb-2">Quick Actions:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={scrollToEstimator}
                className="text-xs bg-white hover:bg-purple-50 text-purple-700 font-semibold px-3 py-1.5 rounded-full border border-purple-300 transition-all hover:border-purple-400"
              >
                Get Estimate
              </button>
              <button
                onClick={() => window.location.href = '/visualizer'}
                className="text-xs bg-white hover:bg-pink-50 text-pink-700 font-semibold px-3 py-1.5 rounded-full border border-pink-300 transition-all hover:border-pink-400"
              >
                AI Visualizer
              </button>
              <button
                onClick={() => window.location.href = '/blog'}
                className="text-xs bg-white hover:bg-purple-50 text-purple-700 font-semibold px-3 py-1.5 rounded-full border border-purple-300 transition-all hover:border-purple-400"
              >
                Read Blog
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-purple-100 px-4 py-2 text-center">
          <p className="text-xs text-purple-700">
            💡 <span className="font-semibold">Pro tip:</span> Try our AI Room Visualizer to see your renovation before you start!
          </p>
        </div>
      </div>
    </div>
  );
}
