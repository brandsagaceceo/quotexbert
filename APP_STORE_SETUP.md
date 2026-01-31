# QuoteXbert - iOS/Android App Setup Guide

## Overview
Your Next.js web app is now configured to be wrapped as a native iOS/Android app using Capacitor. The app will load your production website (https://www.quotexbert.com) inside a native wrapper.

## What's Been Set Up

### ✅ Completed
- Capacitor core installed (@capacitor/core, @capacitor/cli)
- iOS platform added (`ios/` folder with Xcode project)
- Android platform added (`android/` folder with Android Studio project)
- Splash screen plugin installed
- App configured:
  - **App ID**: com.quotexbert.app
  - **App Name**: QuoteXbert
  - **Points to**: https://www.quotexbert.com

## How It Works

The native apps will:
1. Open a native webview
2. Load your production website
3. Provide native app features (notifications, camera, etc.)
4. Be installable from App Store/Google Play

## Next Steps for iOS App Store

### Prerequisites
- **Mac computer** (required for iOS development)
- **Xcode** installed (from Mac App Store)
- **Apple Developer Account** ($99/year) - [Sign up here](https://developer.apple.com/programs/)

### 1. Open Project on Mac
```bash
# Transfer this project folder to your Mac
# Then open the iOS project:
npx cap open ios
```

### 2. Configure in Xcode
1. **Select your Team**:
   - Click on the project in left sidebar
   - Under "Signing & Capabilities"
   - Select your Apple Developer team

2. **Update Bundle Identifier** (if needed):
   - Change from `com.quotexbert.app` to your own if desired
   - Must be unique in App Store

3. **Add App Icon**:
   - Create a 1024x1024 PNG icon
   - Drag to `Assets.xcassets/AppIcon`
   - Or use [App Icon Generator](https://www.appicon.co/)

4. **Configure Info.plist**:
   - Add camera usage description (for photo uploads)
   - Add photo library usage description
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>QuoteXbert needs camera access to take photos for your estimates</string>
   <key>NSPhotoLibraryUsageDescription</key>
   <string>QuoteXbert needs photo access to upload images for your estimates</string>
   ```

### 3. Test on Simulator
```bash
# In Xcode:
# 1. Select a device from top toolbar (e.g., iPhone 15 Pro)
# 2. Click Play button (or Cmd+R)
# 3. App should launch and load your website
```

### 4. Test on Real Device
1. Connect iPhone via USB
2. Select your iPhone from device list
3. Click Play button
4. May need to trust developer certificate on device:
   - Settings > General > Device Management
   - Trust your developer certificate

### 5. Prepare for App Store

#### Create App Store Listing
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click "My Apps" > "+" > "New App"
3. Fill in:
   - Platform: iOS
   - Name: QuoteXbert
   - Primary Language: English
   - Bundle ID: com.quotexbert.app
   - SKU: QUOTEXBERT001

#### Create Screenshots
Required sizes:
- 6.7" Display (iPhone 15 Pro Max): 1290 x 2796 pixels
- 6.5" Display (iPhone 11 Pro Max): 1242 x 2688 pixels

Use simulator to take screenshots:
- Run app in Simulator
- Cmd+S to save screenshot
- Or use Device Frame generator for pretty frames

#### Fill Out App Information
- **Category**: Business or Productivity
- **Description**: Detailed app description (what it does)
- **Keywords**: "contractor quote estimate painting"
- **Support URL**: Your website
- **Privacy Policy URL**: Create one (required!)

### 6. Build for Release

1. **Archive the App**:
   ```
   In Xcode:
   Product > Archive
   (Wait 5-10 minutes)
   ```

2. **Upload to App Store**:
   ```
   Window > Organizer
   Select your archive
   Click "Distribute App"
   Choose "App Store Connect"
   Follow prompts to upload
   ```

3. **Submit for Review**:
   - Return to App Store Connect
   - Your build will appear in ~10 minutes
   - Select it for your app version
   - Answer compliance questions
   - Click "Submit for Review"

### 7. Review Process
- **Timeline**: 1-7 days typically
- **Common rejections**:
  - Missing privacy policy
  - Broken features
  - Not enough functionality
  - Crashes
- **Tips**:
  - Test thoroughly before submitting
  - Provide test account if needed
  - Respond quickly to reviewer questions

## Android Setup (Google Play)

### Prerequisites
- **Android Studio** - [Download](https://developer.android.com/studio)
- **Google Play Developer Account** ($25 one-time fee)

### Steps
```bash
# Open Android project
npx cap open android

# In Android Studio:
# 1. Let it sync/build
# 2. Run on emulator or device
# 3. Build > Generate Signed Bundle
# 4. Create keystore (keep it safe!)
# 5. Upload AAB to Google Play Console
```

## Alternative: Progressive Web App (PWA)

If you don't want to deal with app stores, users can "Add to Home Screen" from their browser:

### iOS Safari:
1. Visit https://www.quotexbert.com
2. Tap Share button
3. "Add to Home Screen"

### Android Chrome:
1. Visit https://www.quotexbert.com
2. Tap menu (3 dots)
3. "Add to Home Screen"

This creates an app icon that opens your website in fullscreen mode - no app stores needed!

## Updating the App

When you make changes to your website:
1. Changes are live immediately on web
2. Native apps will see changes next time they load (they load your website)
3. No need to resubmit to app stores unless you change native code

## Common Issues

### "Failed to load" in app
- Check that https://www.quotexbert.com is accessible
- Check Capacitor config has correct URL
- Try clearing app data and reopening

### Camera not working
- Add camera permissions to Info.plist (see step 2.4 above)
- Check iOS Settings > QuoteXbert > Camera is enabled

### Build errors in Xcode
- Make sure you selected a Team under Signing
- Try: Product > Clean Build Folder
- Check that Bundle ID is unique

## Cost Summary

- **Apple Developer Account**: $99/year (required for iOS)
- **Google Play Developer Account**: $25 one-time (required for Android)
- **App Icon Design**: Free (can make yourself) or $50-200
- **Time to Launch**: 1-2 weeks (including review time)

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

## Support

The native apps will behave exactly like your website since they load it in a webview. All your existing features (Stripe payments, AI estimates, etc.) will work without modification.

Need help? Check the Capacitor docs or App Store Connect documentation.
