# NomiSafe Web Application

React web application for NomiSafe - Insurance Management Platform

## Features

- User Authentication (Phone & OTP)
- Policy Management (Life, Health, Property Insurance)
- Policy Upload and AI Extraction
- Aadhaar Verification
- Profile Management
- Safe Vault
- Tutorials

## Getting Started

### Prerequisites

- Node.js >= 14.x
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

## Project Structure

```
nomisafe-web/
├── public/
├── src/
│   ├── components/       # Reusable components
│   ├── screens/          # Screen components
│   ├── services/         # API services
│   ├── contexts/         # React contexts
│   ├── store/            # Redux store
│   ├── config/           # Configuration files
│   ├── utils/            # Utility functions
│   └── styles/           # Global styles
├── package.json
└── README.md
```

## API Configuration

Update the API base URL in `src/config/api.js` to match your backend server.

## License

Private
