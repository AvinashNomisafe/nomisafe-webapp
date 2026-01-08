# NomiSafe Web App - Quick Reference

## 🚀 Quick Start

```bash
# Navigate to the web app directory
cd nomisafe-web

# Install dependencies (first time only)
npm install

# Start the development server
npm start

# Or use the quick start script
./start.sh
```

## 📁 Project Structure

```
nomisafe-web/
├── src/
│   ├── App.js                    # Main app with routing
│   ├── index.js                  # Entry point
│   │
│   ├── components/               # Reusable components
│   │   ├── AppHeader.js          # Top navigation bar
│   │   ├── BottomNavigation.js   # Bottom tab bar
│   │   └── common/
│   │       └── Loading.js        # Loading spinner
│   │
│   ├── screens/                  # Page components
│   │   ├── PhoneLoginScreen.js
│   │   ├── OTPVerificationScreen.js
│   │   ├── HomeScreen.js
│   │   ├── MyPolicyScreen.js
│   │   ├── PolicyDetailScreen.js
│   │   ├── PolicyVerificationScreen.js
│   │   ├── ProfileScreen.js
│   │   └── ...
│   │
│   ├── services/                 # API layer
│   │   ├── auth.js               # Authentication APIs
│   │   ├── policy.js             # Policy management APIs
│   │   └── profile.js            # Profile APIs
│   │
│   ├── contexts/
│   │   └── AuthContext.js        # Authentication context
│   │
│   ├── store/                    # Redux store
│   │   ├── store.js
│   │   └── authSlice.js
│   │
│   ├── config/
│   │   └── api.js                # API configuration
│   │
│   ├── utils/
│   │   └── authStorage.js        # localStorage utilities
│   │
│   └── styles/
│       └── global.css            # Global styles
│
├── public/
│   └── index.html
│
├── package.json
├── README.md
├── SETUP_GUIDE.md
├── COMPARISON.md
└── start.sh
```

## 🔑 Key Files to Customize

### API Configuration

**File:** `src/config/api.js`

```javascript
const ENVIRONMENT = "DEVELOPMENT"; // Change to 'PRODUCTION'
const LOCAL_API_URL = "http://localhost:8000/api"; // Your backend URL
```

### Color Theme

**File:** `src/styles/global.css`

```css
:root {
  --primary-color: #4db6ac; /* Main brand color */
  --primary-dark: #00897b; /* Dark variant */
  --primary-light: #80cbc4; /* Light variant */
  --secondary-color: #ff6b6b; /* Accent color */
}
```

## 🛣️ Routes

### Public Routes (Unauthenticated)

- `/login` - Phone login
- `/otp-verification` - OTP verification

### Protected Routes (Authenticated)

- `/home` - Dashboard
- `/my-policy` - All policies
- `/policy-detail/:id` - Policy details
- `/policy-verification` - Upload policy
- `/profile` - User profile
- `/life-insurance` - Life insurance info
- `/health-insurance` - Health insurance info
- `/properties` - Property insurance info
- `/service` - Services
- `/safe-vault` - Document vault
- `/tutorials` - Help & tutorials
- `/aadhaar-verification` - Aadhaar verification

## 🔐 Authentication Flow

1. User enters phone number → `POST /auth/request-otp/`
2. User enters OTP → `POST /auth/verify-otp/`
3. Receive JWT tokens (access + refresh)
4. Store in localStorage
5. Set Authorization header for all requests
6. Auto-refresh on token expiry

## 📦 Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "react-redux": "^9.0.0",
  "@reduxjs/toolkit": "^2.0.0",
  "axios": "^1.6.0",
  "react-scripts": "5.0.1"
}
```

## 🎨 Component Patterns

### Screen Component Template

```javascript
import React from "react";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const MyScreen = () => {
  return (
    <div className="screen">
      <AppHeader title="Screen Title" showBack={true} />
      <div className="container">{/* Your content */}</div>
      <BottomNavigation />
    </div>
  );
};

export default MyScreen;
```

### API Service Template

```javascript
import { authApi } from "./auth";

export const myApiFunction = async (data) => {
  try {
    const response = await authApi.post("/endpoint/", data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Operation failed");
  }
};
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🏗️ Building

```bash
# Create production build
npm run build

# Output: build/ directory
# Deploy this folder to your web server
```

## 🐛 Debugging

### Check API Calls

Open browser DevTools (F12) → Network tab

### Check Redux State

Install Redux DevTools extension

### Check localStorage

DevTools → Application → Local Storage

### Clear Cache

```javascript
localStorage.clear();
// Or
localStorage.removeItem("nomisafe_auth");
```

## 🔧 Common Tasks

### Add a New Screen

1. Create `src/screens/NewScreen.js`
2. Create `src/screens/NewScreen.css`
3. Add route in `src/App.js`
4. Add navigation link where needed

### Add a New API Service

1. Add function in `src/services/yourService.js`
2. Import and use in components
3. Handle errors appropriately

### Update API Endpoint

1. Open `src/config/api.js`
2. Change `LOCAL_API_URL` or `PRODUCTION_API_URL`
3. Restart dev server

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  /* Mobile styles */
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1199px) {
  /* Tablet styles */
}

/* Desktop */
@media (min-width: 1200px) {
  /* Desktop styles */
}
```

## 🚨 Troubleshooting

### "Module not found" Error

```bash
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues

1. Check backend is running: `http://localhost:8000`
2. Check CORS settings in backend
3. Verify API_BASE_URL in `src/config/api.js`

### Login Not Working

1. Clear localStorage
2. Check backend OTP service
3. Verify phone number format (+91 prefix)

### Build Fails

```bash
# Clear React Scripts cache
rm -rf node_modules/.cache
npm run build
```

## 📚 Documentation

- **SETUP_GUIDE.md** - Complete setup instructions
- **COMPARISON.md** - React Native vs Web comparison
- **README.md** - Project overview

## 🎯 Development Workflow

1. **Start backend:** `cd nomisafe-backend && python manage.py runserver`
2. **Start web app:** `cd nomisafe-web && npm start`
3. **Make changes:** Edit files in `src/`
4. **Hot reload:** Changes reflect automatically
5. **Test:** Verify in browser
6. **Commit:** Git commit your changes

## 💡 Tips

- Use browser DevTools for debugging
- Check Network tab for API calls
- Console logs are visible in browser console
- React DevTools extension is helpful
- Redux DevTools for state inspection

## 🆘 Getting Help

1. Check console for errors
2. Review documentation files
3. Compare with React Native implementation
4. Check backend API logs
5. Test API endpoints with Postman

## ✅ Checklist for Deployment

- [ ] Update API_BASE_URL to production
- [ ] Run `npm run build`
- [ ] Test build locally: `npx serve -s build`
- [ ] Configure web server (Nginx/Apache)
- [ ] Set up SSL certificate
- [ ] Test all features in production
- [ ] Monitor error logs
- [ ] Set up analytics (optional)

---

**Happy Coding! 🚀**
