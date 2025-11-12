# Craftify - Personalized Template Creator App

A React Native mobile app for creating personalized greeting cards, festival wishes, and promotional content optimized for the Indian market.

## 🚀 Features

- **500+ Templates**: Indian festivals, daily wishes, business promotions, and social media content
- **Quick Editing**: One-tap personalization with drag-and-drop simplicity
- **WhatsApp Ready**: Optimized exports for instant sharing
- **Offline Support**: Cache last 20 templates for offline editing
- **Premium Features**: Video templates, AI background removal, custom stickers

## 📱 Tech Stack

- **Framework**: React Native 0.82+
- **State Management**: Zustand
- **Navigation**: React Navigation 6
- **UI Components**: React Native Paper
- **Backend**: Strapi (Headless CMS)
- **Database**: PostgreSQL
- **File Storage**: Cloudinary
- **Authentication**: Firebase Auth
- **Payments**: Razorpay

## 🛠️ Setup Instructions

### Prerequisites

- Node.js >= 20.19.4
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd craftoCopy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Android Setup**
   - Open Android Studio
   - Configure Android SDK
   - Set up Android emulator or connect physical device

### Running the App

#### Development Mode

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

#### Production Build

```bash
# Android
cd android
./gradlew assembleRelease

# iOS
cd ios
xcodebuild -workspace craftoCopy.xcworkspace -scheme craftoCopy -configuration Release
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # App screens
├── navigation/         # Navigation configuration
├── stores/            # Zustand state management
├── services/          # API services
├── types/             # TypeScript type definitions
├── theme/             # Theme configuration
└── utils/             # Utility functions
```

## 🎨 Design System

The app uses Material Design 3 with custom theming:

- **Primary Color**: #6200EE (Purple)
- **Secondary Color**: #03DAC6 (Teal)
- **Typography**: Roboto font family
- **Components**: React Native Paper components

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://api.craftify.com/v1
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
RAZORPAY_KEY_ID=your_razorpay_key
FIREBASE_API_KEY=your_firebase_key
```

### Backend Setup

The app expects a Strapi backend with the following content types:

- **Templates**: Template metadata and configuration
- **Users**: User profiles and preferences
- **Exports**: Export history and analytics

## 📊 Analytics & Tracking

The app tracks key user events:

- Template views and downloads
- Editor interactions
- Export completions
- Subscription conversions
- User retention metrics

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests (Detox)
npm run test:e2e:ios
npm run test:e2e:android
```

## 🚀 Deployment

### App Store Deployment

1. **iOS App Store**
   - Archive the app in Xcode
   - Upload to App Store Connect
   - Submit for review

2. **Google Play Store**
   - Generate signed APK/AAB
   - Upload to Google Play Console
   - Submit for review

### Backend Deployment

- Deploy Strapi to cloud provider (AWS/GCP)
- Set up PostgreSQL database
- Configure Cloudinary for file storage
- Set up CDN for template assets

## 📈 Performance Targets

- **Cold Start**: < 3 seconds
- **Template Load**: < 2 seconds
- **Export Time**: < 5 seconds
- **Crash Rate**: < 0.5%
- **Memory Usage**: < 200MB

## 🔒 Security

- HTTPS for all API calls
- JWT token authentication
- Image encryption at rest
- Rate limiting on API endpoints
- Content moderation for user uploads

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Email: support@craftify.com
- Documentation: [docs.craftify.com](https://docs.craftify.com)

---

**Built with ❤️ for the Indian market**