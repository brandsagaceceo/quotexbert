"use client";

import { useState } from "react";
import Head from "next/head";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <Head>
        <title>Contact QuotexBert Support - Get Help Today</title>
        <meta name="description" content="Contact QuotexBert support for help with estimates, contractor matching, billing, or technical issues. We're here to help homeowners and contractors." />
        <meta property="og:title" content="Contact QuotexBert Support" />
        <meta property="og:description" content="Get help with estimates, contractor matching, billing, or technical issues." />
        <meta property="og:image" content="/og-contact.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-slate-50 to-red-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Get in Touch with <span className="bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent">QuotexBert Support</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Whether you're a homeowner seeking help with estimates or a contractor needing assistance with our platform, our support team is here to help. We typically respond within 2-4 hours during business hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-6">Send us a Message</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-3xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Message Sent!</h3>
                  <p className="text-slate-600">We'll get back to you within 2-4 hours during business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    >
                      <option value="">What can we help you with?</option>
                      <option value="estimate">Help with Estimates</option>
                      <option value="contractor">Contractor Questions</option>
                      <option value="billing">Billing Support</option>
                      <option value="technical">Technical Issues</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Please describe your question or issue in detail"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-800 to-orange-600 hover:from-red-900 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors text-white"
                  >
                    {isSubmitting ? "Sending Message..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-8 mb-8 shadow-lg">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Support Email</h3>
                      <p className="text-slate-600">support@quotexbert.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">🕒</div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Business Hours</h3>
                      <p className="text-slate-600">Monday-Friday, 8 AM - 6 PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">⏱️</div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Response Time</h3>
                      <p className="text-slate-600">2-4 hours during business hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-orange-200 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-red-800 to-orange-600 bg-clip-text text-transparent mb-3">Quick Help</h3>
                <p className="text-slate-600 mb-4">
                  For faster assistance, check out our frequently asked questions or browse our help documentation.
                </p>
                <div className="space-y-2">
                  <a href="/contractor/billing" className="block text-red-700 hover:text-red-800 transition-colors">
                    → Billing & Payment Help
                  </a>
                  <a href="/contractor/jobs" className="block text-orange-700 hover:text-orange-800 transition-colors">
                    → Contractor Job Board Guide
                  </a>
                  <a href="/about" className="block text-red-700 hover:text-red-800 transition-colors">
                    → About QuotexBert
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
