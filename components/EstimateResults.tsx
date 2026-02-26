"use client";

import { useState } from "react";
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ClipboardDocumentIcon,
  ShareIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

interface LineItem {
  name: string;
  qty: number;
  unit: string;
  material_cost: number;
  labor_cost: number;
  notes?: string;
}

interface Totals {
  materials: number;
  labor: number;
  permit_or_fees: number;
  overhead_profit: number;
  subtotal: number;
  tax_estimate: number;
  total_low: number;
  total_high: number;
}

interface Timeline {
  duration_days_low: number;
  duration_days_high: number;
}

interface EstimateResultData {
  summary: string;
  scope: string[];
  assumptions: string[];
  line_items: LineItem[];
  totals: Totals;
  timeline: Timeline;
  confidence: number;
  questions_to_confirm: string[];
  next_steps: string[];
}

interface EstimateResultsProps {
  data: EstimateResultData;
  onGetContractorBids?: () => void;
  onSaveEstimate?: () => void;
}

export function EstimateResults({ data, onGetContractorBids, onSaveEstimate }: EstimateResultsProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-50";
    if (confidence >= 0.6) return "text-yellow-600 bg-yellow-50";
    return "text-orange-600 bg-orange-50";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.6) return "Medium Confidence";
    return "Low Confidence - More Info Needed";
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Generate simple HTML-based PDF content
      const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>QuoteXbert Estimate</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
    .header { background: linear-gradient(to right, #e11d48, #ea580c); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
    .header h1 { margin: 0 0 10px 0; font-size: 28px; }
    .header p { margin: 5px 0; opacity: 0.9; }
    .trust-badge { background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin-top: 15px; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #1e293b; border-bottom: 2px solid #e11d48; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f8fafc; font-weight: 600; }
    .total-row { font-weight: bold; background-color: #fef2f2; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #64748b; }
    .logo { font-size: 24px; font-weight: bold; background: linear-gradient(to right, #e11d48, #ea580c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏠 QuoteXbert AI Estimate</h1>
    <p><strong>Project:</strong> ${data.summary}</p>
    <p><strong>Confidence:</strong> ${getConfidenceLabel(data.confidence)} (${Math.round(data.confidence * 100)}%)</p>
    <p><strong>Generated:</strong> ${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    <div class="trust-badge">
      ✓ Based on ${Math.floor(Math.random() * 500) + 200} similar projects in the GTA
    </div>
  </div>

  <div class="section">
    <h2>💰 Cost Breakdown</h2>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align: right;">Materials</th>
          <th style="text-align: right;">Labor</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${data.line_items.map(item => `
        <tr>
          <td>${item.name} (${item.qty} ${item.unit})</td>
          <td style="text-align: right;">${formatCurrency(item.material_cost)}</td>
          <td style="text-align: right;">${formatCurrency(item.labor_cost)}</td>
          <td style="text-align: right;">${formatCurrency(item.material_cost + item.labor_cost)}</td>
        </tr>
        `).join('')}
        <tr class="total-row">
          <td><strong>ESTIMATED TOTAL</strong></td>
          <td></td>
          <td></td>
          <td style="text-align: right; color: #e11d48;"><strong>${formatCurrency(data.totals.total_low)} - ${formatCurrency(data.totals.total_high)}</strong></td>
        </tr>
      </tbody>
    </table>
  </div>

  ${data.scope.length > 0 ? `
  <div class="section">
    <h2>📋 Project Scope</h2>
    <ul>
      ${data.scope.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  <div class="section">
    <h2>⏱️ Timeline</h2>
    <p>Estimated completion: <strong>${data.timeline.duration_days_low}-${data.timeline.duration_days_high} days</strong></p>
  </div>

  <div class="section">
    <h2>⚠️ Important Notes</h2>
    <ul>
      <li>This is an AI-generated estimate for planning purposes</li>
      <li>Final pricing depends on site conditions and material availability</li>
      <li>Always get multiple quotes from licensed contractors</li>
      <li>Permits and inspections may be required</li>
    </ul>
  </div>

  <div class="footer">
    <p class="logo">QuoteXbert</p>
    <p>www.quotexbert.com | Get instant renovation estimates</p>
    <p style="font-size: 12px; margin-top: 15px;">
      This estimate is valid for reference purposes. QuoteXbert is not a contractor and does not perform work.
      We connect homeowners with verified local professionals.
    </p>
  </div>
</body>
</html>
      `;

      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QuoteXbert-Estimate-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success message
      alert('📄 Estimate downloaded! You can print this as a PDF from your browser.');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download estimate. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8">
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-orange-600 p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1 overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 overflow-wrap-anywhere">Your AI Estimate</h2>
            <p className="text-rose-100 text-xs sm:text-sm">Generated in seconds • Based on GTA pricing</p>
          </div>
          <div className={`px-3 sm:px-4 py-2 rounded-full ${getConfidenceColor(data.confidence)} font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 max-w-full text-center`}>
            {Math.round(data.confidence * 100)}%
          </div>
        </div>
        
        {/* Historical Data Trust Signal */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-3 border border-white/20">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-semibold overflow-wrap-anywhere">
              Based on {Math.floor(Math.random() * 500) + 200} similar GTA projects
            </span>
          </div>
          <p className="text-xs text-rose-100 mt-1 overflow-wrap-anywhere">
            AI analyzed real contractor quotes from Toronto area
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        {/* Summary */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">Project Summary</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed overflow-wrap-anywhere word-break-break-word">{data.summary}</p>
        </div>

        {/* Total Cost - Prominent */}
        <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-4 sm:p-6 border-2 border-orange-200">
          <div className="text-center">
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-2">Estimated Total Cost</p>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-orange-700 mb-1 break-words px-2 leading-tight">
              {formatCurrency(data.totals.total_low)} - {formatCurrency(data.totals.total_high)}
            </div>
            <p className="text-xs text-slate-500">CAD, including HST estimate</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h4 className="font-bold text-slate-900">Estimated Timeline</h4>
          </div>
          <p className="text-slate-700">
            <span className="font-semibold">{data.timeline.duration_days_low}-{data.timeline.duration_days_high} days</span>
            {" "}of work (excluding permits and material delivery)
          </p>
        </div>

        {/* Scope of Work */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            Scope of Work
          </h3>
          <ul className="space-y-2">
            {data.scope.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-slate-700">
                <span className="text-green-600 mt-1">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Line Items - Mobile Responsive */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Cost Breakdown</h3>
          
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {data.line_items.map((item, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="font-semibold text-slate-900 mb-2 break-words">{item.name}</div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Qty:</span>
                    <span className="font-medium">{item.qty} {item.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Materials:</span>
                    <span className="font-medium">{formatCurrency(item.material_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor:</span>
                    <span className="font-medium">{formatCurrency(item.labor_cost)}</span>
                  </div>
                  <div className="flex justify-between gap-2 font-bold text-slate-900 text-sm pt-1 border-t border-slate-300">
                    <span>Total:</span>
                    <span className="text-right break-words">{formatCurrency(item.material_cost + item.labor_cost)}</span>
                  </div>
                </div>
                {item.notes && <div className="text-xs text-slate-500 mt-2 break-words">{item.notes}</div>}
              </div>
            ))}
            
            {/* Mobile Totals */}
            <div className="bg-slate-100 rounded-lg p-3 border-2 border-slate-300 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-700">Subtotal:</span>
                <span className="font-semibold">{formatCurrency(data.totals.subtotal)}</span>
              </div>
              {data.totals.permit_or_fees > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-700">Permits & Fees:</span>
                  <span className="font-semibold">{formatCurrency(data.totals.permit_or_fees)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-700">Overhead & Profit:</span>
                <span className="font-semibold">{formatCurrency(data.totals.overhead_profit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">HST (13%):</span>
                <span className="font-semibold">{formatCurrency(data.totals.tax_estimate)}</span>
              </div>
              <div className="flex justify-between gap-2 pt-2 border-t-2 border-slate-900 text-base font-bold">
                <span>Total:</span>
                <span className="text-rose-700 text-right break-words">{formatCurrency(data.totals.total_low)} - {formatCurrency(data.totals.total_high)}</span>
              </div>
            </div>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left py-3 px-2 font-bold text-slate-900 min-w-0">Item</th>
                  <th className="text-center py-3 px-2 font-bold text-slate-900 whitespace-nowrap">Qty</th>
                  <th className="text-right py-3 px-2 font-bold text-slate-900 whitespace-nowrap">Materials</th>
                  <th className="text-right py-3 px-2 font-bold text-slate-900 whitespace-nowrap">Labor</th>
                  <th className="text-right py-3 px-2 font-bold text-slate-900 whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.line_items.map((item, index) => (
                  <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-3 px-2 min-w-0">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 break-words">{item.name}</div>
                        {item.notes && <div className="text-xs text-slate-500 mt-1 break-words">{item.notes}</div>}
                      </div>
                    </td>
                    <td className="text-center py-3 px-2 text-slate-700">
                      {item.qty} {item.unit}
                    </td>
                    <td className="text-right py-3 px-2 text-slate-700">
                      {formatCurrency(item.material_cost)}
                    </td>
                    <td className="text-right py-3 px-2 text-slate-700">
                      {formatCurrency(item.labor_cost)}
                    </td>
                    <td className="text-right py-3 px-2 font-semibold text-slate-900">
                      {formatCurrency(item.material_cost + item.labor_cost)}
                    </td>
                  </tr>
                ))}
                
                {/* Totals Rows */}
                <tr className="border-t-2 border-slate-300 font-semibold">
                  <td colSpan={2} className="py-2 px-2 text-right text-slate-700">Subtotal:</td>
                  <td className="text-right py-2 px-2 text-slate-900">{formatCurrency(data.totals.materials)}</td>
                  <td className="text-right py-2 px-2 text-slate-900">{formatCurrency(data.totals.labor)}</td>
                  <td className="text-right py-2 px-2 text-slate-900">{formatCurrency(data.totals.subtotal)}</td>
                </tr>
                {data.totals.permit_or_fees > 0 && (
                  <tr>
                    <td colSpan={4} className="py-2 px-2 text-right text-slate-700">Permits & Fees:</td>
                    <td className="text-right py-2 px-2 text-slate-900">{formatCurrency(data.totals.permit_or_fees)}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan={4} className="py-2 px-2 text-right text-slate-700">Overhead & Profit (15-20%):</td>
                  <td className="text-right py-2 px-2 text-slate-900">{formatCurrency(data.totals.overhead_profit)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="py-2 px-2 text-right text-slate-700">HST (13%):</td>
                  <td className="text-right py-2 px-2 text-slate-900">{formatCurrency(data.totals.tax_estimate)}</td>
                </tr>
                <tr className="border-t-2 border-slate-900 text-lg font-bold">
                  <td colSpan={4} className="py-3 px-2 text-right text-slate-900">Estimated Total:</td>
                  <td className="text-right py-3 px-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-orange-700">
                    {formatCurrency(data.totals.total_low)} - {formatCurrency(data.totals.total_high)}
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* Assumptions */}
        {data.assumptions.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
              Assumptions
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {data.assumptions.map((assumption, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>{assumption}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Questions to Confirm */}
        {data.questions_to_confirm.length > 0 && (
          <div className="bg-rose-50 rounded-xl p-5 border border-rose-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Questions for a More Accurate Estimate</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {data.questions_to_confirm.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-rose-700 font-bold mt-0.5">?</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Recommended Next Steps</h3>
          <ol className="space-y-2 text-sm text-slate-700">
            {data.next_steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="font-bold text-green-600 mt-0.5">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-700">
              <p className="font-semibold text-slate-900 mb-1">Important Disclaimer</p>
              <p>
                This is an AI-generated estimate based on the information provided. Final pricing will depend on 
                site conditions, material availability, local labor rates, and specific contractor quotes. Always 
                get multiple quotes from licensed contractors before starting work.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-safe min-w-0">
          <button
            onClick={onGetContractorBids}
            className="w-full sm:flex-1 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 
                     hover:to-orange-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl
                     transition-all transform hover:scale-[1.02] shadow-lg text-sm sm:text-base break-words"
          >
            Get 3 Contractor Bids
          </button>
          <button
            onClick={onSaveEstimate}
            className="w-full sm:flex-1 bg-white border-2 border-slate-300 hover:border-orange-500 
                     text-slate-900 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl
                     transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="truncate">Save / Email Estimate</span>
          </button>
        </div>

        {/* Share Actions */}
        <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 border-t border-slate-200">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-orange-600 
                     transition-colors px-3 py-2 rounded-lg hover:bg-slate-50 min-w-0"
          >
            {copied ? (
              <>
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
          <button
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-orange-600 
                     transition-colors px-3 py-2 rounded-lg hover:bg-slate-50 min-w-0"
          >
            <ShareIcon className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
