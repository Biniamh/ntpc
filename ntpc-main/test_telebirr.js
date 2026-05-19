const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
const envPath = path.join(__dirname, 'artifacts', 'api-server', '.env');
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.error('Error reading .env file:', error.message);
  process.exit(1);
}

const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

// Mock process.env for testing
process.env = { ...process.env, ...envVars };

console.log('Environment variables:');
console.log('TELEBIRR_MOCK_ENABLED:', process.env.TELEBIRR_MOCK_ENABLED);
console.log('TELEBIRR_APP_ID:', process.env.TELEBIRR_APP_ID || '(empty)');
console.log('TELEBIRR_APP_KEY:', process.env.TELEBIRR_APP_KEY || '(empty)');
console.log('TELEBIRR_PUBLIC_KEY:', process.env.TELEBIRR_PUBLIC_KEY ? '[SET]' : '(empty)');
console.log('TELEBIRR_SHORT_CODE:', process.env.TELEBIRR_SHORT_CODE || '(empty)');

// Import and test the Telebirr service
try {
  const { createTelebirrServiceFromEnv } = require('./artifacts/api-server/src/lib/telebirr-service');
  
  const telebirrService = createTelebirrServiceFromEnv();
  console.log('\nTelebirr service created successfully');
  console.log('Is configured:', telebirrService.isConfigured());
  
  // Test initiatePayment with mock data
  telebirrService.initiatePayment(
    'TEST-' + Date.now(),
    '100',
    'Test Payment'
  ).then(result => {
    console.log('\nPayment initiation result:', JSON.stringify(result, null, 2));
  }).catch(error => {
    console.error('\nPayment initiation error:', error);
  });
} catch (error) {
  console.error('\nError creating Telebirr service:', error);
}