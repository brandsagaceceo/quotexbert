'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface FloatingAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'help';
}

interface FloatingActionStackProps {
  actions?: FloatingAction[];
  showHelp?: boolean;
  onHelpClick?: () => void;
}

export default function FloatingActionStack({ 
  actions = [], 
  showHelp = false,
  onHelpClick 
}: FloatingActionStackProps) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Detect keyboard open/close on mobile using visualViewport
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        // Keyboard is likely open if viewport is significantly smaller
        setIsKeyboardOpen(viewportHeight < windowHeight * 0.75);
      }
    };

    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => {
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', handleResize);
        }
      };
    }
  }, []);

  // Hide when keyboard is open
  if (isKeyboardOpen || !isVisible) {
    return null;
  }

  const allActions = [
    ...actions,
    ...(showHelp ? [{
      id: 'help',
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'Help',
      onClick: onHelpClick || (() => {}),
      variant: 'help' as const
    }] : [])
  ];

  if (allActions.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed z-40 flex flex-col gap-2 md:gap-3"
      style={{
        bottom: 'calc(var(--bottom-nav-height, 72px) + env(safe-area-inset-bottom, 0px) + 16px)',
        right: 'max(12px, env(safe-area-inset-right, 12px))'
      }}
    >
      {allActions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          className={`
            w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg
            flex items-center justify-center
            transition-all duration-200
            hover:scale-110 active:scale-95
            ${action.variant === 'help' 
              ? 'bg-rose-700 text-white hover:bg-rose-800' 
              : action.variant === 'secondary'
              ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
              : 'bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:from-rose-700 hover:to-orange-700'
            }
          `}
          aria-label={action.label}
          title={action.label}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}

// Helper hook for managing help dialog state with localStorage
export function useHelpDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const helpAutoOpenedAt = localStorage.getItem('helpAutoOpenedAt');
    const helpDismissedAt = localStorage.getItem('helpDismissedAt');
    const permanentlyDismissed = localStorage.getItem('helpPermanentlyDismissed');
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    // Never auto-open if permanently dismissed
    if (permanentlyDismissed === 'true') {
      return;
    }

    // Auto-open once per session if not dismissed in last 24h
    if (!hasAutoOpened && !sessionStorage.getItem('helpShownThisSession')) {
      const lastDismissed = helpDismissedAt ? parseInt(helpDismissedAt) : 0;
      const lastAutoOpened = helpAutoOpenedAt ? parseInt(helpAutoOpenedAt) : 0;
      
      if (now - lastDismissed > oneDayMs && now - lastAutoOpened > oneDayMs) {
        setTimeout(() => {
          setIsOpen(true);
          setHasAutoOpened(true);
          sessionStorage.setItem('helpShownThisSession', 'true');
          localStorage.setItem('helpAutoOpenedAt', now.toString());
        }, 3000); // Wait 3s before auto-opening
      }
    }
  }, [hasAutoOpened]);

  const open = () => setIsOpen(true);
  
  const close = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('helpDismissedAt', Date.now().toString());
    }
  };

  return { isOpen, open, close };
}
