const fetch = require("node-fetch");

async function testMessageSending() {
  try {
    console.log("🧪 Testing message sending...");

    // Test data
    const threadId = "cmeelfnzc0001jk2su6rxmgar"; // From earlier logs
    const fromUserId = "cmeelabtm0001jkisp3uamyg2"; // contractor
    const toUserId = "cmeelabte0000jkis8cwheaxu"; // homeowner
    const message = "This is a test message from the contractor!";

    // Send message
    const response = await fetch(
      `http://localhost:3000/api/threads/${threadId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromUserId,
          toUserId,
          message,
        }),
      },
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Message sent successfully:", result.message.body);
    } else {
      const error = await response.text();
      console.log("❌ Error sending message:", error);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testMessageSending();
