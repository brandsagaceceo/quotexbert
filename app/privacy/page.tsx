import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | QuoteXbert',
  description: 'Learn how QuoteXbert collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: November 5, 2025</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to QuoteXbert ("we," "us," or "our"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p className="text-gray-700">
              By accessing or using QuoteXbert, you agree to this Privacy Policy. If you do not agree with our policies and practices, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, phone number, password (encrypted)</li>
              <li><strong>Profile Data:</strong> User role (homeowner/contractor), profile photo, business information</li>
              <li><strong>Project Information:</strong> Service requests, project descriptions, photos, location data</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store full credit card numbers)</li>
              <li><strong>Communication Data:</strong> Messages, reviews, feedback, and support inquiries</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies, authentication tokens, analytics data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Connect homeowners with contractors for projects</li>
              <li>Process payments and prevent fraud</li>
              <li>Send service-related notifications and updates</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Generate AI-powered project estimates</li>
              <li>Analyze usage patterns and improve user experience</li>
              <li>Comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">We share your information only in these situations:</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Between Users:</strong> Project details shared with contractors who claim your leads</li>
              <li><strong>Service Providers:</strong> Clerk (authentication), Stripe (payments), OpenAI (AI estimates), Vercel (hosting)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
            </ul>
            <p className="text-gray-700">
              <strong>We never sell your personal information to third parties.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Processing</h2>
            <p className="text-gray-700 mb-4">
              All payment transactions are processed securely through <strong>Stripe</strong>, a PCI-DSS compliant payment processor. We do not store your full credit card details on our servers. Stripe's privacy policy can be found at{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                stripe.com/privacy
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure authentication through Clerk with OAuth support</li>
              <li>Regular security audits and updates</li>
              <li>Role-based access controls</li>
              <li>Encrypted password storage</li>
            </ul>
            <p className="text-gray-700">
              However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li>Keep you signed in to your account</li>
              <li>Remember your preferences</li>
              <li>Analyze site traffic and user behavior</li>
              <li>Improve platform performance</li>
            </ul>
            <p className="text-gray-700">
              You can control cookies through your browser settings, but disabling them may limit functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correct:</strong> Update inaccurate information through your profile</li>
              <li><strong>Delete:</strong> Request deletion of your account and data</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails</li>
              <li><strong>Data Portability:</strong> Request your data in a machine-readable format</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@quotexbert.com" className="text-blue-600 hover:underline">
                privacy@quotexbert.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700">
              QuoteXbert is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a minor, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
            <p className="text-gray-700">
              Your information may be transferred to and processed in countries outside your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last Updated" date. Continued use of our services after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>QuoteXbert</strong></p>
              <p className="text-gray-700 mb-2">Email: <a href="mailto:privacy@quotexbert.com" className="text-blue-600 hover:underline">privacy@quotexbert.com</a></p>
              <p className="text-gray-700 mb-2">Support: <a href="mailto:support@quotexbert.com" className="text-blue-600 hover:underline">support@quotexbert.com</a></p>
              <p className="text-gray-700">Serving the Greater Toronto Area, Canada</p>
            </div>
          </section>
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
