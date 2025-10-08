#!/usr/bin/env node

// Firebase Configuration Validator
// Run this script to test if your Firebase config is working

const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    console.error('Looking for file at:', envPath);
    return null;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return envVars;
}

function validateFirebaseConfig() {
  console.log('🔥 Firebase Configuration Validator\n');
  
  const env = loadEnvFile();
  if (!env) return;

  const requiredKeys = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  let allValid = true;
  let hasPlaceholders = false;

  console.log('Checking required environment variables...\n');

  requiredKeys.forEach(key => {
    const value = env[key];
    
    if (!value || value.trim() === '') {
      console.log(`❌ ${key}: Missing`);
      allValid = false;
    } else if (value.includes('your_') || value.includes('demo-') || value === 'your_api_key_here') {
      console.log(`⚠️  ${key}: Contains placeholder value`);
      hasPlaceholders = true;
      allValid = false;
    } else {
      console.log(`✅ ${key}: Configured`);
    }
  });

  console.log('\n' + '='.repeat(50));

  if (allValid && !hasPlaceholders) {
    console.log('✅ All Firebase configuration values are set!');
    console.log('🎉 Your app should now use real Firebase authentication.');
    console.log('\nNext steps:');
    console.log('1. Restart your dev server: npm run dev');
    console.log('2. Test Google Sign-In at: http://localhost:3000/sign-in');
  } else if (hasPlaceholders) {
    console.log('⚠️  Firebase configuration has placeholder values.');
    console.log('📖 Please follow the setup guide in firebase-setup-guide.md');
    console.log('🔧 The app will use demo authentication until configured.');
  } else {
    console.log('❌ Firebase configuration is incomplete.');
    console.log('📖 Please follow the setup guide in firebase-setup-guide.md');
    console.log('🔧 The app will use demo authentication until configured.');
  }
}

// Run validation
validateFirebaseConfig();