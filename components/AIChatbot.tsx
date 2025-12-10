"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Minimize2, Maximize2, MessageCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your QuoteXbert assistant. How can I help you today?\n\nI can help you with:\n• How to get quotes\n• Finding contractors\n• Understanding our pricing\n• Navigating the platform\n• Any questions you have!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    // Common questions and responses
    if (lowerQuery.includes("quote") || lowerQuery.includes("estimate")) {
      return "Great question! To get a quote:\n\n1. 📸 Upload a photo of your project\n2. 🎤 Describe what you need (you can use voice!)\n3. ✨ Our AI generates an instant estimate\n4. 📋 Post it to connect with verified contractors\n\nWant me to guide you through the process?";
    }
    
    if (lowerQuery.includes("contractor") || lowerQuery.includes("find")) {
      return "Finding the right contractor is easy!\n\n• All contractors are background-checked ✓\n• See verified reviews and ratings ⭐\n• View their portfolio of past work\n• Get competitive quotes from multiple pros\n\nJust post your project and qualified contractors will reach out!";
    }
    
    if (lowerQuery.includes("price") || lowerQuery.includes("cost") || lowerQuery.includes("pay")) {
      return "💰 Our pricing is simple:\n\n**For Homeowners:**\n• 100% FREE to post projects\n• FREE to get quotes\n• Only pay contractors directly\n\n**For Contractors:**\n• Starter: $99/mo (5 leads)\n• Handyman: $149/mo (10 leads)\n• Renovation Expert: $199/mo (20 leads)\n\nNo hidden fees, cancel anytime!";
    }
    
    if (lowerQuery.includes("how") || lowerQuery.includes("work")) {
      return "Here's how QuoteXbert works:\n\n1️⃣ **Post Your Project** - Upload photos, describe what you need\n2️⃣ **Get AI Estimate** - Instant cost estimate powered by AI\n3️⃣ **Receive Quotes** - Verified contractors send proposals\n4️⃣ **Choose & Connect** - Pick the best fit and start your project\n5️⃣ **Secure Payment** - Pay through our platform when satisfied\n\nIt's that simple!";
    }
    
    if (lowerQuery.includes("safe") || lowerQuery.includes("secure") || lowerQuery.includes("trust")) {
      return "Your safety is our priority! 🔒\n\n✓ All contractors are background-checked\n✓ Stripe-secured payments\n✓ Verified reviews and ratings\n✓ 24/7 customer support\n✓ Dispute resolution process\n\nYour money is protected until you're satisfied with the work!";
    }

    if (lowerQuery.includes("ai") || lowerQuery.includes("photo") || lowerQuery.includes("visualization")) {
      return "Our AI features are amazing! 🤖\n\n• **Photo Analysis** - Upload pics and AI estimates the cost\n• **Voice Input** - Just speak your project details\n• **AI Visualization** - See what your project will look like!\n• **Smart Matching** - AI connects you with the best contractors\n\nTry uploading a photo on the homepage to see it in action!";
    }

    if (lowerQuery.includes("thank") || lowerQuery.includes("thanks")) {
      return "You're very welcome! 😊 Is there anything else I can help you with?\n\nFeel free to ask about quotes, contractors, pricing, or anything else!";
    }

    if (lowerQuery.includes("hello") || lowerQuery.includes("hi")) {
      return "Hello! 👋 Welcome to QuoteXbert!\n\nI'm here to help you get your home projects done. What can I assist you with today?";
    }

    // Default response
    return "I'd be happy to help! I can assist you with:\n\n• Getting instant quotes\n• Finding contractors\n• Understanding our services\n• Navigating the platform\n• Pricing information\n\nWhat specific question do you have?";
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-orange-600 rounded-full opacity-20 blur-md"></div>
          
          {/* Main button */}
          <div className="relative bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-full p-4 shadow-2xl hover:shadow-rose-500/50 transform hover:scale-110 transition-all duration-300">
            <MessageCircle className="w-7 h-7" />
          </div>

          {/* Badge */}
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
            AI
          </div>
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap shadow-xl">
            Need help? Chat with AI! 💬
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80' : 'w-96'
    }`}>
      <div className={`bg-white rounded-2xl shadow-2xl border-2 border-rose-200 overflow-hidden transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[600px]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-orange-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&q=80"
                alt="AI Assistant"
                className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg">QuoteXbert AI</h3>
              <p className="text-xs text-white/90">Online • Ready to help!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? (
                <Maximize2 className="w-5 h-5" />
              ) : (
                <Minimize2 className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-[450px] overflow-y-auto overflow-x-hidden p-4 bg-gradient-to-b from-slate-50 to-white">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-rose-600 to-orange-600 text-white"
                        : "bg-white border-2 border-slate-200 text-slate-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === "user" ? "text-white/70" : "text-slate-400"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border-2 border-slate-200 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t-2 border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-rose-600 to-orange-600 text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Powered by AI • Available 24/7
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
