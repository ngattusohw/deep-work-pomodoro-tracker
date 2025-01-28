# Deep Work Tracker

A mobile application built with React Native and Expo to help users track and improve their deep work sessions. Deep work, coined by Cal Newport, refers to the ability to focus without distraction on a cognitively demanding task.

## Features

- Track deep work sessions with timer functionality
- View detailed statistics and progress over time
- Set daily and weekly deep work goals
- Authentication using Expo Auth Session
- Data persistence with Supabase
- Cross-platform support (iOS and Android)

## Tech Stack

- React Native
- Expo
- TypeScript
- Supabase (Backend and Authentication)
- React Navigation (Bottom Tabs and Native Stack)

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd deep-work-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
Create a `.env` file in the root directory and add your Supabase credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Running the App

Start the development server:
```bash
npm start
# or
yarn start
```

This will open the Expo development tools in your browser. From there, you can:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with your phone (requires Expo Go app)

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Start the app in iOS simulator
- `npm run android` - Start the app in Android emulator
- `npm run web` - Start the app in web browser

## Project Structure

```
deep-work-tracker/
├── app/                 # Main application code
├── assets/             # Images, fonts, and other static files
├── components/         # Reusable React components
├── navigation/         # Navigation configuration
├── screens/           # Screen components
├── services/          # API and other services
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Dependencies

### Main Dependencies
- expo: ~52.0.17
- react: 18.3.1
- react-native: 0.76.6
- @supabase/supabase-js: ^2.39.3
- expo-router: ~4.0.17

### Navigation
- @react-navigation/bottom-tabs: ^6.5.11
- @react-navigation/native: ^6.1.9
- @react-navigation/native-stack: ^6.9.17

### Authentication & Security
- expo-auth-session: ~6.0.2
- expo-secure-store: ~14.0.1

### UI & Device Features
- @expo/vector-icons: ^14.0.0
- expo-device: ~7.0.2
- expo-navigation-bar: ^4.0.7
- expo-status-bar: ~2.0.1

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.