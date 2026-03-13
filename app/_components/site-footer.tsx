import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/95 backdrop-blur-xl border-t border-gray-100">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="footer-grid grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {/* Brand — spans 2 cols on desktop, full width on mobile */}
          <div className="footer-brand-col col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-900 via-rose-700 to-orange-600 bg-clip-text text-transparent">QuoteXbert</span>
            </Link>
            <p className="text-ink-600 mb-4 text-sm leading-relaxed">
              AI-powered renovation estimates for Toronto &amp; GTA homeowners. Verified contractor marketplace. Free for homeowners.
            </p>
            <p className="text-xs text-slate-500">Toronto, Ontario · Canada</p>
          </div>

          {/* For Homeowners */}
          <div>
            <h3 className="text-sm font-bold text-ink-900 mb-3 uppercase tracking-wide">Homeowners</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#get-estimate" className="text-ink-600 hover:text-brand transition-colors">Get AI Estimate</Link></li>
              <li><Link href="/renovation-costs" className="text-ink-600 hover:text-brand transition-colors">Renovation Cost Guides</Link></li>
              <li><Link href="/renovation-cost/toronto/kitchen-renovation" className="text-ink-600 hover:text-brand transition-colors">Kitchen Costs — Toronto</Link></li>
              <li><Link href="/renovation-cost/toronto/bathroom-renovation" className="text-ink-600 hover:text-brand transition-colors">Bathroom Costs — Toronto</Link></li>
              <li><Link href="/renovation-cost/toronto/basement-finishing" className="text-ink-600 hover:text-brand transition-colors">Basement Costs — Toronto</Link></li>
              <li><Link href="/ai-renovation-check" className="text-ink-600 hover:text-brand transition-colors">AI Renovation Inspector</Link></li>
            </ul>
          </div>

          {/* For Contractors */}
          <div>
            <h3 className="text-sm font-bold text-ink-900 mb-3 uppercase tracking-wide">Contractors</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contractors/join" className="text-ink-600 hover:text-brand transition-colors font-semibold">Join as Contractor</Link></li>
              <li><Link href="/contractors/toronto" className="text-ink-600 hover:text-brand transition-colors">Contractors — Toronto</Link></li>
              <li><Link href="/contractors/mississauga" className="text-ink-600 hover:text-brand transition-colors">Contractors — Mississauga</Link></li>
              <li><Link href="/contractors/brampton" className="text-ink-600 hover:text-brand transition-colors">Contractors — Brampton</Link></li>
              <li><Link href="/contractors/vaughan" className="text-ink-600 hover:text-brand transition-colors">Contractors — Vaughan</Link></li>
              <li><Link href="/contractors/join" className="text-ink-600 hover:text-brand transition-colors">Contractor Overview</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-ink-900 mb-3 uppercase tracking-wide">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-ink-600 hover:text-brand transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-ink-600 hover:text-brand transition-colors">Blog</Link></li>
              <li><Link href="/affiliates" className="text-ink-600 hover:text-brand transition-colors">Affiliate Program</Link></li>
              <li><Link href="/contact" className="text-ink-600 hover:text-brand transition-colors">Contact Us</Link></li>
              <li>
                <a href="tel:9052429460" className="text-ink-600 hover:text-brand transition-colors flex items-center gap-1">
                  <span>📞</span><span>905-242-9460</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-ink-900 mb-3 uppercase tracking-wide">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-ink-600 hover:text-brand transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-ink-600 hover:text-brand transition-colors">Terms of Service</Link></li>
            </ul>

            {/* Popular cities teaser */}
            <h3 className="text-sm font-bold text-ink-900 mt-6 mb-3 uppercase tracking-wide">Popular Guides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/renovation-cost/mississauga/kitchen-renovation" className="text-ink-600 hover:text-brand transition-colors">Kitchens — Mississauga</Link></li>
              <li><Link href="/renovation-cost/brampton/bathroom-renovation" className="text-ink-600 hover:text-brand transition-colors">Bathrooms — Brampton</Link></li>
              <li><Link href="/renovation-cost/scarborough/basement-finishing" className="text-ink-600 hover:text-brand transition-colors">Basements — Scarborough</Link></li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <div className="flex justify-center items-center gap-6 mb-6">
            <a href="https://www.facebook.com/quotexbert" target="_blank" rel="noopener noreferrer" className="text-ink-600 hover:text-rose-600 transition-colors duration-200" aria-label="Facebook">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@quotexbert" target="_blank" rel="noopener noreferrer" className="text-ink-600 hover:text-rose-600 transition-colors duration-200" aria-label="TikTok">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
            </a>
            <a href="https://www.instagram.com/quotexbert" target="_blank" rel="noopener noreferrer" className="text-ink-600 hover:text-rose-600 transition-colors duration-200" aria-label="Instagram">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://x.com/quotexbert" target="_blank" rel="noopener noreferrer" className="text-ink-600 hover:text-rose-600 transition-colors duration-200" aria-label="X (formerly Twitter)">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/quotexbert" target="_blank" rel="noopener noreferrer" className="text-ink-600 hover:text-rose-600 transition-colors duration-200" aria-label="LinkedIn">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
          <p className="text-sm text-ink-500 text-center">
            © {currentYear} QuoteXbert. All rights reserved. Made with ❤️ in Canada.
          </p>
        </div>
      </div>
    </footer>
  );
}
