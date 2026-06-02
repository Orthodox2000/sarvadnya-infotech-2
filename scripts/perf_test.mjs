import http from 'http';

const ENDPOINTS = [
  '/',
  '/api/content?section=home_hero',
  '/api/modules',
  '/api/settings',
  '/api/tutorials'
];

async function testPerformance() {
  console.log('--- Performance Test (Latency) ---');
  for (const endpoint of ENDPOINTS) {
    const start = Date.now();
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:3000${endpoint}`, (res) => {
          res.on('data', () => {});
          res.on('end', resolve);
        });
        req.on('error', reject);
      });
      const duration = Date.now() - start;
      console.log(`${endpoint.padEnd(40)}: ${duration}ms`);
    } catch (err) {
      console.log(`${endpoint.padEnd(40)}: FAILED (Is server running?)`);
    }
  }
}

testPerformance();
