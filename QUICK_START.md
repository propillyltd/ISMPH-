# ISMPH Media Tracker - Quick Start Guide

## ✅ App is Ready!

The ISMPH Media Tracker is now fully functional with authentication, disease tracking, and a complete UI.

## 🚀 How to Run

```bash
npm run dev
```

Then scan the QR code with **Expo Go** app on your phone.

## 📱 First Time Setup

1. **Launch the app** - You'll see the authentication screen (green header)
2. **Sign Up** - Create a new account:
   - Enter your email
   - Enter a password (min 6 characters)
   - Enter your full name
   - Select role: **Public** or **Staff**
   - Select state: **Lagos**, **Abuja**, **Kano**, or **Kaduna**
   - Tap **Sign Up**

3. **Explore the Dashboard** - After signing in, you'll see:
   - Quick Actions (Create Report, Upload Media, Trending News)
   - Disease Tracker with real data from the database
   - Policy Commitments
   - Navigation tabs at the bottom

## 🎯 Key Features Working

### ✅ Authentication
- Email/password sign up and sign in
- Role-based access control
- Secure session management with Supabase

### ✅ Home Dashboard
- **Quick Actions Carousel** - 3 action cards for creating reports, uploading media, and viewing news
- **Disease Tracker** - Expandable zones showing real disease data:
  - **North Zone**: Kano, Kaduna (Cholera, Influenza, Maternal Mortality)
  - **South Zone**: Lagos (Cholera, Chicken Pox, Influenza, Maternal Mortality)
  - **Federal Zone**: Abuja (Cholera, Chicken Pox, Influenza, Maternal Mortality)
  - Each disease shows: New Cases, Total Cases, Deaths, Recovered
  - Visual recovery progress bars
  - Color-coded severity indicators
- **Policy Commitments** - 3 government policy cards
- **Pull to Refresh** - Swipe down to reload data

### ✅ Profile Tab
- User information display
- Role and state badges
- Settings menu
- Sign out functionality

### ✅ Database
The app is connected to Supabase with:
- **15 diseases** across 4 states pre-loaded
- **9 PHC facilities** with locations
- **3 policy commitments**
- **8 thematic categories**
- Row Level Security enabled

## 📊 Sample Disease Data

The database includes tracking for:
- **Cholera** - Lagos (200 cases), Abuja (150), Kano (80), Kaduna (60)
- **Influenza** - Lagos (2000 cases), Abuja (1200), Kano (900), Kaduna (600)
- **Chicken Pox** - Lagos (400), Abuja (250), Kano (180)
- **Maternal Mortality** - All states (Critical priority)

## 🎨 UI Features

- **Green & Red Theme** - Professional healthcare color scheme
- **Material Design** - Consistent spacing, typography, and shadows
- **Priority Badges** - Color-coded (Low=Green, Medium=Yellow, High=Orange, Critical=Red)
- **Responsive Cards** - Touch-friendly interface
- **Loading States** - Smooth transitions and loading indicators

## 🔐 Test Accounts

Create your own account to test! Each account can be:
- **Public** - View-only access
- **Staff** - Can create reports and upload media
- **State Admin** - Can approve reports for their state
- **Super Admin** - Full access to all features

## 📍 Available States

- **Lagos** - 3 PHC facilities
- **Abuja FCT** - 2 PHC facilities
- **Kano** - 2 PHC facilities
- **Kaduna** - 2 PHC facilities

## 🎯 What's Next?

The foundation is complete! To expand:

1. **News Feed Tab** - Add NewsAPI integration
2. **Reports Tab** - Build submission form with camera
3. **Feedback Tab** - Add PHC finder with maps
4. **Admin Features** - Analytics dashboard
5. **AI Chatbot** - Gemini AI integration

## 🐛 Troubleshooting

### White Screen?
- Check console for errors
- Make sure all dependencies are installed: `npm install`
- Verify Supabase credentials in `.env`

### Can't Sign Up?
- Use a valid email format
- Password must be at least 6 characters
- Check your internet connection

### Disease Data Not Loading?
- Make sure Supabase credentials are correct
- Check database has seed data (run migration if needed)
- Pull down to refresh

## 💡 Tips

- **Tap on zones** in Disease Tracker to expand/collapse disease cards
- **Swipe down** on dashboard to refresh data
- **Tap Quick Action cards** to navigate (some go to placeholder screens)
- **Profile tab** has sign out button at the bottom

## 📦 Tech Stack

- React Native 0.81.5
- Expo SDK 54
- Redux Toolkit for state management
- Supabase for backend (auth + database)
- TypeScript for type safety
- Lucide React Native for icons

---

**Status**: ✅ Ready for testing and development
**Environment**: Supabase database connected with seed data
**Authentication**: Working with email/password
**Navigation**: 5 tabs (Home, News, Reports, Feedback, Profile)
