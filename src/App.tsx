import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store';
import { refreshPrices, type Token } from './store/slices/watchlistSlice';
import { coingeckoService } from './services/coingecko';
import PortfolioHeader from './components/Portfolio/PortfolioHeader';
import WatchlistTable from './components/Portfolio/WatchlistTable';
import AddTokenModal from './components/AddToken/AddTokenModal';
import WalletButton from './components/Wallet/WalletButton';
import './App.css';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { tokens } = useSelector((state: RootState) => state.watchlist);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefreshPrices = async () => {
    if (tokens.length === 0) return;

    try {
      const ids = tokens.map((token: Token) => token.id);
      const updatedTokens = await coingeckoService.getMarkets(ids);
      const tokensWithHoldings = updatedTokens.map((updated) => {
        const existing = tokens.find((t: Token) => t.id === updated.id);
        return {
          ...updated,
          holdings: existing?.holdings || 0
        };
      });
      dispatch(refreshPrices(tokensWithHoldings));
    } catch (error) {
      console.error('Failed to refresh prices:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="6" fill="#a9e851"/>
                <path d="M7 11L11 15L18 8" stroke="#252527" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>Token Portfolio</h1>
          </div>
          <WalletButton />
        </div>
      </header>

      <main className="app-main">
        <PortfolioHeader />
        <WatchlistTable
          onAddToken={() => setIsModalOpen(true)}
          onRefresh={handleRefreshPrices}
        />
      </main>

      <AddTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default App;
