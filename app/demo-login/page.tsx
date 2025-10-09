"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DEMO_USERS = [
  {
    id: "demo-homeowner",
    email: "homeowner@demo.com",
    role: "homeowner" as const,
    name: "Demo Homeowner",
    description: "Test creating leads, messaging contractors, reviewing work"
  },
  {
    id: "demo-contractor", 
    email: "contractor@demo.com",
    role: "contractor" as const,
    name: "Demo Contractor",
    description: "Test claiming leads, portfolio management, messaging"
  },
  {
    id: "demo-admin",
    email: "admin@demo.com", 
    role: "homeowner" as const, // Use homeowner for now since admin isn't in the type
    name: "Demo Admin",
    description: "Test admin features, analytics, user management"
  }
];

export default function DemoLoginPage() {
  const router = useRouter();
  const [isLogging, setIsLogging] = useState(false);

  const loginAsDemo = async (user: typeof DEMO_USERS[0]) => {
    setIsLogging(true);
    
    try {
      // Store demo user in localStorage using the same format as the existing auth system
      localStorage.setItem('demo_user', JSON.stringify(user));
      
      // Redirect based on role
      if (user.role === 'homeowner') {
        router.push('/create-lead');
      } else if (user.role === 'contractor') {
        router.push('/contractor/jobs');
      } else {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-900 to-teal-700 bg-clip-text text-transparent mb-4">
            QuoteXbert Demo
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Test all features with pre-configured demo accounts
          </p>
          <p className="text-sm text-slate-500">
            No registration required • Full feature access • Reset anytime
          </p>
        </div>

        {/* Demo Users Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {DEMO_USERS.map((user) => (
            <div key={user.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-teal-100">
              <div className="text-center mb-4">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl
                  ${user.role === 'homeowner' ? 'bg-blue-100' : 
                    user.role === 'contractor' ? 'bg-green-100' : 'bg-purple-100'}
                `}>
                  {user.role === 'homeowner' ? '🏠' : 
                   user.role === 'contractor' ? '🔧' : '👑'}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                  ${user.role === 'homeowner' ? 'bg-blue-100 text-blue-800' : 
                    user.role === 'contractor' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}
                `}>
                  {user.role.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 text-center">
                {user.description}
              </p>
              
              <button
                onClick={() => loginAsDemo(user)}
                disabled={isLogging}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors
                  ${user.role === 'homeowner' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 
                    user.role === 'contractor' ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' : 
                    'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'}
                  text-white disabled:opacity-50
                `}
              >
                {isLogging ? 'Logging in...' : `Login as ${user.role}`}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-teal-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">🚀 Test These Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🏠 Homeowner Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create leads with photo uploads</li>
                <li>• Get AI-powered estimates</li>
                <li>• Message contractors in real-time</li>
                <li>• Review completed work</li>
                <li>• Manage project payments</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🔧 Contractor Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Browse and claim leads</li>
                <li>• Build before/after portfolios</li>
                <li>• Real-time messaging system</li>
                <li>• Stripe payment processing</li>
                <li>• Professional notifications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <Link 
            href="/sign-in" 
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Use Google Authentication Instead
          </Link>
        </div>
      </div>
    </div>
  );
}