# 🪙 Token Portfolio

A modern, responsive cryptocurrency portfolio tracker built with React, TypeScript, and Web3 integration.

## ✨ Features

- **📊 Portfolio Dashboard** - Real-time portfolio tracking with visual donut chart
- **⭐ Watchlist Management** - Add, remove, and manage your favorite tokens
- **💰 Holdings Tracking** - Edit token holdings and view calculated values
- **📈 Live Price Data** - Auto-refresh cryptocurrency prices from CoinGecko API
- **💼 Wallet Integration** - Connect Web3 wallets (MetaMask, WalletConnect, etc.)
- **💾 Data Persistence** - Portfolio automatically saved to browser localStorage
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v20.18+)
- npm or yarn

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Application will be available at http://localhost:5173
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🏗️ Technical Architecture

### Frontend Stack

- **React 19.2.0** - Modern UI framework with TypeScript
- **Redux Toolkit** - State management with localStorage persistence
- **Vite 7.2.4** - Lightning-fast build tool and dev server
- **Recharts** - Data visualization (donut charts, sparklines)
- **wagmi + RainbowKit** - Web3 wallet connection
- **Axios** - HTTP client with retry logic

### API Integration

**CoinGecko Free API** (`https://api.coingecko.com/api/v3/`)
- Market data, prices, 24h changes, 7-day sparklines
- Rate limiting: 5-second throttling with request queue
- Vite proxy configured to bypass CORS
- Custom retry logic with exponential backoff

### Key Components

```
src/
├── components/
│   ├── Portfolio/          # Dashboard, table, charts
│   ├── AddToken/           # Token search & selection modal
│   ├── Wallet/             # Web3 wallet connection
│   └── common/             # Reusable components
├── services/
│   └── coingecko.ts        # API client with rate limiting
├── store/
│   ├── slices/             # Redux state management
│   └── middleware/         # localStorage persistence
└── utils/                  # Calculations & formatters
```

### State Management

- **Redux Store**: Centralized state for watchlist and wallet
- **localStorage Middleware**: Auto-saves portfolio data
- **Actions**: `addTokens`, `removeToken`, `updateHoldings`, `refreshPrices`

### Data Flow

```
User Action → Redux Action → API Call (if needed) → 
Update State → localStorage Save → UI Update
```

## 🎨 Design System

**Color Palette:**
- Background: `#252527`
- Cards: `#2a2a2c`
- Primary/Accent: `#a9e851`
- Borders: `#3a3a3c`
- Text: `#FFFFFF`, `#E5E7EB`, `#9CA3AF`, `#6B7280`

**Responsive Breakpoints:**
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🔧 Configuration

### Environment Variables
No environment variables required - uses public CoinGecko API.

### Vite Proxy
```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'https://api.coingecko.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '/api/v3')
  }
}
```

## 🌐 Blockchain Support

Wallet connection supports:
- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum

*(Display only - no transactions)*

## ⚡ Performance Optimizations

- Debounced search (300ms)
- Memoized portfolio calculations
- Efficient re-renders with React hooks
- Loads 50 tokens max (no infinite scroll)
- Request queuing to prevent API rate limits

## 📝 API Rate Limiting

CoinGecko Free Tier has strict limits:
- 5-second minimum interval between requests
- Max 50 calls/minute
- Exponential backoff on 429 errors
- Request queue management

## 🐛 Known Limitations

- No real-time WebSocket updates (manual refresh needed)
- Client-side only (no backend database)
- Portfolio calculations based on user-entered holdings
- Free API tier has rate restrictions

## 📄 License

MIT

## 🤝 Contributing

Built as a production-ready MVP demonstrating modern React development practices.

