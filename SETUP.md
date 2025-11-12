# Craftify - Setup Guide

This guide will help you set up the Craftify React Native project from scratch.

## Prerequisites

Before you begin, make sure you have the following installed:

### Required Software

1. **Node.js** (>= 20.x)
   ```bash
   node --version  # Should be 20.x or higher
   ```

2. **npm** or **yarn**
   ```bash
   npm --version  # or yarn --version
   ```

3. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

4. **Watchman** (macOS/Linux)
   ```bash
   brew install watchman  # macOS
   ```

### For iOS Development (macOS only)

5. **Xcode** (Latest version from App Store)
   - Install Command Line Tools:
     ```bash
     xcode-select --install
     ```

6. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

### For Android Development

7. **Android Studio** (Latest version)
   - Install Android SDK
   - Configure ANDROID_HOME environment variable:
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/tools
     export PATH=$PATH:$ANDROID_HOME/tools/bin
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     ```

8. **JDK 11 or higher**
   ```bash
   java --version  # Should be 11 or higher
   ```

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd craftify
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

This will install all the dependencies including:
- React Native 0.82.1
- Zustand (state management)
- React Navigation
- React Native Paper (UI components)
- Axios (HTTP client)
- And all other required packages

### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

This will install all iOS native dependencies.

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# API Configuration
API_BASE_URL=http://localhost:1337/api/v1
CDN_BASE_URL=http://localhost:3000

# Firebase Configuration (if using Firebase)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id

# Feature Flags
ENABLE_VIDEO_TEMPLATES=false
ENABLE_AI_FEATURES=false
```

**Note:** The `.env` file is gitignored for security. Never commit it to version control.

## Running the App

### Start Metro Bundler

First, start the Metro bundler in one terminal:

```bash
npm start
# or
yarn start
```

### Run on iOS

In another terminal:

```bash
npm run ios
# or
yarn ios

# Run on specific simulator
npx react-native run-ios --simulator="iPhone 14"
```

### Run on Android

Make sure you have an Android emulator running or a device connected:

```bash
npm run android
# or
yarn android
```

## Common Issues & Solutions

### Issue: "Command not found: react-native"

**Solution:** Install React Native CLI globally:
```bash
npm install -g react-native-cli
```

### Issue: iOS build fails with "Podfile.lock out of sync"

**Solution:**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Issue: Android build fails with "SDK not found"

**Solution:** Make sure ANDROID_HOME is set correctly and Android SDK is installed.

### Issue: Metro bundler not starting

**Solution:**
```bash
# Clear Metro cache
npm start -- --reset-cache

# Or manually clear
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
```

### Issue: "Unable to resolve module"

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear watchman watches
watchman watch-del-all

# Clear Metro cache
npm start -- --reset-cache
```

## Project Structure Overview

```
craftify/
├── src/
│   ├── api/              # API client and endpoints
│   ├── assets/           # Images, fonts, icons
│   ├── components/       # Reusable components
│   ├── config/           # Configuration files
│   ├── constants/        # App constants
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation setup
│   ├── screens/          # App screens
│   ├── services/         # Business logic
│   ├── stores/           # Zustand stores
│   ├── theme/            # Theme configuration
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── android/              # Android native code
├── ios/                  # iOS native code
└── ...config files
```

## Development Workflow

### 1. Check Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

### 2. Run Tests

```bash
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### 3. Debug

#### React Native Debugger
1. Install React Native Debugger: https://github.com/jhen0409/react-native-debugger
2. Run the app
3. Shake device (CMD+D on iOS, CMD+M on Android)
4. Select "Debug"

#### Flipper (Recommended)
1. Install Flipper: https://fbflipper.com/
2. Run the app
3. Open Flipper - it will automatically connect

## Adding New Features

### 1. Install New Dependencies

```bash
# For JavaScript packages
npm install <package-name>

# For packages with native code
npm install <package-name>
cd ios && pod install && cd ..  # iOS only
```

### 2. Link Assets (Fonts, Images)

If you add custom fonts or need to link assets:

```bash
npx react-native-asset
```

## Building for Production

### iOS

1. Open `ios/Craftify.xcworkspace` in Xcode
2. Select "Generic iOS Device" as target
3. Product → Archive
4. Follow the upload process

### Android

```bash
cd android

# Generate Release APK
./gradlew assembleRelease

# Generate Release AAB (for Play Store)
./gradlew bundleRelease
```

The generated files will be in:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

## Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Craftify PRD](./craftify_prd.md)

## Getting Help

If you encounter any issues:

1. Check this setup guide
2. Check the [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)
3. Search existing issues on GitHub
4. Ask in team chat or create a new issue

## Next Steps

After setup is complete:

1. Review the [PRD](./craftify_prd.md) to understand the product
2. Explore the codebase structure
3. Check out the existing components and screens
4. Start building new features!

---

**Happy Coding! 🚀**
