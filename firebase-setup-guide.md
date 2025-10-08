# Firebase Setup Guide for QuoteXpert

## Step 1: Create Firebase Project

1. Open your browser and go to: https://console.firebase.google.com
2. Click "Create a project" or "Add project"
3. Project name: `quotexpert`
4. Project ID: `quotexpert-[random-id]` (Firebase will suggest one)
5. Enable Google Analytics: **Yes** (recommended)
6. Choose or create Analytics account
7. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click on "Google" provider
5. Click the toggle to "Enable"
6. Set project support email (your email)
7. Click "Save"

## Step 3: Add Web App

1. In Project Overview, click the web icon `</>`
2. App nickname: `QuoteXpert Web App`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **COPY THE CONFIG OBJECT** - you'll need this next!

## Step 4: Configure Authorized Domains

1. In Authentication > Settings > Authorized domains
2. Add these domains:
   - `localhost` (for development)
   - Your production domain (when you deploy)

## Step 5: Update Environment Variables

Copy the config values from Step 3 and replace the values in your `.env.local` file.

The config object looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "quotexpert-xxxxx.firebaseapp.com",
  projectId: "quotexpert-xxxxx",
  storageBucket: "quotexpert-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

## Step 6: Test Authentication

1. Save your `.env.local` file
2. Restart your development server: `npm run dev`
3. Go to http://localhost:3000/sign-in
4. Click "Continue with Google"
5. It should now work with real Google authentication!

## Firestore Database (Optional - for user profiles)

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for now
4. Select a location close to you
5. Click "Done"

---

## Quick Copy-Paste Template for .env.local

Replace the values below with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=quotexpert-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=quotexpert-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=quotexpert-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```