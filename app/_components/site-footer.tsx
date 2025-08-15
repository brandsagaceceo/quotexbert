export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 text-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} quotexbert. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
