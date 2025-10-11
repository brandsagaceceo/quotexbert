'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Send, User, Clock, DollarSign } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  isHomeowner: boolean;
}

interface Job {
  id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  zipCode: string;
  status: string;
  acceptedById: string;
  contractor?: {
    id: string;
    name: string;
    email: string;
    contractorProfile?: {
      companyName: string;
      trade: string;
    };
  };
}

export default function JobChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (user && resolvedParams) {
      fetchJob();
      fetchMessages();
    }
  }, [user, resolvedParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchJob = async () => {
    if (!user || !resolvedParams) return;
    
    try {
      const response = await fetch(`/api/homeowner/jobs/${resolvedParams.id}?homeownerId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!user || !resolvedParams) return;
    
    try {
      const response = await fetch(`/api/jobs/${resolvedParams.id}/chat?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !job || sending) return;

    setSending(true);
    try {
      const response = await fetch(`/api/jobs/${job.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          senderId: user.id,
          senderName: user.name,
          jobId: job.id
        }),
      });

      if (response.ok) {
        setNewMessage('');
        await fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <Link href="/homeowner/jobs">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (job.status !== 'assigned' || !job.contractor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Contractor Assigned</h1>
          <p className="text-gray-600 mb-4">You need to select a contractor before you can start chatting.</p>
          <Link href={`/homeowner/jobs/${job.id}/applications`}>
            <Button>Review Applications</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/homeowner/jobs">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Job Info Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">{job.title}</h3>
              <Badge variant="success">Assigned</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contractor</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{job.contractor.contractorProfile?.companyName || job.contractor.name}</p>
                      <p className="text-xs text-gray-600">{job.contractor.contractorProfile?.trade}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>Budget: ${job.budget}</span>
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {job.category}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {job.zipCode}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                  <p className="text-sm text-gray-600">{job.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="flex flex-col h-[600px]">
            <CardHeader>
              <h2 className="text-xl font-bold">
                Chat with {job.contractor.contractorProfile?.companyName || job.contractor.name}
              </h2>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isHomeowner ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isHomeowner 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-900 border'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs ${message.isHomeowner ? 'text-blue-100' : 'text-gray-500'}`}>
                            {message.senderName}
                          </span>
                          <span className={`text-xs ${message.isHomeowner ? 'text-blue-100' : 'text-gray-500'}`}>
                            <Clock className="w-3 h-3 inline mr-1" />
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input */}
              <form onSubmit={sendMessage} className="mt-4 flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={sending}
                />
                <Button type="submit" disabled={!newMessage.trim() || sending}>
                  {sending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}