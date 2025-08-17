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

      <div className="min-h-screen bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch with <span className="text-teal-400">QuotexBert Support</span>
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Whether you're a homeowner seeking help with estimates or a contractor needing assistance with our platform, our support team is here to help. We typically respond within 2-4 hours during business hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-teal-400 mb-6">Send us a Message</h2>
              
              {submitted ? (
                <div className="bg-green-900/50 border border-green-500/30 rounded-lg p-6 text-center">
                  <div className="text-3xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">Message Sent!</h3>
                  <p className="text-neutral-300">We'll get back to you within 2-4 hours during business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
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
                      className="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
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
                      className="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-neutral-300 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500"
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
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
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
                      className="w-full bg-neutral-900 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    {isSubmitting ? "Sending Message..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-teal-400 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">📧</div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Support Email</h3>
                      <p className="text-neutral-400">support@quotexbert.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">🕒</div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Business Hours</h3>
                      <p className="text-neutral-400">Monday-Friday, 8 AM - 6 PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">⏱️</div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Response Time</h3>
                      <p className="text-neutral-400">2-4 hours during business hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-900/50 to-emerald-900/50 border border-teal-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-teal-400 mb-3">Quick Help</h3>
                <p className="text-neutral-300 mb-4">
                  For faster assistance, check out our frequently asked questions or browse our help documentation.
                </p>
                <div className="space-y-2">
                  <a href="/contractor/billing" className="block text-teal-400 hover:text-teal-300 transition-colors">
                    → Billing & Payment Help
                  </a>
                  <a href="/contractor/jobs" className="block text-teal-400 hover:text-teal-300 transition-colors">
                    → Contractor Job Board Guide
                  </a>
                  <a href="/about" className="block text-teal-400 hover:text-teal-300 transition-colors">
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
