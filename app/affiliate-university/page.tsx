"use client";

import React, { useState } from "react";
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  LightBulbIcon,
  CheckCircleIcon,
  PlayCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
  category: string;
}

export default function AffiliateUniversity() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const lessons: Lesson[] = [
    // Finding Contractors Module
    {
      id: "finding-1",
      title: "Where to Find Contractors: Top 10 Sources",
      duration: "8 min",
      category: "Finding Contractors"
    },
    {
      id: "finding-2",
      title: "Networking at Construction Supply Stores",
      duration: "6 min",
      category: "Finding Contractors"
    },
    {
      id: "finding-3",
      title: "Using LinkedIn to Connect with Contractors",
      duration: "10 min",
      category: "Finding Contractors"
    },
    {
      id: "finding-4",
      title: "Facebook Groups: Goldmine for Contractor Leads",
      duration: "7 min",
      category: "Finding Contractors"
    },
    {
      id: "finding-5",
      title: "Local Trade Shows & Networking Events",
      duration: "5 min",
      category: "Finding Contractors"
    },
    
    // Outreach & Communication Module
    {
      id: "outreach-1",
      title: "Crafting Your Perfect Pitch: Email Templates",
      duration: "12 min",
      category: "Outreach & Communication"
    },
    {
      id: "outreach-2",
      title: "Cold Calling Scripts That Convert",
      duration: "15 min",
      category: "Outreach & Communication"
    },
    {
      id: "outreach-3",
      title: "Follow-Up Strategies That Work",
      duration: "8 min",
      category: "Outreach & Communication"
    },
    {
      id: "outreach-4",
      title: "Handling Objections & Questions",
      duration: "10 min",
      category: "Outreach & Communication"
    },
    
    // Platform Knowledge Module
    {
      id: "platform-1",
      title: "How QuoteXbert Works: Complete Overview",
      duration: "15 min",
      category: "Platform Knowledge"
    },
    {
      id: "platform-2",
      title: "Understanding Subscription Tiers",
      duration: "8 min",
      category: "Platform Knowledge"
    },
    {
      id: "platform-3",
      title: "How Contractors Receive Leads",
      duration: "7 min",
      category: "Platform Knowledge"
    },
    {
      id: "platform-4",
      title: "Commission Structure Explained",
      duration: "6 min",
      category: "Platform Knowledge"
    },
    
    // Marketing & Promotion Module
    {
      id: "marketing-1",
      title: "Creating Converting Social Media Posts",
      duration: "10 min",
      category: "Marketing & Promotion"
    },
    {
      id: "marketing-2",
      title: "Using QR Codes Effectively",
      duration: "5 min",
      category: "Marketing & Promotion"
    },
    {
      id: "marketing-3",
      title: "Email Marketing Best Practices",
      duration: "12 min",
      category: "Marketing & Promotion"
    },
    {
      id: "marketing-4",
      title: "Building Your Personal Brand",
      duration: "15 min",
      category: "Marketing & Promotion"
    },
    {
      id: "marketing-5",
      title: "Content Marketing for Affiliates",
      duration: "10 min",
      category: "Marketing & Promotion"
    },
    
    // Advanced Strategies Module
    {
      id: "advanced-1",
      title: "Scaling to $2,000+/Month",
      duration: "20 min",
      category: "Advanced Strategies"
    },
    {
      id: "advanced-2",
      title: "Automating Your Referral Process",
      duration: "12 min",
      category: "Advanced Strategies"
    },
    {
      id: "advanced-3",
      title: "Building Long-Term Partnerships",
      duration: "10 min",
      category: "Advanced Strategies"
    },
    {
      id: "advanced-4",
      title: "Analytics: Tracking What Works",
      duration: "15 min",
      category: "Advanced Strategies"
    }
  ];

  const categories = Array.from(new Set(lessons.map(l => l.category)));

  const toggleLesson = (lessonId: string) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const progressPercent = (completedLessons.length / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg mb-6">
            <AcademicCapIcon className="w-6 h-6" />
            Affiliate University
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-900 via-rose-700 to-orange-600 bg-clip-text text-transparent">
            Master the Art of Affiliate Marketing
          </h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto mb-8">
            Free training to help you find contractors, close deals, and maximize your 20% commission earnings
          </p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700">Your Progress</span>
                <span className="text-sm font-bold text-purple-600">{completedLessons.length}/{lessons.length} lessons</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-rose-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-purple-100">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-3xl font-black text-slate-900 mb-1">{lessons.length}</div>
            <div className="text-sm text-slate-600">Total Lessons</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-rose-100">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-3xl font-black text-slate-900 mb-1">{categories.length}</div>
            <div className="text-sm text-slate-600">Course Modules</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-orange-100">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-3xl font-black text-slate-900 mb-1">2.5hr</div>
            <div className="text-sm text-slate-600">Total Duration</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-green-100">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-black text-slate-900 mb-1">{Math.round(progressPercent)}%</div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>
        </div>

        {/* Quick Start Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8 mb-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-20 h-20 bg-white rounded-2xl flex items-center justify-center">
              <LightBulbIcon className="w-12 h-12 text-purple-600" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">New to Affiliate Marketing?</h2>
              <p className="text-purple-100 text-lg">Start with "Platform Knowledge" to understand how QuoteXbert works, then move to "Finding Contractors" for actionable strategies.</p>
            </div>
            <Link
              href="/affiliate-dashboard"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Course Modules */}
        {categories.map((category, idx) => {
          const categoryLessons = lessons.filter(l => l.category === category);
          const completedCount = categoryLessons.filter(l => completedLessons.includes(l.id)).length;
          
          return (
            <div key={category} className="mb-8">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
                {/* Module Header */}
                <div className="bg-gradient-to-r from-rose-700 to-orange-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-black">
                        {idx + 1}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{category}</h2>
                        <p className="text-rose-100 text-sm">{categoryLessons.length} lessons • {completedCount} completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black">{Math.round((completedCount / categoryLessons.length) * 100)}%</div>
                      <div className="text-xs text-rose-100">Complete</div>
                    </div>
                  </div>
                </div>

                {/* Lessons List */}
                <div className="p-6">
                  <div className="space-y-3">
                    {categoryLessons.map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => toggleLesson(lesson.id)}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                            isCompleted 
                              ? 'bg-green-50 border-green-300' 
                              : 'bg-slate-50 border-slate-200 hover:border-rose-300 hover:bg-rose-50'
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isCompleted ? 'bg-green-600' : 'bg-gradient-to-br from-rose-600 to-orange-600'
                            }`}>
                              {isCompleted ? (
                                <CheckCircleIcon className="w-6 h-6 text-white" />
                              ) : (
                                <PlayCircleIcon className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold ${isCompleted ? 'text-green-900' : 'text-slate-900'}`}>
                                {lesson.title}
                              </h3>
                              <p className={`text-sm ${isCompleted ? 'text-green-700' : 'text-slate-600'}`}>
                                {lesson.duration} • {isCompleted ? 'Completed' : 'Not started'}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-rose-600">
                            {isCompleted ? 'Review' : 'Start'} →
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Resources Section */}
        <div className="bg-gradient-to-br from-white to-rose-50 rounded-2xl shadow-xl p-8 border-2 border-rose-200 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">📦</span>
            Downloadable Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-rose-300 transition-all hover:shadow-md">
              <h3 className="font-bold text-lg text-slate-900 mb-2">📧 Email Templates</h3>
              <p className="text-slate-600 text-sm mb-4">5 proven email scripts for reaching out to contractors</p>
              <button className="text-rose-600 font-semibold text-sm hover:text-rose-700">Download PDF →</button>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-rose-300 transition-all hover:shadow-md">
              <h3 className="font-bold text-lg text-slate-900 mb-2">📱 Social Media Pack</h3>
              <p className="text-slate-600 text-sm mb-4">Instagram stories, posts, and captions ready to use</p>
              <button className="text-rose-600 font-semibold text-sm hover:text-rose-700">Download ZIP →</button>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-rose-300 transition-all hover:shadow-md">
              <h3 className="font-bold text-lg text-slate-900 mb-2">📊 Tracking Spreadsheet</h3>
              <p className="text-slate-600 text-sm mb-4">Excel template to track your outreach and conversions</p>
              <button className="text-rose-600 font-semibold text-sm hover:text-rose-700">Download XLSX →</button>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-rose-300 transition-all hover:shadow-md">
              <h3 className="font-bold text-lg text-slate-900 mb-2">🎨 Flyer Templates</h3>
              <p className="text-slate-600 text-sm mb-4">Print-ready flyers for local promotion</p>
              <button className="text-rose-600 font-semibold text-sm hover:text-rose-700">Download PDF →</button>
            </div>
          </div>
        </div>

        {/* Success Framework */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-slate-200 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
            The 3-Month Success Framework
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Month 1 */}
            <div className="relative">
              <div className="absolute -top-4 left-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                Month 1
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 pt-8 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Foundation</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">1.</span>
                    <span>Complete all Platform Knowledge lessons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">2.</span>
                    <span>Print 100 business cards with QR code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">3.</span>
                    <span>Join 5 contractor Facebook groups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">4.</span>
                    <span>Connect with 20 contractors on LinkedIn</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">5.</span>
                    <span><strong>Goal: 3-5 referrals ($60-$150/mo)</strong></span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Month 2 */}
            <div className="relative">
              <div className="absolute -top-4 left-6 bg-gradient-to-r from-rose-600 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                Month 2
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6 pt-8 border-2 border-rose-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Growth</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 mt-1">1.</span>
                    <span>Complete Outreach & Communication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 mt-1">2.</span>
                    <span>Send 50 personalized emails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 mt-1">3.</span>
                    <span>Attend 2 local trade shows/events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 mt-1">4.</span>
                    <span>Create weekly social media content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 mt-1">5.</span>
                    <span><strong>Goal: 10-15 referrals ($200-$450/mo)</strong></span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Month 3 */}
            <div className="relative">
              <div className="absolute -top-4 left-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                Month 3
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 pt-8 border-2 border-green-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Scale</h3>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">1.</span>
                    <span>Master Advanced Strategies module</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">2.</span>
                    <span>Build automated nurture sequence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">3.</span>
                    <span>Partner with complementary businesses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">4.</span>
                    <span>Optimize based on analytics data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">5.</span>
                    <span><strong>Goal: 25+ referrals ($750-$1,500/mo)</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* All Courses */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">All Training Modules</h2>
          {categories.map((category) => {
            const categoryLessons = lessons.filter(l => l.category === category);
            const completedCount = categoryLessons.filter(l => completedLessons.includes(l.id)).length;
            
            return (
              <div key={category} className="mb-8">
                <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
                  {/* Module Header */}
                  <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{category}</h3>
                        <p className="text-slate-300 text-sm">{categoryLessons.length} lessons</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black">{completedCount}/{categoryLessons.length}</div>
                        <div className="text-xs text-slate-300">Completed</div>
                      </div>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {categoryLessons.map((lesson) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            onClick={() => toggleLesson(lesson.id)}
                            className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                              isCompleted 
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                                : 'bg-white border-slate-200 hover:border-rose-300'
                            }`}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isCompleted ? 'bg-green-600' : 'bg-gradient-to-br from-rose-600 to-orange-600'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircleIcon className="w-7 h-7 text-white" />
                                ) : (
                                  <PlayCircleIcon className="w-7 h-7 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-bold text-lg ${isCompleted ? 'text-green-900 line-through' : 'text-slate-900'}`}>
                                  {lesson.title}
                                </h4>
                                <p className={`text-sm ${isCompleted ? 'text-green-700' : 'text-slate-600'}`}>
                                  {lesson.duration}
                                </p>
                              </div>
                            </div>
                            <div className={`font-bold ${isCompleted ? 'text-green-600' : 'text-rose-600'}`}>
                              {isCompleted ? '✓ Done' : 'Start →'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-rose-700 to-orange-600 text-white rounded-2xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-black mb-4">Ready to Start Earning?</h2>
          <p className="text-xl text-rose-50 mb-8 max-w-2xl mx-auto">
            Apply what you've learned and start referring contractors today. Your first commission is just one referral away!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/affiliate-dashboard"
              className="bg-white text-rose-600 px-8 py-4 rounded-xl font-bold hover:bg-rose-50 transition-all shadow-lg"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/affiliates"
              className="bg-rose-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-rose-900 transition-all border-2 border-white"
            >
              Learn More About Program
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
