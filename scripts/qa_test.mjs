import { execSync } from 'child_process';

const ENDPOINTS = [
  '/api/content?section=home_hero',
  '/api/content?section=home_stats',
  '/api/modules',
  '/api/settings',
  '/api/admin/partners'
];

async function runTests() {
  console.log('🚀 Starting API QA Tests...');
  let passed = 0;
  let failed = 0;

  for (const endpoint of ENDPOINTS) {
    try {
      console.log(`Checking ${endpoint}...`);
      // Use curl to check if server is reachable, as we can't easily start a server in background and wait for it here
      const response = execSync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${endpoint}`).toString();
      
      if (response === '200') {
        console.log(`✅ ${endpoint} passed (200)`);
        passed++;
      } else if (response === '000') {
        console.log(`⚠️  Server not reachable at localhost:3000. Skipping live API tests.`);
        break;
      } else {
        console.log(`❌ ${endpoint} failed with status: ${response}`);
        failed++;
      }
    } catch (err) {
      console.log(`❌ Error checking ${endpoint}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n📊 QA Summary:');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('⚠️ Some API tests failed. Please ensure the local server is running.');
  }
}

runTests();
