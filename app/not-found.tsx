export default function NotFound() {
  return (
    <main
      className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center"
      data-no-ai-widget
    >
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-3xl font-black text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-6 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a
        href="/"
        className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
      >
        Back to Home →
      </a>
    </main>
  );
}
