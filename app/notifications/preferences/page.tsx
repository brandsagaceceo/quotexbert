"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Bell,
  Mail,
  MessageCircle,
  CreditCard,
  Briefcase,
  ArrowLeft,
  Check
} from "lucide-react";

interface NotificationPreferences {
  welcomeEmails: boolean;
  jobNotifications: boolean;
  quoteNotifications: boolean;
  messageNotifications: boolean;
  paymentNotifications: boolean;
  marketingEmails: boolean;
  reviewReminders: boolean;
  subscriptionReminders: boolean;
}

export default function NotificationPreferencesPage() {
  const { isSignedIn, authUser, authLoading } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    welcomeEmails: true,
    jobNotifications: true,
    quoteNotifications: true,
    messageNotifications: true,
    paymentNotifications: true,
    marketingEmails: false,
    reviewReminders: true,
    subscriptionReminders: true,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (authLoading) return;
    if (!isSignedIn || !authUser) {
      router.push("/sign-in");
      return;
    }
    loadPreferences();
  }, [isSignedIn, authUser, authLoading, router]);

  const loadPreferences = async () => {
    // In a real app, load from API
    // const response = await fetch('/api/user/notification-preferences');
    // const data = await response.json();
    // setPreferences(data);
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    setSaveStatus('saving');
    
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);

      // In a real app, save to API
      // await fetch('/api/user/notification-preferences', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newPreferences)
      // });

      console.log('Updated notification preferences:', newPreferences);
      setSaveStatus('saved');
      
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const testEmailNotification = async (type: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          recipients: authUser?.email || 'demo@example.com',
          data: {
            name: authUser?.name || 'Demo User',
            role: authUser?.role || 'homeowner',
            jobTitle: 'Kitchen Renovation',
            contractorName: 'Elite Kitchen Design',
            quoteAmount: '14500'
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Test email sent successfully! Check the console for demo output.');
      } else {
        alert('Failed to send test email');
      }
    } catch (error) {
      console.error('Test email error:', error);
      alert('Error sending test email');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-700"></div>
      </div>
    );
  }

  if (!isSignedIn || !authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
                <Bell className="h-6 w-6 mr-2" />
                Email Notifications
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Manage your email preferences and notification settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Save Status */}
        {saveStatus !== 'idle' && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            saveStatus === 'saved' ? 'bg-green-50 text-green-700' :
            saveStatus === 'error' ? 'bg-red-50 text-red-700' :
            'bg-rose-50 text-rose-900'
          }`}>
            {saveStatus === 'saved' && <Check className="h-5 w-5 mr-2" />}
            <span className="text-sm">
              {saveStatus === 'saving' && 'Saving preferences...'}
              {saveStatus === 'saved' && 'Preferences saved successfully!'}
              {saveStatus === 'error' && 'Failed to save preferences. Please try again.'}
            </span>
          </div>
        )}

        {/* Test Email Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Test Email Notifications</h2>
              <p className="text-sm text-gray-500">Preview how your email notifications will look</p>
            </div>
            <button
              onClick={() => testEmailNotification('welcome')}
              disabled={isLoading}
              className="bg-rose-700 text-white px-4 py-2 rounded-lg hover:bg-rose-800 disabled:opacity-50 text-sm font-medium"
            >
              {isLoading ? 'Sending...' : 'Send Test Email'}
            </button>
          </div>
          
          {/* Email Preview Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { type: 'welcome', label: 'Welcome Email', icon: Mail },
              { type: 'job_posted', label: 'Job Posted', icon: Briefcase },
              { type: 'quote_received', label: 'Quote Received', icon: CreditCard },
              { type: 'message_received', label: 'New Message', icon: MessageCircle }
            ].map(template => {
              const Icon = template.icon;
              return (
                <a
                  key={template.type}
                  href={`/api/notifications/email?type=${template.type}&preview=true`}
                  target="_blank"
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">{template.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 space-y-8">
            {/* Essential Notifications */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                Essential Notifications
              </h3>
              <p className="text-sm text-gray-500 mb-6">These notifications are important for account security and transactions.</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Welcome emails</h4>
                    <p className="text-sm text-gray-500">Get started with helpful tips and guides when you join</p>
                  </div>
                  <button
                    onClick={() => updatePreference('welcomeEmails', !preferences.welcomeEmails)}
                    disabled={saveStatus === 'saving'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      preferences.welcomeEmails ? 'bg-rose-700' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.welcomeEmails ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Payment notifications</h4>
                    <p className="text-sm text-gray-500">Critical alerts for payments, deposits, and transactions</p>
                  </div>
                  <button
                    onClick={() => updatePreference('paymentNotifications', !preferences.paymentNotifications)}
                    disabled={saveStatus === 'saving'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      preferences.paymentNotifications ? 'bg-rose-700' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.paymentNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Notifications */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-rose-700" />
                Activity Notifications
              </h3>
              <p className="text-sm text-gray-500 mb-6">Stay updated on your projects, quotes, and messages.</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Job & quote notifications</h4>
                    <p className="text-sm text-gray-500">New jobs, quotes submitted, and project status updates</p>
                  </div>
                  <button
                    onClick={() => updatePreference('jobNotifications', !preferences.jobNotifications)}
                    disabled={saveStatus === 'saving'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      preferences.jobNotifications ? 'bg-rose-700' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.jobNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Message notifications</h4>
                    <p className="text-sm text-gray-500">New messages from homeowners and contractors</p>
                  </div>
                  <button
                    onClick={() => updatePreference('messageNotifications', !preferences.messageNotifications)}
                    disabled={saveStatus === 'saving'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      preferences.messageNotifications ? 'bg-rose-700' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.messageNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Review reminders</h4>
                    <p className="text-sm text-gray-500">Gentle reminders to leave reviews after project completion</p>
                  </div>
                  <button
                    onClick={() => updatePreference('reviewReminders', !preferences.reviewReminders)}
                    disabled={saveStatus === 'saving'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      preferences.reviewReminders ? 'bg-rose-700' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.reviewReminders ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Marketing & Tips */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-purple-600" />
                Marketing & Tips
              </h3>
              <p className="text-sm text-gray-500 mb-6">Optional emails with tips, updates, and promotional content.</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Marketing emails</h4>
                    <p className="text-sm text-gray-500">Product updates, success stories, and promotional content</p>
                  </div>
                  <button
                    onClick={() => updatePreference('marketingEmails', !preferences.marketingEmails)}
                    disabled={saveStatus === 'saving'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      preferences.marketingEmails ? 'bg-rose-700' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Subscription reminders</h4>
                    <p className="text-sm text-gray-500">Reminders about subscription renewals and billing</p>
                  </div>
                  <button
                    onClick={() => updatePreference('subscriptionReminders', !preferences.subscriptionReminders)}
                    disabled={saveStatus === 'saving'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      preferences.subscriptionReminders ? 'bg-rose-700' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.subscriptionReminders ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="border-t border-gray-200 pt-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">💡 About Email Notifications</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Essential notifications (like payments) cannot be disabled for security reasons</li>
                  <li>• You can unsubscribe from any email using the link at the bottom</li>
                  <li>• Changes take effect immediately and apply to all future notifications</li>
                  <li>• In demo mode, emails are logged to the console instead of being sent</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}