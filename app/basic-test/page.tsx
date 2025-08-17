export default function BasicTest() {
  return (
    <div style={{ padding: "20px", fontSize: "18px" }}>
      <h1>🟢 BASIC TEST PAGE</h1>
      <p>If you can see this, the server is working!</p>
      <div
        style={{ backgroundColor: "yellow", padding: "10px", margin: "10px 0" }}
      >
        <strong>Server Status: ONLINE</strong>
      </div>
      <div>
        <a
          href="/messages"
          style={{
            display: "block",
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            textDecoration: "none",
            margin: "5px 0",
          }}
        >
          📨 Messages Page
        </a>
        <a
          href="/simple-debug"
          style={{
            display: "block",
            padding: "10px",
            backgroundColor: "green",
            color: "white",
            textDecoration: "none",
            margin: "5px 0",
          }}
        >
          🔧 Debug Page
        </a>
      </div>
    </div>
  );
}
