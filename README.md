# Motivate Me - AI-Powered Motivational App

A React Native mobile application that helps users stay motivated and achieve their goals through AI-generated personalized messages across 8 life domains.

## 🌟 Features

### 🔐 Authentication System
- **Secure Login Flow**: User authentication with JWT token management
- **Auto-Login**: Automatic session persistence and validation
- **Mock Mode**: Test credentials for offline development
  - Username: `admin` / Password: `admin123456`
  - Username: `demo_user` / Password: `demo123`

### 🎯 Core Functionality

#### 8 Life Domains
Track and improve across comprehensive life areas:
- 🧠 **Mental Health** - Emotional intelligence and mindfulness
- 💪 **Physical Health** - Fitness and wellness
- 💼 **Career** - Professional development
- 💰 **Financial** - Money management and financial goals
- ❤️ **Relationships** - Personal connections
- 🕊️ **Spiritual** - Inner peace and purpose
- 🎨 **Creativity** - Creative expression
- 🌍 **Lifestyle** - Daily habits and routines

#### AI-Powered Messages
- Personalized motivational messages using GPT-4
- Multiple message types: motivational, supportive, challenging, reminder
- Favorite messages for quick access
- Message history with ratings
- Smart scheduling and delivery

#### Progress Tracking
- **Dashboard Stats**: Messages today, total messages, favorites, current streak
- **Goal Management**: Create, track, and complete personal goals
- **Streak System**: Maintain daily motivation streaks
- **Progress Visualization**: Track goal completion percentages

### 🎨 User Experience

#### Bilingual Support
- **Arabic** (Cairo font) - Default language with full RTL support
- **English** (Poppins font)
- Automatic language persistence

#### Theme System
- **Light Mode**: Clean and bright interface
- **Dark Mode**: Eye-friendly for night usage
- **Auto-switching**: Based on system preferences

#### Navigation
- **Home**: Dashboard with stats and quick actions
- **Goals**: Goal tracking and management
- **Inspire**: AI motivational messages
- **Messages**: Message history and favorites
- **Track**: Progress tracking
- **Profile**: Settings and account management

## 🏗️ Technical Architecture

### Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Context API
- **Navigation**: Expo Router (file-based routing)
- **Storage**: AsyncStorage for offline persistence
- **API Integration**: Sign SA API with mock data fallback
- **Icons**: Lucide React Native

### App Flow
```
Loader (Font Loading)
    ↓
Auth Check (AuthContext)
    ↓
├─ Not Authenticated → Login Screen
│                          ↓
│                    Welcome Screen
│                          ↓
└─ Authenticated ────→ Main App (Tabs)
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Gemy-star/sign_motivational_app.git
cd sign_motivational_app
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env`:
```env
EXPO_PUBLIC_USE_MOCK_DATA=true
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:6400
EXPO_PUBLIC_API_TIMEOUT=30000
EXPO_PUBLIC_DEBUG=true
```

4. **Start the development server**
```bash
npx expo start
```

5. **Run on device/emulator**
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app

### Running with Real API

1. Set `EXPO_PUBLIC_USE_MOCK_DATA=false` in `.env`
2. Update `EXPO_PUBLIC_API_BASE_URL` to your API endpoint
3. Ensure API server is running and accessible

## 📱 Usage

### Mock Login Credentials
- **Admin**: `admin` / `admin123456`
- **Demo**: `demo_user` / `demo123`

### Key Workflows

#### 1. First Time Setup
1. Launch app → See loader
2. Login with mock credentials
3. View welcome screen
4. Tap "Get Started"
5. Explore dashboard

#### 2. Daily Motivation
1. Open app → Auto-login
2. View today's stats on home
3. Tap "Get Motivated" for AI message
4. Rate and favorite messages
5. Track your streak

#### 3. Goal Management
1. Navigate to Goals tab
2. Create new goal in a life domain
3. Set target date and description
4. Update progress regularly
5. Complete and celebrate

