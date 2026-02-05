'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Quote {
  id: string;
  title: string;
  description: string;
  totalCost: number;
  status: string;
  createdAt: string;
  job: {
    title: string;
  };
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function QuotesPage() {
  const { authUser, authLoading, isSignedIn } = useAuth();
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [authLoading, isSignedIn, router]);

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!authUser || !isSignedIn) return;
      
      try {
        const response = await fetch('/api/quotes');
        if (response.ok) {
          const data = await response.json();
          setQuotes(data.quotes || []);
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isSignedIn) {
      fetchQuotes();
    }
  }, [authUser, authLoading, isSignedIn]);

  // Show loading state while authentication is loading
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-8">Loading...</h1>
        </div>
      </div>
    );
  }

  // Don't render anything if not signed in (redirect will happen)
  if (!isSignedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-8">My Quotes</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Quotes</h1>
      
      {quotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No quotes found</p>
          <p className="text-gray-400 mt-2">
            Quotes will appear here when contractors send them to you or when you create them for jobs.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {quotes.map((quote) => (
            <div key={quote.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{quote.title}</h3>
                  <p className="text-gray-600">{quote.job.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    ${quote.totalCost.toLocaleString()}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    quote.status === 'SENT' ? 'bg-rose-100 text-rose-900' :
                    quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                    quote.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {quote.status}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{quote.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Created: {new Date(quote.createdAt).toLocaleDateString()}</span>
                <button className="text-rose-700 hover:text-rose-900 font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
