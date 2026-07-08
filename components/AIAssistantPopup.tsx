"use client";

import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Sparkles, Home, Briefcase, Send } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  actions?: { label: string; href: string; variant?: 'primary' | 'secondary' }[];
}

export default function AIAssistantPopup() {
  const { authUser, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [userType, setUserType] = useState<'homeowner' | 'contractor' | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHelperBubble, setShowHelperBubble] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Pages where the widget should be hidden (forms, messaging, dense UIs)
  const HIDE_ON_PATHS = ['/messages', '/chat', '/create-lead', '/create-project', '/sign-in', '/sign-up', '/second-opinion', '/landing/estimate', '/profile', '/contractor/subscriptions', '/contractor/jobs', '/ai-quote', '/ai-renovation-check', '/billing'];
  const shouldHideForPath = HIDE_ON_PATHS.some((p) => pathname?.startsWith(p));

  // Hide widget when site-header mobile menu opens
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ open: boolean }>).detail;
      setMobileMenuOpen(detail.open);
      if (detail.open && isOpen) setIsOpen(false);
    };
    window.addEventListener('mobileMenuToggle', handler);
    return () => window.removeEventListener('mobileMenuToggle', handler);
  }, [isOpen]);

  useEffect(() => {
    // Determine user type
    if (isSignedIn && authUser) {
      setUserType(authUser.role === 'contractor' ? 'contractor' : 'homeowner');
    }

    // Check cooldown period (24 hours since last dismissal)
    const lastDismissed = localStorage.getItem('aiAssistantLastDismissed');
    if (lastDismissed) {
      const hoursSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        console.log('[AIAssistant] In cooldown period, will not auto-open');
        return;
      }
    }

    // Only auto-open once per session
    const shownThisSession = sessionStorage.getItem('aiAssistantShownThisSession');
    if (shownThisSession) {
      console.log('[AIAssistant] Already shown this session');
      return;
    }

    // Auto-open disabled — widget button remains visible for users to click
  }, [isSignedIn, authUser]);

  // Auto-hide on form/messaging pages and when estimator/form is in viewport on mobile
  useEffect(() => {
    if (shouldHideForPath) {
      setIsHidden(true);
      if (isOpen) setIsOpen(false);
      return;
    }

    // Hide on pages that opt-out via data attribute (e.g. not-found page)
    const hasOptOut = typeof document !== 'undefined' && !!document.querySelector('[data-no-ai-widget]');
    if (hasOptOut) {
      setIsHidden(true);
      return;
    }

    const handleScroll = () => {
      if (!buttonRef.current) return;
      
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      
      // Hide if near bottom (within 300px) on mobile to avoid overlapping CTAs
      if (window.innerWidth < 768) {
        const nearBottom = scrollY + viewportHeight > docHeight - 300;
        setIsHidden(nearBottom);
      } else {
        setIsHidden(false);
      }
    };

    setIsHidden(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [shouldHideForPath, pathname]);

  // On mobile: hide widget when the estimator tool is scrolled into view
  useEffect(() => {
    if (shouldHideForPath || typeof window === 'undefined') return;
    const estimatorEl = document.querySelector('[data-estimator]');
    if (!estimatorEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (window.innerWidth >= 768) return; // desktop: no-op
        if (entry.isIntersecting) {
          setIsHidden(true);
          if (isOpen) setIsOpen(false);
        } else {
          setIsHidden(false);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(estimatorEl);
    return () => observer.disconnect();
  }, [shouldHideForPath, pathname, isOpen]);

  // On mobile: hide widget when any input/textarea/select is focused (user is interacting with a form).
  // IMPORTANT: exclude focus events that happen inside the chat window itself — otherwise the
  // widget's own input field closes the popup every time the user tries to type.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleFocusIn = (e: FocusEvent) => {
      if (window.innerWidth >= 768) return;
      // If the focused element is inside our chat window, do NOT hide
      if (chatWindowRef.current && chatWindowRef.current.contains(e.target as Node)) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        setIsHidden(true);
        if (isOpen) setIsOpen(false);
      }
    };
    const handleFocusOut = () => {
      if (window.innerWidth >= 768) return;
      // Small delay to allow new focus to settle — if another field is focused, handleFocusIn will re-hide
      setTimeout(() => {
        const active = document.activeElement;
        // If focus moved into the chat window, keep it visible
        if (chatWindowRef.current && chatWindowRef.current.contains(active as Node)) return;
        const tag = active?.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT' && !shouldHideForPath) {
          setIsHidden(false);
        }
      }, 200);
    };
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [shouldHideForPath, isOpen]);

  // Show a one-time helper bubble for contractors to aid discoverability
  useEffect(() => {
    if (userType !== 'contractor') return;
    if (typeof window !== 'undefined' && localStorage.getItem('aiHelperBubbleDismissed')) return;
    const timer = setTimeout(() => setShowHelperBubble(true), 3000);
    return () => clearTimeout(timer);
  }, [userType]);

  // Track virtual keyboard height on mobile so the chat window stays above it
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const vv = window.visualViewport;
    const handleViewportChange = () => {
      const kbHeight = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardOffset(Math.max(0, kbHeight));
    };
    vv.addEventListener('resize', handleViewportChange);
    vv.addEventListener('scroll', handleViewportChange);
    return () => {
      vv.removeEventListener('resize', handleViewportChange);
      vv.removeEventListener('scroll', handleViewportChange);
    };
  }, []);

  const initializeChat = () => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: isSignedIn 
        ? `Hi ${authUser?.name || 'there'}! 👋 I'm your QuoteXbert AI assistant. How can I help you today?`
        : "Hi! 👋 I'm your QuoteXbert AI assistant. I can help homeowners get instant quotes and contractors find work. What brings you here today?",
      actions: isSignedIn 
        ? userType === 'homeowner'
          ? [
              { label: '📸 Get Instant Quote', href: '/#instant-quote', variant: 'primary' },
              { label: '📄 AI Quote Generator', href: '/ai-quote', variant: 'secondary' },
              { label: '👷 Browse Contractors', href: '/contractors', variant: 'secondary' },
            ]
          : [
              { label: '📋 Browse Jobs', href: '/contractor/jobs', variant: 'primary' },
              { label: '💼 My Profile', href: '/profile', variant: 'secondary' },
              { label: '📖 View Terms', href: '#', variant: 'secondary' },
            ]
        : [
            { label: '🏠 I am a Homeowner', href: '#homeowner', variant: 'primary' },
            { label: '👷 I am a Contractor', href: '#contractor', variant: 'secondary' },
          ]
    };
    setMessages([welcomeMessage]);
  };

  const handleActionClick = (href: string, label: string) => {
    if (href === '#homeowner') {
      const msg: Message = {
        role: 'assistant',
        content: "Perfect! As a homeowner, I can help you:\n\n✨ Get instant AI-powered quotes by uploading photos\n📄 Generate professional contracts instantly\n👷 Connect with verified contractors\n💰 100% free - no hidden fees!\n\nReady to get started?",
        actions: [
          { label: '📸 Upload Photos for Quote', href: '/#instant-quote', variant: 'primary' },
          { label: '📄 Generate Free Contract', href: '/ai-quote', variant: 'secondary' },
          { label: '📖 Read Blog Tips', href: '/blog', variant: 'secondary' },
        ]
      };
      setMessages(prev => [...prev, msg]);
    } else if (href === '#contractor') {
      const msg: Message = {
        role: 'assistant',
        content: "Welcome, contractor! QuoteXbert helps you:\n\n📋 Find qualified leads in your area\n💼 Build your portfolio\n⭐ Get reviews and ratings\n📊 Grow your business\n\n**Important:** By accepting jobs, you agree to our contractor terms including professional standards, response times, and quality guarantees.",
        actions: [
          { label: '📖 Read Terms & Conditions', href: '#terms', variant: 'primary' },
          { label: '👤 Create Contractor Profile', href: '/sign-up', variant: 'secondary' },
        ]
      };
      setMessages(prev => [...prev, msg]);
    } else if (href === '#terms') {
      setShowTerms(true);
    } else if (href === '#') {
      // Show terms for signed-in contractors
      setShowTerms(true);
    } else if (href === '#refresh') {
      window.location.reload();
    } else if (href.startsWith('mailto:')) {
      window.location.href = href;
    } else if (href.startsWith('/#')) {
      setIsOpen(false);
      setTimeout(() => {
        const element = document.querySelector(href.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      router.push(href);
      setIsOpen(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    const lowerInput = inputValue.toLowerCase();
    setInputValue('');

    try {
      let response: Message;

      // Gate: logged-out users trying protected actions
      if (!isSignedIn) {
        const isProtectedRequest =
          (lowerInput.includes('post my') && (lowerInput.includes('job') || lowerInput.includes('project'))) ||
          (lowerInput.includes('send') && lowerInput.includes('message')) ||
          (lowerInput.includes('message') && lowerInput.includes('contractor')) ||
          lowerInput.includes('my dashboard') ||
          lowerInput.includes('accept') && lowerInput.includes('job') ||
          (lowerInput.includes('my profile') && !lowerInput.includes('create')) ||
          lowerInput.includes('my estimate') ||
          lowerInput.includes('my account');

        if (isProtectedRequest) {
          response = {
            role: 'assistant',
            content: 'Please sign in or create a free account to continue.',
            actions: [
              { label: '🔑 Sign In', href: '/sign-in', variant: 'primary' },
              { label: '📝 Create Free Account', href: '/sign-up', variant: 'secondary' },
            ]
          };
          setMessages(prev => [...prev, response]);
          return;
        }
      }

      if (
        lowerInput.includes('what is quotexbert') ||
        lowerInput.includes('about quotexbert') ||
        lowerInput.includes('how does quotexbert work') ||
        lowerInput.includes('tell me about') ||
        (lowerInput.includes('about') && lowerInput.includes('platform'))
      ) {
        response = {
          role: 'assistant',
          content: "QuoteXbert is a GTA-based home renovation platform that connects homeowners with verified contractors.\n\n🏠 **For Homeowners:** Upload photos to get instant AI-powered quotes, generate professional contracts, and receive bids from local contractors — 100% free.\n\n👷 **For Contractors:** Access qualified leads, build your portfolio, and grow your renovation business.",
          actions: isSignedIn
            ? [{ label: '📸 Get an Instant Quote', href: '/#instant-quote', variant: 'primary' }]
            : [
                { label: '🏠 Sign Up as Homeowner', href: '/sign-up', variant: 'primary' },
                { label: '👷 Sign Up as Contractor', href: '/sign-up', variant: 'secondary' },
              ]
        };
      } else if (
        lowerInput.includes('ai estimate') ||
        lowerInput.includes('estimate work') ||
        (lowerInput.includes('how does') && lowerInput.includes('estimate')) ||
        (lowerInput.includes('how does') && lowerInput.includes('ai')) ||
        (lowerInput.includes('how does') && lowerInput.includes('work'))
      ) {
        response = {
          role: 'assistant',
          content: "Our AI estimator works in 3 steps:\n\n1. 📸 **Upload photos** of your renovation project\n2. 📝 **Describe the work** you need done\n3. ⚡ **Get instant estimates** — our AI analyses your photos and description to provide accurate cost ranges based on real GTA market data\n\nNo account required to try it!",
          actions: [{ label: '📸 Try the AI Estimator', href: '/#instant-quote', variant: 'primary' }]
        };
      } else if (
        lowerInput.includes('contractors join') ||
        lowerInput.includes('join as a contractor') ||
        lowerInput.includes('become a contractor') ||
        lowerInput.includes('how do contractors') ||
        lowerInput.includes('contractor join') ||
        lowerInput.includes('join quotexbert')
      ) {
        response = {
          role: 'assistant',
          content: "Contractors can join QuoteXbert by:\n\n1. 📝 Creating a contractor account\n2. ✅ Setting up your profile with skills and service area\n3. 💳 Choosing a subscription plan to access leads\n4. 📋 Browsing and bidding on renovation jobs\n\nStart receiving qualified local leads today!",
          actions: [
            { label: '👷 Join as Contractor', href: '/sign-up', variant: 'primary' },
            { label: '💳 View Plans', href: '/contractor/subscriptions', variant: 'secondary' },
          ]
        };
      } else if (
        lowerInput.includes('quote') ||
        lowerInput.includes('cost') ||
        lowerInput.includes('price')
      ) {
        response = {
          role: 'assistant',
          content: "To get an instant AI-powered quote, simply upload photos of your project and describe what you need. Our AI analyses your photos and gives you accurate cost estimates in seconds!",
          actions: [{ label: '📸 Get Instant Quote Now', href: '/#instant-quote', variant: 'primary' }]
        };
      } else if (
        lowerInput.includes('contractor') ||
        lowerInput.includes('find') ||
        lowerInput.includes('hire')
      ) {
        response = {
          role: 'assistant',
          content: "You can browse our verified contractors by category, location, and ratings. Once you get your AI quote, you can post your project and receive bids from qualified contractors.",
          actions: [
            { label: '👷 Browse Contractors', href: '/contractors', variant: 'primary' },
            { label: '📸 Get Quote First', href: '/#instant-quote', variant: 'secondary' },
          ]
        };
      } else if (
        lowerInput.includes('contract') ||
        lowerInput.includes('proposal')
      ) {
        response = {
          role: 'assistant',
          content: "Generate a professional, legally-formatted contract instantly! Just enter your project details and our AI creates a complete contract you can edit, print, or download.",
          actions: [{ label: '📄 Generate Free Contract', href: '/ai-quote', variant: 'primary' }]
        };
      } else if (
        lowerInput.includes('post') ||
        lowerInput.includes('renovation job') ||
        lowerInput.includes('create a job') ||
        (lowerInput.includes('job') && lowerInput.includes('how')) ||
        lowerInput.includes('work') ||
        lowerInput.includes('lead')
      ) {
        if (userType === 'contractor') {
          response = {
            role: 'assistant',
            content: "Browse available jobs in your categories and service area. You can filter by budget, location, and project type. Make sure you've set up your profile and selected categories!",
            actions: [
              { label: '📋 Browse Jobs', href: '/contractor/jobs', variant: 'primary' },
              { label: '⚙️ Update Categories', href: '/profile?tab=categories', variant: 'secondary' },
            ]
          };
        } else if (!isSignedIn) {
          response = {
            role: 'assistant',
            content: "To post a renovation job, you'll need a free homeowner account. Here's how it works:\n\n1. Create a free account\n2. Describe your project and upload photos\n3. Receive bids from verified contractors in your area\n\nIt's 100% free for homeowners!",
            actions: [
              { label: '🏠 Create Free Account', href: '/sign-up', variant: 'primary' },
              { label: '📸 Get a Quote First', href: '/#instant-quote', variant: 'secondary' },
            ]
          };
        } else {
          response = {
            role: 'assistant',
            content: "To post a renovation job:\n\n1. Head to the Create Lead page\n2. Describe your project in detail\n3. Upload photos for accuracy\n4. Set your budget and timeline\n\nContractors in your area will send you proposals!",
            actions: [{ label: '📋 Post a Job', href: '/create-lead', variant: 'primary' }]
          };
        }
      } else if (
        lowerInput.includes('subscription') ||
        lowerInput.includes('plan') ||
        lowerInput.includes('upgrade') ||
        lowerInput.includes('payment') ||
        lowerInput.includes('billing')
      ) {
        response = {
          role: 'assistant',
          content: userType === 'contractor'
            ? "QuoteXbert offers contractor subscription plans with access to unlimited leads, priority listing, and AI tools. Head to your subscription page to compare plans."
            : "QuoteXbert is completely free for homeowners — no subscription needed. Contractors pay to access leads.",
          actions: userType === 'contractor'
            ? [{ label: '💳 View Plans', href: '/contractor/subscriptions', variant: 'primary' }]
            : [{ label: '📸 Get Free Quote', href: '/#instant-quote', variant: 'primary' }]
        };
      } else if (
        lowerInput.includes('sign up') ||
        lowerInput.includes('register') ||
        lowerInput.includes('account') ||
        lowerInput.includes('login') ||
        lowerInput.includes('sign in')
      ) {
        response = {
          role: 'assistant',
          content: "Creating an account is free and takes under a minute. Sign up as a homeowner to post projects, or as a contractor to start winning jobs.",
          actions: [
            { label: '🏠 Sign Up as Homeowner', href: '/sign-up', variant: 'primary' },
            { label: '👷 Sign Up as Contractor', href: '/sign-up', variant: 'secondary' },
          ]
        };
      } else if (
        lowerInput.includes('contact') ||
        lowerInput.includes('phone') ||
        lowerInput.includes('reach') ||
        lowerInput.includes('problem') ||
        lowerInput.includes('issue') ||
        lowerInput.includes('bug') ||
        lowerInput.includes('error') ||
        lowerInput.includes('help') ||
        lowerInput.includes('support') ||
        lowerInput.includes('not working')
      ) {
        response = {
          role: 'assistant',
          content: "You can reach the QuoteXbert support team directly:\n\n📧 **Email:** quotexbert@gmail.com\n📞 **Phone:** 905-242-9460\n\nFor page issues, try refreshing or switching browsers.",
          actions: [
            { label: '📧 Email Support', href: 'mailto:quotexbert@gmail.com', variant: 'primary' },
            { label: '🔄 Refresh Page', href: '#refresh', variant: 'secondary' },
          ]
        };
      } else {
        response = {
          role: 'assistant',
          content: "I'm your QuoteXbert assistant — I specialise in home renovation quotes, contractor connections, and project pricing in the GTA.\n\nHere's what I can help with:",
          actions: isSignedIn
            ? [
                { label: '📸 Get an Instant Quote', href: '/#instant-quote', variant: 'primary' },
                { label: '👷 Find a Contractor', href: '/contractors', variant: 'secondary' },
                { label: '📋 Browse Jobs', href: '/contractor/jobs', variant: 'secondary' },
              ]
            : [
                { label: '📸 Get an Instant Quote', href: '/#instant-quote', variant: 'primary' },
                { label: '👷 Find a Contractor', href: '/contractors', variant: 'secondary' },
                { label: '📝 Create Free Account', href: '/sign-up', variant: 'secondary' },
              ]
        };
      }

      setMessages(prev => [...prev, response]);
    } catch {
      const fallback: Message = {
        role: 'assistant',
        content: "I'm having trouble answering right now. You can contact QuoteXbert support at quotexbert@gmail.com or 905-242-9460.",
        actions: [{ label: '📧 Email Support', href: 'mailto:quotexbert@gmail.com', variant: 'primary' }]
      };
      setMessages(prev => [...prev, fallback]);
    }
  };

  return (
    <>
      {/* Small dismissible helper bubble for discoverability */}
      {showHelperBubble && !isHidden && !isOpen && !mobileMenuOpen && (
        <div
          className="fixed z-40 flex items-center gap-2 bg-white border border-rose-200 shadow-lg rounded-xl px-3 py-2"
          style={{
            bottom: 'calc(var(--bottom-nav-height, 64px) + env(safe-area-inset-bottom, 0px) + 4rem)',
            right: '1rem',
            maxWidth: '190px',
          }}
        >
          <span className="text-xs text-gray-700 leading-snug">✨ AI can help draft replies
          </span>
          <button
            onClick={() => {
              setShowHelperBubble(false);
              if (typeof window !== 'undefined') {
                localStorage.setItem('aiHelperBubbleDismissed', '1');
              }
            }}
            className="text-gray-300 hover:text-gray-500 flex-shrink-0"
            aria-label="Dismiss helper bubble"
          >
            <X className="w-3 h-3" />
          </button>
          {/* Arrow pointing down toward the button */}
          <span
            className="absolute -bottom-1.5 right-5 w-3 h-3 bg-white border-r border-b border-rose-200 rotate-45"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Floating Button - Hidden near bottom on mobile to avoid CTA overlaps */}
      {!isOpen && !mobileMenuOpen && (
        <button
          ref={buttonRef}
          onClick={() => {
            setIsOpen(true);
            if (messages.length === 0) initializeChat();
          }}
          className={`floating-widget-safe bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-1.5 md:gap-2 group${
            isHidden ? ' widget-hidden' : ''
          }`}
          aria-label="Open AI Assistant"
        >
          <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
          <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-semibold text-xs md:text-sm">
            Need Help?
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="fixed z-50 w-full max-w-sm sm:max-w-md md:max-w-lg lg:w-96 right-0 left-0 sm:left-auto sm:right-4 mx-auto sm:mx-0 bg-white rounded-2xl shadow-2xl border-2 border-rose-200 flex flex-col overflow-hidden"
          style={{
            maxHeight: '80vh',
            bottom: keyboardOffset > 0
              ? `${keyboardOffset + 8}px`
              : 'calc(var(--bottom-nav-height, 64px) + env(safe-area-inset-bottom, 0px) + 0.75rem)',
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-600 to-orange-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">QuoteXbert AI</h3>
                <p className="text-xs text-white/90">Your renovation assistant</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                localStorage.setItem('aiAssistantLastDismissed', Date.now().toString());
              }}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all"
              aria-label="Close assistant"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white" style={{ minHeight: '120px', maxHeight: 'calc(80vh - 160px)' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85vw] sm:max-w-[85%] ${msg.role === 'user' ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white' : 'bg-white border-2 border-gray-200'} rounded-2xl p-3 shadow-md`}>
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  {msg.actions && (
                    <div className="mt-3 space-y-2">
                      {msg.actions.map((action, actionIdx) => (
                        <button
                          key={actionIdx}
                          onClick={() => handleActionClick(action.href, action.label)}
                          className={`w-full text-left px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                            action.variant === 'primary'
                              ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t-2 border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Ask me anything about QuoteXbert..."
                autoComplete="off"
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-rose-600 to-orange-600 text-white p-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal for Contractors */}
      {showTerms && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-gray-900">Contractor Terms & Conditions</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 text-gray-700">
              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">📋 Professional Standards</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Maintain valid business licenses and insurance</li>
                  <li>Respond to leads within 24 hours</li>
                  <li>Provide accurate quotes and timelines</li>
                  <li>Complete work to professional standards</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">⏰ Response Times</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Initial lead response: Within 24 hours</li>
                  <li>Quote submission: Within 48 hours</li>
                  <li>Message responses: Within 12 hours during business days</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">✅ Quality Guarantees</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>All work must meet local building codes</li>
                  <li>Provide written warranties where applicable</li>
                  <li>Use quality materials as specified</li>
                  <li>Clean up job site upon completion</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">⭐ Reviews & Ratings</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Homeowners can leave reviews after project completion</li>
                  <li>Maintain a minimum 4.0 rating to stay active</li>
                  <li>Respond professionally to all feedback</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-gray-900 mb-3">💰 Payment & Fees</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>QuoteXbert charges contractors, not homeowners</li>
                  <li>Lead fees vary by project size and location</li>
                  <li>Subscription plans available for unlimited leads</li>
                  <li>No hidden fees or commissions on completed work</li>
                </ul>
              </section>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setShowTerms(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowTerms(false);
                  if (!isSignedIn) {
                    router.push('/sign-up?role=contractor');
                  }
                }}
                className="flex-1 bg-gradient-to-r from-rose-600 to-orange-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                {isSignedIn ? 'I Understand' : 'Sign Up as Contractor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
