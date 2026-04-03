// DEBUG/TEST PAGE — /basic-test
// Server connectivity diagnostic page. NOT linked from production UI.
// NOT LIVE — do not edit for production features.
export default function BasicTest() {
  return (
    <div style={{ padding: "20px", fontSize: "18px" }}>
      <h1>DEBUG: Basic Test Page</h1>
      <p>Server is reachable. This page exists only for connectivity checks.</p>
    </div>
  );
}
