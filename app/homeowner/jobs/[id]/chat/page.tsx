'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy chat page — redirects to /messages?leadId=<jobId>.
 * This page previously used mock data and a non-functional chat endpoint.
 * All real messaging now goes through Thread/Message on /messages.
 */
export default function JobChatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => { params.then(setResolvedParams); }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      router.replace(`/messages?leadId=${resolvedParams.id}`);
    }
  }, [resolvedParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to messages...</p>
      </div>
    </div>
  );
}
