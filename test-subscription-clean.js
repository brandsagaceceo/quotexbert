const http = require('http');

console.log('Testing subscription API with new category system...');

const data = JSON.stringify({
  contractorId: 'demo-contractor',
  category: 'handyman-services',
  startTrial: true
});

console.log('Request data:', data);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/subscriptions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', body);
    try {
      const parsed = JSON.parse(body);
      console.log('Parsed response:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Response is not valid JSON');
    }
  });
});

req.on('error', (e) => {
  console.log('Request error:', e.message);
});

req.write(data);
req.end();