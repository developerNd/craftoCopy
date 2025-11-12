# Assets - Fonts

This directory contains all custom fonts for the Craftify app.

## Font Requirements (from PRD)

### English Fonts (15 Google Fonts)
1. Poppins (Bold, Regular, Medium, SemiBold, Light)
2. Roboto (Bold, Regular, Medium, Light, Italic)
3. Open Sans
4. Montserrat
5. Lato
6. Raleway
7. Oswald
8. Playfair Display
9. Merriweather
10. Ubuntu
11. Bebas Neue
12. Dancing Script
13. Pacifico
14. Righteous
15. Permanent Marker

### Hindi Fonts (5 Custom Fonts)
1. Noto Sans Devanagari
2. Mukta
3. Hind
4. Poppins (supports Devanagari)
5. Tiro Devanagari Hindi

## Font Installation

### React Native
Fonts need to be linked in the project. Update `react-native.config.js`:

```javascript
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
};
```

### iOS
Run: `npx react-native-asset`

### Android
Fonts will be automatically copied to `android/app/src/main/assets/fonts/`

## Font Usage

```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
  },
});
```

## Font File Naming Convention

- Use descriptive names: `Poppins-Bold.ttf`, `Poppins-Regular.ttf`
- Always include font weight in filename
- Use `.ttf` or `.otf` format

## Font Licenses

All fonts must be properly licensed:
- Google Fonts are open source (SIL Open Font License)
- Verify license before adding custom fonts
- Include LICENSE file in this directory
