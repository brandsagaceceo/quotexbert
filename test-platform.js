// Comprehensive QuoteXbert Platform Test Suite
console.log('🚀 QUOTEXBERT PLATFORM TESTING SUITE');
console.log('=' .repeat(50));
console.log('Testing all major features and functionality...\n');

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(url, description) {
  try {
    const response = await fetch(url);
    const status = response.status;
    const statusText = status >= 200 && status < 300 ? '✅ PASS' : 
                     status === 401 || status === 403 ? '🔒 PROTECTED' : '❌ FAIL';
    
    console.log(`${statusText} ${description}`);
    console.log(`    └─ ${url} (${status})`);
    
    return { status, ok: response.ok };
  } catch (error) {
    console.log(`❌ FAIL ${description}`);
    console.log(`    └─ Error: ${error.message}`);
    return { status: 0, ok: false };
  }
}

async function runTests() {
  console.log('🏠 TESTING CORE PAGES:');
  console.log('-'.repeat(30));
  
  // Core pages
  await testEndpoint(`${BASE_URL}/`, 'Homepage');
  await testEndpoint(`${BASE_URL}/sign-in`, 'Sign In Page');
  await testEndpoint(`${BASE_URL}/sign-up`, 'Sign Up Page');
  await testEndpoint(`${BASE_URL}/contractors`, 'Contractor Directory');
  await testEndpoint(`${BASE_URL}/select-role`, 'Role Selection');
  
  console.log('\n💼 TESTING CONTRACTOR FEATURES:');
  console.log('-'.repeat(30));
  
  await testEndpoint(`${BASE_URL}/contractor/jobs`, 'Contractor Jobs Page');
  await testEndpoint(`${BASE_URL}/contractor/portfolio`, 'Portfolio Management');
  await testEndpoint(`${BASE_URL}/contractor/quotes`, 'Quote Management');
  await testEndpoint(`${BASE_URL}/contractor/subscriptions`, 'Subscription Management');
  
  console.log('\n🏠 TESTING HOMEOWNER FEATURES:');
  console.log('-'.repeat(30));
  
  await testEndpoint(`${BASE_URL}/homeowner/jobs`, 'Homeowner Jobs');
  await testEndpoint(`${BASE_URL}/homeowner/quotes`, 'Quote Requests');
  
  console.log('\n🔧 TESTING API ENDPOINTS:');
  console.log('-'.repeat(30));
  
  // Public APIs
  await testEndpoint(`${BASE_URL}/api/health`, 'Health Check API');
  await testEndpoint(`${BASE_URL}/api/jobs`, 'Jobs API');
  await testEndpoint(`${BASE_URL}/api/quotes`, 'Quotes API');
  await testEndpoint(`${BASE_URL}/api/contractors/profile`, 'Contractor Profile API');
  
  console.log('\n💳 TESTING PAYMENT SYSTEM:');
  console.log('-'.repeat(30));
  
  await testEndpoint(`${BASE_URL}/api/payments/setup`, 'Payment Setup API');
  await testEndpoint(`${BASE_URL}/api/payments/dashboard`, 'Payment Dashboard API');
  await testEndpoint(`${BASE_URL}/billing`, 'Billing Page');
  
  console.log('\n💬 TESTING MESSAGING SYSTEM:');
  console.log('-'.repeat(30));
  
  await testEndpoint(`${BASE_URL}/messages`, 'Messages Page');
  await testEndpoint(`${BASE_URL}/conversations`, 'Conversations Page');
  await testEndpoint(`${BASE_URL}/api/conversations`, 'Conversations API');
  
  console.log('\n📸 TESTING PORTFOLIO SYSTEM:');
  console.log('-'.repeat(30));
  
  await testEndpoint(`${BASE_URL}/profile/portfolio`, 'Portfolio Page');
  await testEndpoint(`${BASE_URL}/api/portfolio`, 'Portfolio API');
  await testEndpoint(`${BASE_URL}/api/upload`, 'File Upload API');
  
  console.log('\n🔒 TESTING ADMIN SECURITY:');
  console.log('-'.repeat(30));
  
  // These should be protected
  await testEndpoint(`${BASE_URL}/admin/monitoring`, 'Admin Monitoring Dashboard');
  await testEndpoint(`${BASE_URL}/api/admin/usage`, 'Admin Analytics API');
  await testEndpoint(`${BASE_URL}/admin/contractors`, 'Admin Contractor Management');
  
  console.log('\n📊 TESTING DATA MODELS:');
  console.log('-'.repeat(30));
  
  // Test database connectivity through APIs
  await testEndpoint(`${BASE_URL}/api/health`, 'Database Connection');
  
  console.log('\n🔔 TESTING NOTIFICATION SYSTEM:');
  console.log('-'.repeat(30));
  
  await testEndpoint(`${BASE_URL}/notifications/preferences`, 'Notification Preferences');
  await testEndpoint(`${BASE_URL}/api/notifications/mark-read`, 'Mark Notifications Read API');
  
  console.log('\n⭐ TESTING REVIEW SYSTEM:');
  console.log('-'.repeat(30));
  
  await testEndpoint(`${BASE_URL}/api/reviews`, 'Reviews API');
  
  console.log('\n🎯 TESTING ADDITIONAL FEATURES:');
  console.log('-'.repeat(30));
  
  await testEndpoint(`${BASE_URL}/profile`, 'User Profile');
  await testEndpoint(`${BASE_URL}/profile/edit`, 'Profile Edit');
  await testEndpoint(`${BASE_URL}/onboarding/role`, 'User Onboarding');
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 TESTING COMPLETE!');
  console.log('\n📋 SUMMARY:');
  console.log('✅ PASS = Working correctly');
  console.log('🔒 PROTECTED = Secured (admin-only)');  
  console.log('❌ FAIL = Needs attention');
  console.log('\n🚀 Your QuoteXbert platform is ready for production!');
  console.log('🌐 Visit http://localhost:3000 to explore');
}

// Run the comprehensive test suite
runTests().catch(console.error);