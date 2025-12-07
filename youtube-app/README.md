# YouTube App

A YouTube-like mobile application built with React Native and Expo SDK 54.

## Features

- 🏠 **Home Screen**: Browse a curated list of videos with thumbnails, titles, and metadata
- ▶️ **Video Player**: Full-featured video player with native controls
- 🔍 **Search**: Search videos by title, channel name, or description
- 📱 **Modern UI**: Clean, YouTube-inspired interface design
- 🎨 **Beautiful Design**: Material Design icons and smooth animations

## Tech Stack

- **React Native**: 0.76.5
- **Expo SDK**: ~54.0.0
- **React Navigation**: For screen navigation
- **Expo AV**: For video playback
- **Material Icons**: For UI icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (will be installed automatically)
- iOS Simulator (for Mac) or Android Emulator (or Expo Go app on your phone)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Project Structure

```
youtube-app/
├── App.js                 # Main app component with navigation
├── screens/
│   ├── HomeScreen.js      # Home screen with video list
│   ├── VideoPlayerScreen.js # Video player screen
│   └── SearchScreen.js    # Search functionality
├── components/
│   └── VideoCard.js       # Reusable video card component
├── data/
│   └── mockVideos.js      # Mock video data
├── assets/                # Images and icons
└── package.json          # Dependencies and scripts
```

## Features in Detail

### Home Screen
- Displays a list of videos in a scrollable feed
- Shows video thumbnail, title, channel name, views, and upload date
- YouTube-style header with logo and action buttons
- Tap on any video to play it

### Video Player
- Full-screen video playback with native controls
- Video metadata (title, views, upload date)
- Action buttons (Like, Dislike, Share, Save)
- Channel information with subscribe button
- Video description

### Search Screen
- Real-time search functionality
- Filters videos by title, channel, or description
- Empty state when no results found
- Clean search interface

## Customization

### Adding Real Video Data

Replace the mock data in `data/mockVideos.js` with real YouTube API data or your own video source.

### Styling

Modify the StyleSheet objects in each component file to customize the appearance.

## Notes

- This app uses mock video data for demonstration purposes
- Video URLs point to sample videos that are publicly available
- For production use, you'll need to integrate with the YouTube API or your own video service

## License

MIT

## Author

Created with ❤️ using React Native and Expo

