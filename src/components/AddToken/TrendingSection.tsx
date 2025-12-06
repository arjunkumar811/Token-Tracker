import React from 'react';
import type { CoinMarket } from '../../services/coingecko';
import { formatPrice } from '../../utils/formatters';
import './TrendingSection.css';

interface TrendingSectionProps {
  trending: CoinMarket[];
  selectedTokens: Set<string>;
  onSelect: (tokenId: string) => void;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({
  trending,
  selectedTokens,
  onSelect,
}) => {
  return (
    <div className="trending-section">
      <h3>Trending</h3>
      <div className="trending-grid">
        {trending.map((token) => (
          <div
            key={token.id}
            className={`trending-item ${selectedTokens.has(token.id) ? 'selected' : ''}`}
            onClick={() => onSelect(token.id)}
          >
            <img src={token.image} alt={token.name} className="trending-logo" />
            <div className="trending-info">
              <span className="trending-name">{token.name}</span>
              <span className="trending-symbol">{token.symbol.toUpperCase()}</span>
            </div>
            <div className="trending-price">{formatPrice(token.current_price)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
