import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-ink-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 bg-clip-text text-transparent">quotexbert</span>
            </Link>
            <p className="text-ink-600 mb-4 max-w-md">
              Connect homeowners with trusted contractors. Get instant quotes
              for home improvement projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-ink-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/create-lead"
                  className="text-ink-600 hover:text-brand transition-colors duration-200"
                >
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link
                  href="/contractor/jobs"
                  className="text-ink-600 hover:text-brand transition-colors duration-200"
                >
                  Browse Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold text-ink-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-ink-600 hover:text-brand transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-ink-600 hover:text-brand transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ink-200 mt-8 pt-8 text-center">
          <p className="text-sm text-ink-500">
            © {currentYear} quotexbert. All rights reserved. Made with ❤️ in
            Canada.
          </p>
        </div>
      </div>
    </footer>
  );
}
