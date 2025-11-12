# Craftify - User Guide & Testing Instructions

## 🎯 Overview

Craftify is now set up with fully functional image editing, export, and save to gallery features. This guide will help you test all the features.

## 📱 Available Features

### ✅ Working Features

1. **Template Browsing** - 8 diverse templates across categories
2. **Image Selection** - Pick from gallery or take photo with camera
3. **Image Replacement** - Replace placeholder images with your photos
4. **Text Editing** - Edit text, fonts, colors, and styling
5. **Export to Image** - Export templates as PNG or JPEG
6. **Save to Gallery** - Save exported templates to device gallery
7. **Share** - Share templates via WhatsApp, Instagram, etc.

## 🎨 Available Templates

We've created 8 ready-to-use templates:

### 1. Diwali Celebration (`diwali_001`)
- **Category:** Festivals
- **Features:** Circular photo placeholder, gold text
- **Use Case:** Diwali greetings with personal photo

### 2. Good Morning Wishes (`good_morning_001`)
- **Category:** Daily Wishes
- **Features:** Sunrise theme, motivational text
- **Use Case:** Daily morning greetings

### 3. Business Sale Promotion (`business_sale_001`)
- **Category:** Business (Premium)
- **Features:** Product image placeholder, sale badge
- **Use Case:** Business promotions and sales

### 4. Instagram Story (`instagram_story_001`)
- **Category:** Social Media
- **Features:** Profile photo, trendy colors
- **Use Case:** Instagram stories and posts

### 5. Wedding Invitation (`wedding_invite_001`)
- **Category:** Events (Premium)
- **Features:** Couple photo, elegant design
- **Use Case:** Wedding and event invitations

### 6. Birthday Wishes (`birthday_wish_001`)
- **Category:** Daily Wishes
- **Features:** Large photo frame, colorful background
- **Use Case:** Birthday greetings with photo

### 7. Restaurant Menu (`restaurant_menu_001`)
- **Category:** Business
- **Features:** Dish image, price, description
- **Use Case:** Restaurant daily specials and menu cards

### 8. Holi Celebration (`holi_celebration_001`)
- **Category:** Festivals
- **Features:** Colorful design, photo frame
- **Use Case:** Holi festival greetings

## 🔧 How to Test the Complete Flow

### Step 1: Setup and Run

