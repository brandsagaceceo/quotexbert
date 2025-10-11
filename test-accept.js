// Test job acceptance API
const jobId = "cmgk578oq0001jkb8n61rrfa4";
const contractorId = "demo-contractor";

fetch('http://localhost:3000/api/jobs/' + jobId + '/accept', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ contractorId })
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch(error => {
  console.error('Error:', error);
});