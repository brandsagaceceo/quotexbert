// NEW COMPONENT: Explains quote pricing in plain English using AI
// Usage: Import and add <ExplainQuoteModal /> where estimates are displayed
"use client";

import { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface ExplainQuoteModalProps {
  estimate: {
    description: string;
    minCost: number;
    maxCost: number;
    items?: Array<{
      category: string;
      description: string;
      minCost: number;
      maxCost: number;
    }>;
  };
}

export default function ExplainQuoteModal({ estimate }: ExplainQuoteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  const fetchExplanation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/explain-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: estimate.description,
          minCost: estimate.minCost,
          maxCost: estimate.maxCost,
          items: estimate.items || []
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setExplanation(data.explanation);
      }
    } catch (error) {
      console.error('Failed to fetch explanation:', error);
      setExplanation('Unable to generate explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!explanation) {
      fetchExplanation();
    }
  };

  return (
    <>
      {/* Trigger Link - Plain text, no styling changes */}
      <button
        onClick={handleOpen}
        className="text-sm text-gray-600 hover:text-rose-700 underline-offset-2 hover:underline"
      >
        Explain my quote
      </button>

      {/* Modal - Only shown when opened */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-600" />
                <h2 className="text-xl font-semibold text-gray-900">Quote Explanation</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
                  <span className="ml-3 text-gray-600">Analyzing your quote...</span>
                </div>
              ) : explanation ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {explanation}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
