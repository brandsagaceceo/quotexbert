"use client";

import { useState, useEffect } from "react";
import { X, Camera, Sparkles } from "lucide-react";
import Link from "next/link";

export function FloatingAIPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Show bubble after 8 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 animate-scale-in ${
        isClosing ? "animate-fade-out" : ""
      }`}
    >
      {/* Main bubble */}
      <Link href="/#ai-estimator" onClick={handleClose}>
        <div className="relative bg-gradient-to-br from-rose-600 via-rose-700 to-orange-600 text-white rounded-2xl shadow-2xl p-6 max-w-sm hover:scale-105 transition-transform duration-300 animate-pulse-glow cursor-pointer">
          {/* Close button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleClose();
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 flex-shrink-0">
              <Camera className="w-8 h-8" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <h3 className="font-bold text-lg">Try AI Instant Quote!</h3>
              </div>
              <p className="text-sm text-white/90 leading-relaxed">
                📸 Take a picture, describe your project, and get an instant AI-powered estimate in seconds!
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                  ✨ FREE
                </span>
                <span className="text-sm font-bold">
                  Try Now →
                </span>
              </div>
            </div>
          </div>

          {/* Animated dots */}
          <div className="absolute -top-2 -right-2 flex gap-1">
            <div className="w-3 h-3 bg-white shadow-lg rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-3 h-3 bg-orange-400 shadow-lg rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-3 h-3 bg-rose-400 shadow-lg rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      </Link>
    </div>
  );
}
