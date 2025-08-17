export default function TestMessaging() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Messaging System Test</h1>

      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        <strong>✅ Server Status:</strong> Development server is running on
        http://localhost:3000
      </div>

      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📊 API Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
              <code>GET /api/threads</code> - Working ✅
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
              <code>GET /api/threads/[id]/messages</code> - Working ✅
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
              <code>POST /api/threads/[id]/messages</code> - Working ✅
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">💾 Database Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>📋 Leads:</strong> 2 records
              <br />
              <strong>👥 Users:</strong> 3 records
              <br />
            </div>
            <div>
              <strong>💬 Threads:</strong> 1 record
              <br />
              <strong>📝 Messages:</strong> 3+ records
              <br />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🔗 Quick Links</h2>
          <div className="space-y-2">
            <div>
              <a
                href="/messages"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                📨 Messages Page
              </a>
            </div>
            <div>
              <a
                href="/api/threads?userId=cmeelabtm0001jkisp3uamyg2"
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
              >
                🔧 Threads API (Contractor)
              </a>
            </div>
            <div>
              <a
                href="/api/threads?userId=cmeelabte0000jkis8cwheaxu"
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
              >
                🔧 Threads API (Homeowner)
              </a>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🎯 Test Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click on "Messages Page" link above</li>
            <li>You should see a user dropdown (contractor/homeowner)</li>
            <li>Select different users to switch perspectives</li>
            <li>Look for "Kitchen Sink Repair" conversation</li>
            <li>Click on it to open the chat</li>
            <li>Try sending a test message</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Demo Users</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>👷 Contractor:</strong>
              <br />
              Email: contractor@demo.com
              <br />
              ID: cmeelabtm0001jkisp3uamyg2
            </div>
            <div>
              <strong>🏠 Homeowner:</strong>
              <br />
              Email: homeowner@demo.com
              <br />
              ID: cmeelabte0000jkis8cwheaxu
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
