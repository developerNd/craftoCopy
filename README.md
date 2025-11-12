# Craftify - Personalized Template Creator App

**Craftify** is a mobile-first template personalization app designed for the Indian market, enabling users to create professional-quality greeting cards, festival wishes, and promotional content in under 60 seconds.

## 🎯 Key Features

- **500+ Premium Templates** - Festivals, Business, Social Media, Events
- **Intuitive Editor** - Drag, drop, edit - it's that simple
- **Offline Mode** - Edit templates without internet
- **WhatsApp Optimized** - Perfect exports for WhatsApp sharing
- **Multi-format Export** - PNG, JPEG (Video coming in Phase 2)
- **Indian Market Focus** - Diwali, Holi, Eid, and more

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **npm** or **yarn**
- **React Native CLI**
- **Xcode** (for iOS) / **Android Studio** (for Android)
- **CocoaPods** (for iOS)

### Installation

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/craftify.git
   cd craftify
   npm install
   ```

2. **iOS setup** (Mac only)
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the app**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 📁 Project Structure

```
craftify/
├── src/
│   ├── api/              # API client and endpoints
│   ├── assets/           # Images, fonts, icons
│   ├── components/       # Reusable UI components
│   ├── config/           # Configuration files
│   ├── constants/        # App constants (colors, dimensions, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation setup
│   ├── screens/          # App screens
│   ├── services/         # Business logic services
│   ├── stores/           # Zustand state management
│   ├── theme/            # Theme configuration
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── android/              # Android native code
├── ios/                  # iOS native code
└── app.json              # App configuration
```

## 🛠 Tech Stack

- **React Native** 0.82.1 - Mobile framework
- **TypeScript** 5.x - Type safety
- **Zustand** 5.x - State management
- **React Navigation** 7.x - Navigation
- **React Native Paper** 5.x - UI components
- **React Native Gesture Handler** - Gestures
- **React Native View Shot** - Export functionality

## 📜 Available Scripts

```bash
npm start          # Start Metro bundler
npm run android    # Run on Android
npm run ios        # Run on iOS
npm test           # Run tests
npm run lint       # Check code quality
npm run type-check # TypeScript check
```

## 🔐 Environment Variables

See `.env.example` for required environment variables:

- API endpoints
- Firebase configuration
- Razorpay keys
- Cloudinary credentials
- Feature flags

## 📱 Features (MVP)

- ✅ Template browsing by category
- ✅ Template search and filters
- ✅ Favorites system
- ✅ Image editor (replace, crop, rotate)
- ✅ Text editor (font, color, size)
- ✅ Export to PNG/JPEG
- ✅ Share to WhatsApp/Instagram/Facebook
- ✅ Offline mode (last 20 templates)
- 🚧 Video templates (Phase 2)
- 🚧 AI background removal (Phase 2)
- 🚧 Premium subscription (Phase 2)

## 📚 Documentation

- [Full PRD](./craftify_prd.md) - Complete product requirements
- [API Documentation](#) - Coming soon
- [Component Library](#) - Coming soon

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 📞 Support

- **Email:** support@craftify.com
- **Issues:** [GitHub Issues](https://github.com/yourusername/craftify/issues)

---

**Made with ❤️ for the Indian market**
**Version:** 1.0.0 (MVP)
