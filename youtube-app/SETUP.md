# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   ```

3. **Run on Device/Simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your physical device

## Assets Setup

The app expects the following assets in the `assets/` folder:
- `icon.png` (1024x1024) - App icon
- `splash.png` (1284x2778) - Splash screen
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `favicon.png` (48x48) - Web favicon

For now, you can use placeholder images or create your own. The app will work without these assets, but you'll see warnings.

## Project Structure

- `App.js` - Main entry point with navigation setup
- `screens/` - All screen components
- `components/` - Reusable UI components
- `data/` - Mock data and utilities
- `assets/` - Images and icons

## Features

✅ Home screen with video feed
✅ Video player with native controls
✅ Search functionality
✅ Modern YouTube-like UI
✅ Bottom tab navigation
✅ Stack navigation for video details

## Notes

- Uses mock video data (replace with real API in production)
- Videos use sample URLs that may not work offline
- Customize styles in each component's StyleSheet

