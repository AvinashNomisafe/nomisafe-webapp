# NomiSafe Web Application - Setup Guide

## Project Overview

This is a React web application that mirrors the functionality of the NomiSafe React Native mobile app. It provides a complete insurance management platform with the following features:

### Features Implemented

✅ **Authentication**

- Phone number + OTP login
- JWT token management
- Auto token refresh
- Protected routes

✅ **Policy Management**

- Upload insurance policies (PDF)
- View all policies (Life, Health, Property)
- AI extraction status tracking
- Policy details view
- Filter by insurance type

✅ **User Profile**

- View and edit profile
- Aadhaar verification
- Logout functionality

✅ **Insurance Types**

- Life Insurance
- Health Insurance
- Property Insurance

✅ **Additional Features**

- Safe Vault (document storage)
- Services information
- Tutorials and guides
- Responsive design
- Bottom navigation

### Technology Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Redux Toolkit** - State management
- **Axios** - API calls
- **CSS3** - Styling (no CSS-in-JS or preprocessors)
- **Plain JavaScript** - No TypeScript

### Project Structure

```
nomisafe-web/
├── public/
│   └── index.html
├── src/
│   ├── components/           # Reusable components
│   │   ├── AppHeader.js
│   │   ├── BottomNavigation.js
│   │   └── common/
│   │       └── Loading.js
│   ├── screens/              # Screen components
│   │   ├── PhoneLoginScreen.js
│   │   ├── OTPVerificationScreen.js
│   │   ├── HomeScreen.js
│   │   ├── MyPolicyScreen.js
│   │   ├── PolicyDetailScreen.js
│   │   ├── PolicyVerificationScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── LifeInsuranceScreen.js
│   │   ├── HealthInsuranceScreen.js
│   │   ├── PropertiesScreen.js
│   │   ├── ServiceScreen.js
│   │   ├── SafeVaultScreen.js
│   │   ├── TutorialsScreen.js
│   │   └── AadhaarVerificationScreen.js
│   ├── services/             # API services
│   │   ├── auth.js
│   │   ├── policy.js
│   │   └── profile.js
│   ├── contexts/             # React contexts
│   │   └── AuthContext.js
│   ├── store/                # Redux store
│   │   ├── store.js
│   │   └── authSlice.js
│   ├── config/               # Configuration
│   │   └── api.js
│   ├── utils/                # Utilities
│   │   └── authStorage.js
│   ├── styles/               # Global styles
│   │   └── global.css
│   ├── App.js                # Main app component
│   └── index.js              # Entry point
├── package.json
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js >= 14.x
- npm or yarn
- Backend server running (see backend setup)

### Installation

1. Navigate to the web app directory:

```bash
cd nomisafe-web
```

2. Install dependencies:

```bash
npm install
```

3. Configure API endpoint:

   - Open `src/config/api.js`
   - Set `ENVIRONMENT` to 'DEVELOPMENT' or 'PRODUCTION'
   - Update `LOCAL_API_URL` if your backend runs on a different port

4. Start the development server:

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `build/` directory.

## API Configuration

The app connects to the same Django backend as the React Native app:

**Development:** `http://localhost:8000/api`
**Production:** `http://51.20.84.242/api`

To switch environments, edit `src/config/api.js`:

```javascript
const ENVIRONMENT = "DEVELOPMENT"; // or 'PRODUCTION'
```

## Features by Screen

### Authentication Flow

1. **Phone Login** - Enter 10-digit phone number
2. **OTP Verification** - Enter 6-digit OTP
3. Auto-login on successful verification

### Home Screen

- Welcome message
- Insurance type cards (Life, Health, Property)
- Quick actions (Upload Policy, Verify Aadhaar, Tutorials)

### My Policy Screen

- View all policies
- Filter by type (All, Life, Health, Pending)
- Policy status badges (Processing, Expired, Failed)
- FAB button for quick upload

### Policy Detail Screen

- Complete policy information
- Coverage details
- Nominees
- Benefits
- Exclusions

### Profile Screen

- View/Edit personal information
- Aadhaar verification status
- Logout

### Policy Upload

- Upload PDF documents
- AI extraction progress
- Auto-redirect to policy list

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Responsiveness

The app is fully responsive and works on:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## State Management

- **Redux** - Global auth state
- **React Context** - Auth context for components
- **Local Storage** - Persistent auth tokens

## Security

- JWT token authentication
- Auto token refresh
- Protected routes
- Secure API calls
- CORS handling

## Troubleshooting

### Common Issues

**1. API Connection Failed**

- Check backend server is running
- Verify API_BASE_URL in `src/config/api.js`
- Check CORS settings in backend

**2. Login Issues**

- Clear browser localStorage
- Check backend OTP service is working
- Verify phone number format (+91)

**3. Build Errors**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Notes

- All files use plain JavaScript (`.js` extension)
- No TypeScript or JSX
- CSS files are separate (not CSS-in-JS)
- Components use React Hooks
- Functional components only (no class components)

## Testing

Run tests:

```bash
npm test
```

## Deployment

### Deploy to Production

1. Build the app:

```bash
npm run build
```

2. Deploy the `build/` directory to your web server (Nginx, Apache, etc.)

3. Configure server to handle client-side routing (SPA)

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Environment Variables

Create `.env` file for environment-specific configs:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

Access in code:

```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

## Support

For issues or questions:

- Check the React Native app for reference implementation
- Review backend API documentation
- Check browser console for errors

## License

Private - All rights reserved
