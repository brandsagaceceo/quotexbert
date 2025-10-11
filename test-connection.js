const http = require('http');

console.log('Testing basic connectivity to Next.js server...');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Server is responding!');
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Response received (first 200 chars):', body.substring(0, 200));
  });
});

req.on('error', (e) => {
  console.log('Connection error:', e.message);
  console.log('Make sure the development server is running with: npm run dev');
});

req.end();