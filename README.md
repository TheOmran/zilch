# Zilch Demo App 👋

This is a demo application created for an interview with Zilch, built using [Expo](https://expo.dev). The app demonstrates a simple banking interface with two main screens:

- **Login Screen**: A mocked authentication screen that simulates user login
- **Home Screen**: Displays user's card details and transaction history, fetched from a random API

## Features

- Animated header with card details
- Transaction list with pull-to-refresh
- Error handling and loading states
- Haptic feedback

## Getting Started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## Running the App

You can run the app on:

- iOS Simulator
- Android Emulator 
- Physical device using Expo Go

The app will start on the login screen where you can fill any random email/password and tap the login button to access the home screen. On the home screen, you'll see:

- A card component showing balance and card details
- A scrollable list of transactions
- Pull-to-refresh functionality to reload data
- Animated header that responds to scroll position

## Technical Details

- Built with Expo and React Native
- Uses React Query for data fetching
- Implements React Native Reanimated for smooth animations
- Styled with styled-components
- Uses file-based routing

## API Integration

The app integrates with a random data API to simulate:
- Fetching card details
- Loading transaction history

Note: Since this is a demo app, the data is randomly generated on each refresh.
