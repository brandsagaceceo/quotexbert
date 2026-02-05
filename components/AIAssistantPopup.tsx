"use client";

import { useState, useEffect } from 'react';
import { X, MessageCircle, Sparkles, Home, Briefcase, Send } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  actions?: { label: string; href: string; variant?: 'primary' | 'secondary' }[];
}

export default function AIAssistantPopup() {
  const { authUser, isSignedIn } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [userType, setUserType] = useState<'homeowner' | 'contractor' | null>(null);
  const [showTerms, setShowTerms] = useState(false);

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

    // Show popup after 3 seconds if hasn't been shown
    const hasSeenPopup = localStorage.getItem('hasSeenAIAssistant');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        initializeChat();
        localStorage.setItem('hasSeenAIAssistant', 'true');
        sessionStorage.setItem('aiAssistantShownThisSession', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, authUser]);

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
              { label: '🎨 AI Visualizer', href: '/visualizer', variant: 'secondary' },
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
        content: "Perfect! As a homeowner, I can help you:\n\n✨ Get instant AI-powered quotes by uploading photos\n🎨 Visualize renovations with AI before you start\n👷 Connect with verified contractors\n💰 100% free - no hidden fees!\n\nReady to get started?",
        actions: [
          { label: '📸 Upload Photos for Quote', href: '/#instant-quote', variant: 'primary' },
          { label: '🎨 Try AI Visualizer', href: '/visualizer', variant: 'secondary' },
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

    // Simple AI response logic
    const lowerInput = inputValue.toLowerCase();
    let response: Message;

    if (lowerInput.includes('quote') || lowerInput.includes('cost') || lowerInput.includes('price')) {
      response = {
        role: 'assistant',
        content: "Great! To get an instant AI-powered quote, simply upload photos of your project and describe what you need. Our AI analyzes your photos and gives you accurate cost estimates in seconds!",
        actions: [{ label: '📸 Get Instant Quote Now', href: '/#instant-quote', variant: 'primary' }]
      };
    } else if (lowerInput.includes('contractor') || lowerInput.includes('find') || lowerInput.includes('hire')) {
      response = {
        role: 'assistant',
        content: "You can browse our verified contractors by category, location, and ratings. Once you get your AI quote, you can post your project and receive bids from qualified contractors.",
        actions: [
          { label: '👷 Browse Contractors', href: '/contractors', variant: 'primary' },
          { label: '📸 Get Quote First', href: '/#instant-quote', variant: 'secondary' },
        ]
      };
    } else if (lowerInput.includes('visualize') || lowerInput.includes('design') || lowerInput.includes('look')) {
      response = {
        role: 'assistant',
        content: "Try our AI Visualizer! Upload a photo of your room and describe your vision. Our AI will show you what it will look like - perfect for planning renovations!",
        actions: [{ label: '🎨 Try AI Visualizer', href: '/visualizer', variant: 'primary' }]
      };
    } else if (lowerInput.includes('job') || lowerInput.includes('work') || lowerInput.includes('lead')) {
      response = {
        role: 'assistant',
        content: userType === 'contractor' 
          ? "Browse available jobs in your categories and service area. You can filter by budget, location, and project type. Make sure you've set up your profile and selected categories!"
          : "To post a job for contractors to bid on, first get an AI quote so you know what's fair. Then post your project details and verified contractors will send you proposals.",
        actions: userType === 'contractor'
          ? [
              { label: '📋 Browse Jobs', href: '/contractor/jobs', variant: 'primary' },
              { label: '⚙️ Update Categories', href: '/profile?tab=categories', variant: 'secondary' },
            ]
          : [{ label: '📸 Get Quote First', href: '/#instant-quote', variant: 'primary' }]
      };
    } else {
      response = {
        role: 'assistant',
        content: "I can help you with:\n\n• Getting instant AI quotes\n• Visualizing renovations\n• Finding contractors\n• Understanding costs\n• Posting jobs\n\nWhat would you like to do?",
        actions: [
          { label: '📸 Get Instant Quote', href: '/#instant-quote', variant: 'primary' },
          { label: '🎨 AI Visualizer', href: '/visualizer', variant: 'secondary' },
        ]
      };
    }

    setMessages(prev => [...prev, response]);
    setInputValue('');
  };

  return (
    <>
      {/* Floating Button - Hidden on keyboard open */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            if (messages.length === 0) initializeChat();
          }}
          className="fixed right-4 z-40 bg-gradient-to-r from-rose-600 to-orange-600 text-white p-3 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2 group"
          style={{
            bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px) + 12px)',
          }}
          aria-label="Open AI Assistant"
        >
          <Sparkles className="h-5 w-5" />
          <MessageCircle className="h-5 w-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-semibold text-sm">
            Need Help?
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border-2 border-rose-200 flex flex-col overflow-hidden"
          style={{
            bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px) + 12px)',
            maxHeight: 'calc(70vh - env(safe-area-inset-bottom, 0px))',
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
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white' : 'bg-white border-2 border-gray-200'} rounded-2xl p-3 shadow-md`}>
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
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
