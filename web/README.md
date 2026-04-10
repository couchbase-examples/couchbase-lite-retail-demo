# Couchbase Lite Retail Demo

A modern retail inventory management application built with Couchbase Lite for web, featuring real-time sync capabilities with Couchbase Capella App Services.

## Features

- 📱 **Offline-First**: Full functionality without internet connection using Couchbase Lite
- 🔄 **Real-Time Sync**: Automatic bidirectional sync with Couchbase Capella App Services
- 🏪 **Multi-Store Support**: Manage inventory across multiple retail locations
- 📦 **Inventory Management**: Track products, stock levels, and orders
- 🎨 **Modern UI**: Built with React, TypeScript, and shadcn/ui components
- 🔐 **Secure**: Store-based authentication and data isolation

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Database**: Couchbase Lite for JavaScript
- **Sync**: Couchbase Capella App Services
- **Icons**: Lucide React
- **State Management**: TanStack Query

## Prerequisites

- **Node.js**: Version 18 or higher ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm**: Comes with Node.js
- **Couchbase Capella Account**: For App Services sync functionality

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/couchbase-examples/couchbase-lite-retail-demo.git
cd couchbase-lite-retail-demo/web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file and configure it with your Couchbase Capella settings:

```bash
cp .env.example .env
```

Edit `.env` and set your Couchbase App Services WebSocket URL:

```env
# Get this from your Capella App Services dashboard
# Format: wss://your-endpoint.apps.cloud.couchbase.com:4984/database-name
VITE_APP_SERVICES_URL=wss://your-endpoint.apps.cloud.couchbase.com:4984
```

**Where to find your WebSocket URL:**
1. Log into [Couchbase Capella](https://cloud.couchbase.com/)
2. Navigate to App Services
3. Select your App Services endpoint
4. Copy the complete WebSocket URL **EXCLUDING** the database path (it will be automatically inside the code based on the user selection)
   - Example: `wss://xxxxx.apps.cloud.couchbase.com:4984`

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Building for Production

Build the optimized production bundle:

```bash
npm run build
```

The built files will be in the `dist/` directory.

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
web/
├── src/
│   ├── components/        # React components
│   ├── lib/
│   │   ├── database/      # Couchbase Lite database setup and types
│   │   └── auth.ts        # Authentication helpers
│   ├── pages/             # Page components
│   └── App.tsx            # Main app component
├── public/                # Static assets
├── .env.example           # Environment variables template
└── package.json           # Dependencies and scripts
```


## Authentication

The app uses email-based authentication with the following format:
- **Email**: `{store-id}@supermarket.com` (e.g., `nyc-store-01@supermarket.com`)
- **Password**: As configured in your Capella App Services

The store ID is extracted from the email and determines:
- Which data scope the user has access to
- Store-specific inventory and orders

**Note:** The App Services URL configured in `.env` is used as-is without any modifications based on the store ID.

## Configuration

### Required Configuration

- **`VITE_APP_SERVICES_URL`**: Complete WebSocket URL for your Capella App Services endpoint (including database path)

### Application Settings (Fixed)

The following are defined in the application code and don't need to be configured:
- **Database Name**: `retail-inventory` (defined in `src/lib/database/types.ts`)
- **Database Version**: `4` (defined in `src/lib/database/types.ts`)
- **Collections**: `inventory`, `orders`, `profile`
- **Scopes**: `AA-Store`, `NYC-Store` (automatically selected based on login)

## Available Scripts

- **`npm run dev`**: Start development server with hot reload
- **`npm run build`**: Build for production
- **`npm run preview`**: Preview production build locally
- **`npm run lint`**: Run ESLint to check code quality

## Troubleshooting

### Sync Not Working

- Verify your `VITE_APP_SERVICES_URL` is correct
- Check that your App Services endpoint is running
- Ensure your credentials are valid in Capella
- Check browser console for error messages

### Build Errors

- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf dist .vite`
- Ensure Node.js version is 18 or higher: `node --version`

### TypeScript Errors

- Run: `npm run build` to see all type errors
- Ensure all dependencies are installed: `npm install`
