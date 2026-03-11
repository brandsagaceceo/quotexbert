"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Code } from "lucide-react";

export default function EmbedEstimatePage() {
  const [copied, setCopied] = useState(false);
  const [previewSize, setPreviewSize] = useState<"small" | "medium" | "large">("medium");

  const embedCode = `<iframe 
  src="https://quotexbert.com/embed-estimate"
  width="${previewSize === 'small' ? '350' : previewSize === 'medium' ? '450' : '600'}"
  height="${previewSize === 'small' ? '500' : previewSize === 'medium' ? '650' : '800'}"
  frameborder="0"
  style="border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
  title="QuoteXbert Renovation Estimator"
></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black">
                <span className="bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                  QuoteXbert
                </span>
                <span className="text-slate-900"> Embed Tool</span>
              </h1>
              <p className="text-slate-600 mt-1">Add AI renovation estimates to your website</p>
            </div>
            <a
              href="/"
              className="text-sm font-semibold text-slate-600 hover:text-orange-600 transition flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              Visit QuoteXbert
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Configuration */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Code className="w-6 h-6 text-rose-600" />
                Embed Configuration
              </h2>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Widget Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setPreviewSize(size)}
                      className={`py-3 px-4 rounded-lg font-semibold text-sm transition ${
                        previewSize === size
                          ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {previewSize === 'small' && '350px × 500px - Sidebar widget'}
                  {previewSize === 'medium' && '450px × 650px - Recommended'}
                  {previewSize === 'large' && '600px × 800px - Full featured'}
                </div>
              </div>

              {/* Embed Code */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">
                  Embed Code
                </label>
                <div className="relative">
                  <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                    {embedCode}
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">How to Use:</h3>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Copy the embed code above</li>
                  <li>Paste it into your website's HTML</li>
                  <li>The widget will appear automatically</li>
                  <li>Track referrals in your QuoteXbert dashboard</li>
                </ol>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-8 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Why Embed QuoteXbert?</h3>
              <ul className="space-y-3">
                {[
                  { icon: '🚀', text: 'Increase engagement with interactive content' },
                  { icon: '💰', text: 'Earn referral rewards for leads generated' },
                  { icon: '⚡', text: 'No maintenance - always up to date' },
                  { icon: '📱', text: 'Fully responsive on all devices' },
                  { icon: '🎨', text: 'Matches your site design automatically' },
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-slate-700 mt-1">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-4">
                <strong>Need help with integration?</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:9052429460"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold py-3 px-5 rounded-lg hover:opacity-90 transition text-sm"
                >
                  📞 905-242-9460
                </a>
                <a
                  href="mailto:quotexbert@gmail.com"
                  className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-semibold py-3 px-5 rounded-lg hover:bg-slate-200 transition text-sm"
                >
                  Email Support
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 sticky top-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Live Preview</h2>
              <p className="text-sm text-slate-600 mb-6">
                This is how the widget will appear on your website
              </p>
              
              {/* Preview Container */}
              <div className="bg-slate-100 rounded-xl p-6 flex items-center justify-center min-h-[600px]">
                <div
                  className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    width: previewSize === 'small' ? '350px' : previewSize === 'medium' ? '450px' : '600px',
                    height: previewSize === 'small' ? '500px' : previewSize === 'medium' ? '650px' : '800px',
                  }}
                >
                  {/* Embedded Estimator Preview */}
                  <div className="h-full flex flex-col bg-gradient-to-br from-rose-50 to-orange-50">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-rose-600 to-orange-600 text-white p-6">
                      <h3 className="text-2xl font-black mb-2">QuoteXbert</h3>
                      <p className="text-sm opacity-90">AI Renovation Estimates</p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      <h4 className="font-bold text-slate-900 mb-4">Get Your Instant Estimate</h4>
                      
                      {/* Mock Form Fields */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Renovation Type
                          </label>
                          <div className="bg-white border-2 border-slate-200 rounded-lg p-3 text-sm text-slate-600">
                            Select renovation type...
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Property Type
                          </label>
                          <div className="bg-white border-2 border-slate-200 rounded-lg p-3 text-sm text-slate-600">
                            House, Condo, etc.
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            City
                          </label>
                          <div className="bg-white border-2 border-slate-200 rounded-lg p-3 text-sm text-slate-600">
                            Toronto, ON
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Project Details
                          </label>
                          <div className="bg-white border-2 border-slate-200 rounded-lg p-3 text-sm text-slate-600 h-20">
                            Describe your project...
                          </div>
                        </div>

                        <button className="w-full bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition">
                          Get Free Estimate →
                        </button>

                        <div className="text-xs text-center text-slate-500 pt-2">
                          Powered by QuoteXbert • Takes 2 minutes
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500 text-center">
                Actual widget is fully functional and responsive
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
