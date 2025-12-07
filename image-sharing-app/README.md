# Image Sharing App

A React Native Expo app for picking, viewing, and sharing images. Built with Expo SDK 54 and JavaScript.

## Features

- 📷 Pick images from gallery
- 📸 Take photos with camera
- 👁️ View selected images
- 📤 Share images with other apps
- 📚 View recent image history

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the App

1. Start the Expo development server:
```bash
npm start
```

2. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## Platform-Specific Notes

### iOS
- Camera and photo library permissions are requested automatically
- Works on both iPhone and iPad

### Android
- Requires camera and storage permissions (configured in app.json)
- Tested on Android 5.0+

## Project Structure

```
image-sharing-app/
├── App.js              # Main application component
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
├── babel.config.js     # Babel configuration
└── README.md           # This file
```

## Technologies Used

- React Native
- Expo SDK 54
- expo-image-picker
- expo-sharing
- JavaScript

## License

MIT

