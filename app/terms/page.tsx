import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | QuoteXbert',
  description: 'Read the terms and conditions for using QuoteXbert platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last Updated: November 5, 2025</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              Welcome to QuoteXbert. By accessing or using our platform, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
            </p>
            <p className="text-gray-700">
              These Terms constitute a legally binding agreement between you and QuoteXbert ("we," "us," or "our"). We reserve the right to update these Terms at any time, and your continued use of the platform constitutes acceptance of any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              QuoteXbert is an online platform that connects homeowners with contractors for home improvement projects. Our services include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>AI-powered project estimates and cost calculations</li>
              <li>Job board for contractors to browse and claim leads</li>
              <li>Messaging system for communication between users</li>
              <li>Payment processing through Stripe</li>
              <li>Portfolio management for contractors</li>
              <li>Review and rating system</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Registration</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Account Creation</h3>
            <p className="text-gray-700 mb-4">
              To use QuoteXbert, you must create an account and provide accurate information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Immediately notifying us of any unauthorized use</li>
              <li>Ensuring all information provided is accurate and up-to-date</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Eligibility</h3>
            <p className="text-gray-700 mb-4">
              You must be at least 18 years old to use QuoteXbert. By creating an account, you represent that you meet this requirement and have the legal capacity to enter into these Terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Account Types</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Homeowners:</strong> Post project requests and receive estimates</li>
              <li><strong>Contractors:</strong> Browse leads, submit quotes, and manage projects</li>
              <li><strong>Admin:</strong> Platform management and oversight (by invitation only)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct and Prohibited Activities</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">You agree NOT to:</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Provide false, misleading, or fraudulent information</li>
              <li>Impersonate any person or entity</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post spam, malware, or malicious content</li>
              <li>Scrape, copy, or misuse platform data</li>
              <li>Circumvent platform fees or payment systems</li>
              <li>Use the platform for illegal activities</li>
              <li>Create multiple accounts to abuse the system</li>
              <li>Interfere with platform security or functionality</li>
            </ul>

            <p className="text-gray-700 font-semibold">
              Violation of these terms may result in account suspension or termination.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payments, Fees, and Refunds</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Payment Processing</h3>
            <p className="text-gray-700 mb-4">
              All payments are processed securely through Stripe. By using our payment services, you agree to Stripe's Terms of Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Platform Fees</h3>
            <p className="text-gray-700 mb-4">
              QuoteXbert charges a service fee for successful project connections. Fees are clearly disclosed before any payment is made. We reserve the right to modify fees with 30 days' notice.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Refund Policy</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Lead Fees:</strong> Non-refundable once a contractor claims a lead</li>
              <li><strong>Project Payments:</strong> Refunds handled case-by-case through our dispute resolution process</li>
              <li><strong>Fraudulent Charges:</strong> Full refund if unauthorized transaction is verified</li>
            </ul>
            <p className="text-gray-700">
              For refund requests, contact{' '}
              <a href="mailto:billing@quotexbert.com" className="text-blue-600 hover:underline">
                billing@quotexbert.com
              </a>{' '}
              within 30 days of the transaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contractor Obligations</h2>
            <p className="text-gray-700 mb-4">If you register as a contractor, you additionally agree to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Maintain all required licenses, permits, and insurance</li>
              <li>Provide accurate project estimates and timelines</li>
              <li>Perform work professionally and to industry standards</li>
              <li>Respond to homeowner inquiries in a timely manner</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Resolve disputes in good faith</li>
            </ul>
            <p className="text-gray-700 font-semibold">
              QuoteXbert is not responsible for the quality of work performed by contractors.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Platform Content</h3>
            <p className="text-gray-700 mb-4">
              All content on QuoteXbert, including logos, designs, text, graphics, and software, is owned by QuoteXbert or licensed to us. You may not copy, reproduce, or distribute our content without permission.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 User Content</h3>
            <p className="text-gray-700 mb-4">
              You retain ownership of content you upload (photos, descriptions, reviews). By posting content, you grant QuoteXbert a worldwide, non-exclusive license to use, display, and distribute your content on the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Limitations of Liability</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 Platform "As Is"</h3>
            <p className="text-gray-700 mb-4">
              QuoteXbert is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy of AI-generated estimates</li>
              <li>Quality of work performed by contractors</li>
              <li>Success in finding contractors or projects</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.2 Limitation of Liability</h3>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by law, QuoteXbert shall not be liable for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Actions or omissions of contractors or homeowners</li>
              <li>Disputes between users</li>
            </ul>
            <p className="text-gray-700 font-semibold">
              Our total liability shall not exceed the amount you paid to QuoteXbert in the 12 months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify and hold harmless QuoteXbert, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Your use of the platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any work performed or payments made through the platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">10.1 Informal Resolution</h3>
            <p className="text-gray-700 mb-4">
              Before filing a claim, you agree to contact us at{' '}
              <a href="mailto:disputes@quotexbert.com" className="text-blue-600 hover:underline">
                disputes@quotexbert.com
              </a>{' '}
              to attempt informal resolution.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">10.2 Arbitration</h3>
            <p className="text-gray-700 mb-4">
              Any disputes that cannot be resolved informally shall be resolved through binding arbitration in Ontario, Canada, in accordance with the Arbitration Act, 1991.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to suspend or terminate your account at any time for:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Abuse of platform or other users</li>
              <li>Non-payment of fees</li>
            </ul>
            <p className="text-gray-700">
              You may terminate your account at any time through your profile settings or by contacting support.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of Ontario, Canada, without regard to conflict of law principles. Any legal action must be brought in the courts of Ontario.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Severability</h2>
            <p className="text-gray-700">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>QuoteXbert</strong></p>
              <p className="text-gray-700 mb-2">Email: <a href="mailto:legal@quotexbert.com" className="text-blue-600 hover:underline">legal@quotexbert.com</a></p>
              <p className="text-gray-700 mb-2">Support: <a href="mailto:support@quotexbert.com" className="text-blue-600 hover:underline">support@quotexbert.com</a></p>
              <p className="text-gray-700">Serving the Greater Toronto Area, Canada</p>
            </div>
          </section>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
            <p className="text-blue-900 font-semibold mb-2">Important Notice</p>
            <p className="text-blue-800">
              By using QuoteXbert, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