## 🔧 Configuration

### API Configuration
Toggle between mock and real API in `.env`:
```env
# Use mock data (offline development)
EXPO_PUBLIC_USE_MOCK_DATA=true

# Use real API
EXPO_PUBLIC_USE_MOCK_DATA=false
EXPO_PUBLIC_API_BASE_URL=https://sign-sa.net
```

### Default Settings
- **Default Language**: Arabic (ar) - automatically saved when changed
- **App Name**: sign_motivational_app
- **Package Name**: sign_motivational_app

### Mock Data
When `USE_MOCK_DATA=true`, the app includes:
- 8 life scopes with descriptions
- 3 subscription packages (Free, Pro, Premium)
- 3 sample goals with progress
- 5 AI-generated messages
- Complete dashboard statistics
- 2 mock users (admin, demo_user)

## 🌐 API Integration

### Sign SA API Endpoints
- `/api/v1/auth/login/` - User authentication
- `/api/v1/dashboard/stats/` - Dashboard statistics
- `/api/v1/scopes/` - Life domains
- `/api/v1/goals/` - Goal management
- `/api/v1/messages/` - AI messages
- `/api/v1/subscriptions/` - User subscriptions

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Secure token storage
- Session persistence

## 🎨 Design System

### Typography
- **English**: Poppins (heading, body, small)
- **Arabic**: Cairo with full RTL support

### Colors
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Purple)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)
- **Info**: `#3b82f6` (Blue)

### Spacing Scale
- `xs`: 4px, `sm`: 8px, `md`: 16px
- `lg`: 24px, `xl`: 32px, `xxl`: 48px

## 🧪 Development

### Project Structure
```
├── app/                    # Main application screens
│   ├── _layout.tsx        # Root layout with auth flow
│   └── (tabs)/            # Tab-based navigation
├── screens/               # Standalone screens
│   ├── LoginScreen.tsx
│   └── WelcomeMotivationScreen.tsx
├── components/            # Reusable components
├── contexts/              # React contexts
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   ├── LanguageContext.tsx
│   └── LoadingContext.tsx
├── services/              # API and business logic
│   ├── auth.service.ts
│   ├── signsa.service.ts
│   ├── data.service.ts
│   └── mock.service.ts
├── types/api.ts           # TypeScript definitions
├── locales/               # i18n translations
│   ├── en.json
│   └── ar.json
└── hooks/                 # Custom React hooks
```

### Adding New Features
1. Update types in `types/api.ts`
2. Add mock data in `services/mock.service.ts`
3. Implement API in `services/signsa.service.ts`
4. Update unified service `services/data.service.ts`
5. Add translations in `locales/en.json` and `locales/ar.json`
6. Create/update UI components

### Testing
```bash
# Run with mock data
npm start

# Test with different users
# admin / admin123456 (full access)
# demo_user / demo123 (demo access)
```

## 📦 Build & Deployment

### Android
```bash
# Development build
npx expo run:android

# Production build
eas build --platform android --profile production
```

### iOS
```bash
# Development build
npx expo run:ios

# Production build
eas build --platform ios --profile production
```

## 🐛 Troubleshooting

### Common Issues

**Login not working?**
- Ensure `EXPO_PUBLIC_USE_MOCK_DATA=true` in `.env`
- Use correct credentials: `admin` / `admin123456`

**API errors?**
- Check `EXPO_PUBLIC_API_BASE_URL` in `.env`
- Verify API server is running
- Check network connectivity

**Translations missing?**
- Verify locale files in `locales/`
- Check translation keys match usage

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Authors

**Gemy-star**
- GitHub: [@Gemy-star](https://github.com/Gemy-star)

## 🙏 Acknowledgments

- Sign SA API for backend services
- Expo team for the framework
- React Native community
- OpenAI for GPT-4 integration

---

**Built with ❤️ using React Native & Expo**
