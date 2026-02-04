/**
 * Grant COMP Subscription Script
 * 
 * This script grants a manual "COMP" subscription to brandsagaceo@gmail.com
 * Usage: node grant-comp.js
 */

const fetch = require('node:fetch');

const API_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const EMAIL = 'brandsagaceo@gmail.com';

async function grantComp() {
  console.log('🚀 Granting COMP subscription...');
  console.log(`   Email: ${EMAIL}`);
  console.log(`   Tier: GENERAL (Highest/Pro MAX)`);
  console.log(`   API: ${API_URL}/api/admin/comp-subscription`);
  console.log('');

  if (!ADMIN_TOKEN) {
    console.error('❌ ERROR: ADMIN_TOKEN environment variable not set');
    console.log('');
    console.log('Please set ADMIN_TOKEN in your .env.local file:');
    console.log('ADMIN_TOKEN=your-secret-token-here');
    process.exit(1);
  }

  try {
    const response = await fetch(`${API_URL}/api/admin/comp-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_TOKEN
      },
      body: JSON.stringify({
        email: EMAIL,
        tier: 'GENERAL', // Highest tier
        expiresAt: null, // Never expires
        reason: 'Internal testing - CEO account'
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS! COMP subscription granted');
      console.log('');
      console.log('User Details:');
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Name: ${data.user.name || 'N/A'}`);
      console.log(`   Tier: ${data.user.proOverrideTier}`);
      console.log(`   Expires: ${data.user.proOverrideExpiresAt || 'Never'}`);
      console.log(`   Reason: ${data.user.proOverrideReason}`);
      console.log(`   Set by: ${data.user.proOverrideSetBy}`);
      console.log(`   Set at: ${data.user.proOverrideSetAt}`);
      console.log('');
      console.log('🎉 You now have full Pro MAX access!');
    } else {
      console.error('❌ ERROR:', data.error);
      if (data.details) {
        console.error('   Details:', data.details);
      }
    }
  } catch (error) {
    console.error('❌ NETWORK ERROR:', error.message);
  }
}

// Check subscription status
async function checkStatus() {
  console.log('🔍 Checking subscription status...');
  console.log('');

  if (!ADMIN_TOKEN) {
    console.error('❌ ERROR: ADMIN_TOKEN environment variable not set');
    process.exit(1);
  }

  try {
    const response = await fetch(`${API_URL}/api/admin/comp-subscription?email=${encodeURIComponent(EMAIL)}`, {
      method: 'GET',
      headers: {
        'x-admin-token': ADMIN_TOKEN
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log('User Subscription Status:');
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Role: ${data.user.role}`);
      console.log('');
      console.log('Current Stripe Subscription:');
      console.log(`   Plan: ${data.user.subscriptionPlan || 'None'}`);
      console.log(`   Status: ${data.user.subscriptionStatus || 'N/A'}`);
      console.log('');
      console.log('Manual Override:');
      console.log(`   Enabled: ${data.user.proOverrideEnabled ? 'Yes' : 'No'}`);
      console.log(`   Tier: ${data.user.proOverrideTier || 'N/A'}`);
      console.log(`   Expires: ${data.user.proOverrideExpiresAt || 'Never'}`);
      console.log(`   Reason: ${data.user.proOverrideReason || 'N/A'}`);
      console.log('');
      console.log(`Effective Tier: ${data.effectiveTier || 'FREE'}`);
      console.log(`Override Active: ${data.isOverrideActive ? 'Yes' : 'No'}`);
      console.log('');
      console.log(data.message);
    } else {
      console.error('❌ ERROR:', data.error);
    }
  } catch (error) {
    console.error('❌ NETWORK ERROR:', error.message);
  }
}

// Remove COMP subscription
async function removeComp() {
  console.log('🗑️  Removing COMP subscription...');
  console.log('');

  if (!ADMIN_TOKEN) {
    console.error('❌ ERROR: ADMIN_TOKEN environment variable not set');
    process.exit(1);
  }

  try {
    const response = await fetch(`${API_URL}/api/admin/comp-subscription`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_TOKEN
      },
      body: JSON.stringify({
        email: EMAIL
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS! Override removed');
      console.log('');
      console.log('User will now use Stripe subscription:');
      console.log(`   Plan: ${data.user.subscriptionPlan || 'None'}`);
      console.log(`   Status: ${data.user.subscriptionStatus || 'N/A'}`);
    } else {
      console.error('❌ ERROR:', data.error);
    }
  } catch (error) {
    console.error('❌ NETWORK ERROR:', error.message);
  }
}

// Parse command line arguments
const command = process.argv[2];

if (command === 'check' || command === 'status') {
  checkStatus();
} else if (command === 'remove' || command === 'delete') {
  removeComp();
} else {
  grantComp();
}
