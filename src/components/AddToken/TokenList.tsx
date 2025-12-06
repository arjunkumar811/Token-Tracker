import React from 'react';
import type { CoinMarket } from '../../services/coingecko';
import './TokenList.css';

interface TokenListProps {
  tokens: CoinMarket[];
  selectedTokens: Set<string>;
  onSelect: (tokenId: string) => void;
  lastTokenRef: React.RefObject<HTMLDivElement | null>;
}

const TokenList: React.FC<TokenListProps> = ({
  tokens,
  selectedTokens,
  onSelect,
  lastTokenRef,
}) => {
  if (tokens.length === 0) {
    return <div className="no-results">No tokens found</div>;
  }

  return (
    <div className="token-list">
      {tokens.map((token, index) => {
        const isLast = index === tokens.length - 1;
        const isSelected = selectedTokens.has(token.id);
        return (
          <div
            key={token.id}
            ref={isLast ? lastTokenRef : null}
            className={`token-list-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(token.id)}
          >
            <div className="token-list-info">
              <img src={token.image} alt={token.name} className="token-list-logo" />
              <span className="token-list-name">
                {token.name} <span className="token-list-symbol">({token.symbol.toUpperCase()})</span>
              </span>
            </div>
            {isSelected ? (
              <div className="token-selected-indicators">
                <span className="star-icon">★</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a9e851" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" fill="#a9e851" />
                  <polyline points="8 12 11 15 16 9" stroke="#252527" strokeWidth="2.5" />
                </svg>
              </div>
            ) : (
              <button
                className="token-add-btn"
                onClick={(e) => { e.stopPropagation(); onSelect(token.id); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TokenList;