```bash
# Install dependencies (if not done)
npm install

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Step 2: Navigate to a Template

1. Open the app
2. Skip onboarding (if shown)
3. Browse templates on the Home screen
4. Tap any template to view preview
5. Tap "Use Template" or "Edit" button

### Step 3: Add Images

**Option A: Select from Gallery**
1. Tap on any image placeholder (shows 📷 icon with "Tap to add image")
2. Image picker modal opens
3. Tap "Choose from Gallery"
4. Grant gallery permission when prompted
5. Select an image from your photos
6. Image automatically replaces placeholder

**Option B: Take Photo**
1. Tap on image placeholder
2. Tap "Take Photo"
3. Grant camera permission when prompted
4. Take a photo
5. Use the photo in template

### Step 4: Edit Text (Optional)

1. Tap on any text element
2. Text editor modal opens
3. Change the text
4. Customize font, color, size (optional)
5. Tap "Save"

### Step 5: Export Template

1. Tap the "Export" button (📤 icon) in the editor toolbar
2. You'll be taken to the Export screen
3. Choose format: PNG or JPG
4. Choose quality: 70%, 80%, 90%, or 100%
5. Tap "📤 Export Template"
6. Wait for export to complete

### Step 6: Save to Gallery

After export completes, you'll see 3 options in the alert:
1. **OK** - Just close the alert
2. **Share** - Opens share sheet to share via apps
3. **Save to Gallery** - Saves to device gallery

**Save to Gallery:**
- Tap "Save to Gallery"
- Grant storage permission if prompted (Android)
- Image is saved to your device's gallery/photos
- Success message appears
- Find the image in your Gallery/Photos app under "Craftify" album

## 🔍 Testing Checklist

Use this checklist to verify all features work:

### Image Selection & Replacement
- [ ] Tap image placeholder opens picker modal
- [ ] Camera option works and takes photo
- [ ] Gallery option shows device photos
- [ ] Selected image replaces placeholder
- [ ] Image displays correctly in template
- [ ] Can replace image again by tapping

### Text Editing
- [ ] Tap text opens editor modal
- [ ] Can change text content
- [ ] Can change font size
- [ ] Can change text color
- [ ] Can change alignment
- [ ] Changes reflect in template

### Export
- [ ] Export button navigates to export screen
- [ ] Template preview shows correctly
- [ ] Can select PNG or JPG format
- [ ] Can select quality level
- [ ] Export progress shows
- [ ] Export completes successfully

### Save to Gallery
- [ ] Save to gallery button appears after export
- [ ] Permission request shows (if needed)
- [ ] Image saves to gallery successfully
- [ ] Can find image in device gallery/photos app
- [ ] Image quality is good
- [ ] Saved image includes all edits

### Share
- [ ] Share button appears after export
- [ ] Share sheet opens with options
- [ ] Can share to WhatsApp
- [ ] Can share to Instagram
- [ ] Can share to other apps

## 🐛 Common Issues & Solutions

### Issue: Image picker doesn't open

**Solution:**
- Check if you tapped on an actual image placeholder (has 📷 icon)
- Make sure the element is not locked
- Try restarting the app

### Issue: Permission denied

**Solution:**
- Go to device Settings → Apps → Craftify → Permissions
- Enable Camera and Storage/Photos permissions
- Return to app and try again

### Issue: Image not showing after selection

**Solution:**
- Check console logs for errors
- Verify the image was actually selected
- Try selecting a different image
- Try restarting the app

### Issue: Export fails

**Solution:**
- Ensure internet is not required (all works offline)
- Check if storage space is available
- Try with lower quality setting
- Check console logs for specific error

### Issue: Save to gallery fails

**Solution:**
- Ensure storage permission is granted
- Check if storage space is available (need ~2-5MB)
- Try exporting again
- On Android 13+, ensure READ_MEDIA_IMAGES permission is granted

### Issue: Image quality is poor

**Solution:**
- Select higher quality in export options (90% or 100%)
- Use PNG format for better quality
- Ensure original image is high resolution

## 📊 Template Structure

Each template has the following structure:

```typescript
{
  id: string,              // Unique identifier
  type: 'image',           // Template type
  category: string,        // festivals, daily, business, social, events
  background: {
    type: 'color',         // color, image, or gradient
    color: string          // Hex color code
  },
  elements: [
    {
      id: string,          // Element identifier
      type: 'image' | 'text' | 'shape',
      position: { x, y },  // Position in pixels
      size: { width, height }, // Size in pixels
      placeholder: boolean, // Is image placeholder?
      editable: boolean,    // Is text editable?
      // ...other properties
    }
  ]
}
```

## 🎯 Best Practices

### For Best Image Quality
- Use high-resolution source images (at least 1080px width)
- Export as PNG for graphics/text-heavy designs
- Export as JPG for photos (smaller file size)
- Use 90-100% quality for final exports

### For Best User Experience
- Test with real photos from your device
- Try both camera and gallery options
- Test on different Android versions (especially 13+)
- Test with images of different sizes and orientations

### For Development
- Check console logs for any errors
- Monitor memory usage with large images
- Test offline functionality
- Verify all permissions are properly requested

## 📝 Notes

- **Free templates** are available without subscription
- **Premium templates** show premium badge (for future implementation)
- **Offline mode** works - no internet required for editing
- **Export limit** - Free users: unlimited (MVP), Premium: unlimited
- **Watermark** - Can be added later for free users
- **Maximum image size** - 25MB per image
- **Supported formats** - JPG, PNG, WEBP for input; PNG, JPG for export

## 🚀 Next Steps

After testing, you can:

1. **Add more templates** - Edit `MockDataService.ts`
2. **Customize colors** - Edit `constants/colors.ts`
3. **Add new features** - Follow the codebase structure
4. **Connect real backend** - Replace MockDataService with API calls
5. **Add analytics** - Implement Firebase Analytics
6. **Add monetization** - Integrate Razorpay for subscriptions

## 💡 Tips for Creating Templates

When creating new templates:

1. Use standard dimensions: 1080x1920 (9:16 portrait)
2. Place image placeholders with `placeholder: true`
3. Make text editable with `editable: true`
4. Use appropriate colors from PRD color palette
5. Add proper borders for image elements
6. Test on different screen sizes
7. Use semantic element IDs (e.g., `user_photo`, `greeting_text`)

## 🔗 Related Files

- **Templates:** `src/services/MockDataService.ts`
- **Image Picker:** `src/components/editor/ImagePickerModal.tsx`
- **Editor:** `src/screens/EditorScreen.tsx`
- **Export Service:** `src/services/ExportService.ts`
- **Export Screen:** `src/screens/ExportScreen.tsx`
- **Template Renderer:** `src/components/TemplateRenderer.tsx`
- **Editable Element:** `src/components/editor/EditableElement.tsx`

---

**Made with ❤️ for the Indian market**

For issues or questions, check the console logs and refer to the PRD document.
