import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Terms | QuoteXbert',
  description: 'QuoteXbert affiliate program terms and conditions.',
};

export default function AffiliateTermsPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Affiliate Program Terms</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Last updated:</strong> January 31, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Program Overview</h2>
            <p className="text-gray-700">
              The QuoteXbert Affiliate Program allows you to earn commissions by referring homeowners and contractors to our platform. By participating, you agree to these terms in addition to our general Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligibility</h2>
            <p className="text-gray-700 mb-4">To join the affiliate program, you must:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Have a valid website, blog, social media presence, or email list</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not engage in fraudulent or misleading marketing practices</li>
              <li>Complete the affiliate application and be approved by QuoteXbert</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Commission Structure</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Commission Rates</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Homeowner Signups:</strong> $15 per qualified lead (homeowner posts a job)</li>
                <li><strong>Contractor Signups:</strong> 20% of first month subscription ($20-$60)</li>
                <li><strong>Recurring:</strong> 10% recurring commission for 12 months</li>
              </ul>
            </div>
            <p className="text-gray-700">
              Commissions are paid monthly via PayPal or bank transfer (minimum $50 threshold).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Qualified Referrals</h2>
            <p className="text-gray-700 mb-4">A referral is considered qualified when:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>The user clicks your unique affiliate link</li>
              <li>The user creates an account within 30 days</li>
              <li>Homeowners post at least one job</li>
              <li>Contractors purchase a subscription or lead credits</li>
              <li>The account remains active (no chargebacks or fraud)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Affiliate Links and Tracking</h2>
            <p className="text-gray-700 mb-4">
              You will receive a unique affiliate link and tracking dashboard. Cookie duration is 30 days. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Properly implementing your affiliate links</li>
              <li>Disclosing your affiliate relationship per FTC guidelines</li>
              <li>Monitoring your own traffic and conversions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Prohibited Marketing Practices</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
              <p className="text-gray-800 font-semibold mb-2">🚫 You May NOT:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Bid on QuoteXbert brand keywords in paid search</li>
                <li>Use misleading or deceptive advertising</li>
                <li>Claim to be QuoteXbert or represent yourself as our employee</li>
                <li>Send unsolicited spam emails</li>
                <li>Use incentivized traffic or fake referrals</li>
                <li>Create fake accounts or manipulate tracking</li>
                <li>Place affiliate links in adult, illegal, or offensive content</li>
              </ul>
            </div>
            <p className="text-gray-700">
              Violation of these rules will result in immediate termination and forfeiture of unpaid commissions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Marketing Materials</h2>
            <p className="text-gray-700 mb-4">
              QuoteXbert provides:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Banners and graphics</li>
              <li>Text links</li>
              <li>Email templates</li>
              <li>Social media content</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You may create your own promotional content but must not misrepresent our services or make false claims.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Payment Terms</h2>
            <div className="text-gray-700 space-y-3">
              <p><strong>Payment Schedule:</strong> Commissions are paid on the 15th of each month for the previous month's qualified referrals.</p>
              <p><strong>Minimum Payout:</strong> $50 (balances under $50 roll over to the next month)</p>
              <p><strong>Payment Methods:</strong> PayPal or direct bank transfer (Canada only)</p>
              <p><strong>Tax Reporting:</strong> You are responsible for reporting affiliate income. We will issue tax documents if required by law.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Refunds and Chargebacks</h2>
            <p className="text-gray-700">
              If a referred user requests a refund or initiates a chargeback, the corresponding commission will be deducted from your account balance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. FTC Disclosure Requirements</h2>
            <p className="text-gray-700 mb-4">
              You must clearly disclose your affiliate relationship when promoting QuoteXbert. Examples:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>"This post contains affiliate links. I may earn a commission if you sign up."</li>
              <li>"Disclosure: I'm a QuoteXbert affiliate and earn from qualifying signups."</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Failure to disclose may result in account termination and legal liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Program Changes and Termination</h2>
            <p className="text-gray-700 mb-4">
              QuoteXbert reserves the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Modify commission rates with 30 days notice</li>
              <li>Suspend or terminate affiliates for policy violations</li>
              <li>Discontinue the program at any time</li>
              <li>Withhold payment for suspected fraud</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You may cancel your affiliate account at any time. Unpaid commissions over $50 will be paid within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Limitation of Liability</h2>
            <p className="text-gray-700">
              QuoteXbert is not liable for lost commissions, tracking errors, or any damages related to the affiliate program. Our maximum liability is limited to unpaid commissions owed to you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact</h2>
            <p className="text-gray-700">
              Questions about the affiliate program? Contact us at <a href="mailto:affiliates@quotexbert.com" className="text-blue-600 hover:underline">affiliates@quotexbert.com</a>
            </p>
          </section>

          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to Join?</h3>
            <p className="text-gray-700 mb-4">
              Start earning commissions by referring homeowners and contractors to QuoteXbert!
            </p>
            <a 
              href="/affiliate-signup" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Apply for Affiliate Program
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
