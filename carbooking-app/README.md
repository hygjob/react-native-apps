# Car Booking App

A modern React Native car booking application built with Expo SDK 54.

## Features

- 🚗 Browse available cars with beautiful UI
- 🔍 Search and filter cars
- 📱 View detailed car information
- 📅 Book cars with date selection
- 📋 View booking history
- 💳 Calculate rental costs automatically

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

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
   - Scan QR code with Expo Go app on your device

## Project Structure

```
carbooking-app/
├── App.js                 # Main app entry point
├── screens/               # Screen components
│   ├── HomeScreen.js
│   ├── CarDetailsScreen.js
│   ├── BookingScreen.js
│   └── BookingsHistoryScreen.js
├── components/            # Reusable components
│   └── CarCard.js
├── data/                  # Data files
│   └── cars.js
└── assets/               # Images and assets
```

## Technologies Used

- React Native
- Expo SDK 54
- React Navigation
- Expo Linear Gradient
- JavaScript

## License

MIT

