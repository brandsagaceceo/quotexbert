"use client";

import { Phone } from "lucide-react";
import { useState } from "react";

export function MobileSupportButton() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <a
        href="tel:9052429460"
        className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white px-4 py-3 rounded-full shadow-2xl hover:from-rose-700 hover:to-orange-700 transition-all animate-bounce"
      >
        <Phone className="w-5 h-5" />
        <span className="font-bold text-sm">Call Support</span>
      </a>
      
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-900"
      >
        ×
      </button>
    </div>
  );
}

export function SupportWidget() {
  return (
    <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-lg p-6 border-2 border-rose-200">
      <h3 className="text-lg font-bold text-gray-900 mb-3">Need Help?</h3>
      <p className="text-gray-700 mb-4">
        Our support team is here to assist you with any questions.
      </p>
      <div className="space-y-3">
        <a
          href="tel:9052429460"
          className="flex items-center gap-3 text-gray-900 hover:text-rose-600 transition-colors"
        >
          <Phone className="w-5 h-5 text-rose-600" />
          <div>
            <div className="font-bold">Call QuoteXbert Support</div>
            <div className="text-sm text-gray-600">📞 905-242-9460</div>
          </div>
        </a>
        <a
          href="mailto:quotexbert@gmail.com"
          className="flex items-center gap-3 text-gray-900 hover:text-rose-600 transition-colors"
        >
          <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <div className="font-bold">Email Us</div>
            <div className="text-sm text-gray-600">QuoteXbert@gmail.com</div>
          </div>
        </a>
      </div>
      <div className="mt-4 pt-4 border-t border-rose-200">
        <p className="text-xs text-gray-600">
          <strong>Support Hours:</strong><br />
          Monday – Friday<br />
          9 AM – 6 PM EST
        </p>
      </div>
    </div>
  );
}
