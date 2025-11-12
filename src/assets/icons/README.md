# Assets - Icons

This directory contains custom icon assets for the Craftify app.

## Icon Library

The app uses **react-native-vector-icons** for most icons.

Available icon sets:
- MaterialIcons (default)
- MaterialCommunityIcons
- FontAwesome
- Ionicons
- Feather

## Custom Icons

Place any custom SVG icons in this directory that are not available in the vector icon libraries.

### Custom Icon Guidelines

1. Use SVG format for scalability
2. Optimize SVGs using SVGO
3. Use viewBox for proper scaling
4. Remove unnecessary metadata
5. Use descriptive filenames

## Usage Examples

### Vector Icons
```typescript
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

<MaterialIcons name="favorite" size={24} color="#6200EE" />
```

### Custom SVG Icons
```typescript
import { SvgXml } from 'react-native-svg';
import customIcon from './assets/icons/custom-icon.svg';

<SvgXml xml={customIcon} width={24} height={24} />
```

## Icon Sizes (from PRD)

- xs: 16px
- sm: 20px
- md: 24px (default)
- lg: 32px
- xl: 48px

## Icon Colors

Use theme colors from `src/constants/colors.ts` for consistency.
