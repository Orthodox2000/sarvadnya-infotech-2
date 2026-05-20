import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/content?section=home_faq',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
