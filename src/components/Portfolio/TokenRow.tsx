import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { Token } from '../../store/slices/watchlistSlice';
import { updateHoldings, removeToken } from '../../store/slices/watchlistSlice';
import { calculateTokenValue } from '../../utils/calculations';
import { formatPrice, formatPercentage, formatCurrency } from '../../utils/formatters';
import Sparkline from '../common/Sparkline';
import './TokenRow.css';

interface TokenRowProps {
  token: Token;
}

const TokenRow: React.FC<TokenRowProps> = ({ token }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [holdingsValue, setHoldingsValue] = useState(token.holdings.toString());
  const [showMenu, setShowMenu] = useState(false);

  const handleHoldingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHoldingsValue(e.target.value);
  };

  const handleSaveHoldings = () => {
    const newHoldings = parseFloat(holdingsValue) || 0;
    dispatch(updateHoldings({ id: token.id, holdings: newHoldings }));
    setIsEditing(false);
  };

  const handleHoldingsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveHoldings();
    } else if (e.key === 'Escape') {
      setHoldingsValue(token.holdings.toString());
      setIsEditing(false);
    }
  };

  const handleStartEditing = () => {
    setHoldingsValue(token.holdings.toString());
    setIsEditing(true);
  };

  const handleRemove = () => {
    dispatch(removeToken(token.id));
    setShowMenu(false);
  };

  const value = calculateTokenValue(token);
  const priceChangeClass = token.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
  const sparklineColor = token.price_change_percentage_24h >= 0 ? '#10B981' : '#EF4444';

  return (
    <tr className="token-row">
      <td className="token-info">
        <img src={token.image} alt={token.name} className="token-logo" />
        <div className="token-details">
          <span className="token-name">{token.name} <span className="token-symbol">({token.symbol.toUpperCase()})</span></span>
        </div>
      </td>
      <td className="token-price">{formatPrice(token.current_price)}</td>
      <td className={`token-change ${priceChangeClass}`}>
        {formatPercentage(token.price_change_percentage_24h)}
      </td>
      <td className="token-sparkline">
        {token.sparkline_in_7d?.price && (
          <Sparkline data={token.sparkline_in_7d.price} color={sparklineColor} />
        )}
      </td>
      <td className="token-holdings">
        {isEditing ? (
          <div className="holdings-edit-container">
            <div className="holdings-input-wrapper">
              <input
                type="number"
                value={holdingsValue}
                onChange={handleHoldingsChange}
                onKeyDown={handleHoldingsKeyDown}
                autoFocus
                className="holdings-input"
                placeholder="Select"
              />
              <span className="holdings-dropdown-icon">▾</span>
            </div>
            <button className="holdings-save-btn" onClick={handleSaveHoldings}>
              Save
            </button>
          </div>
        ) : (
          <span onClick={handleStartEditing} className="holdings-value">
            {token.holdings.toFixed(4)}
          </span>
        )}
      </td>
      <td className="token-value">{formatCurrency(value)}</td>
      <td className="token-actions">
        <button
          className="menu-button"
          onClick={() => setShowMenu(!showMenu)}
        >
          ···
        </button>
        {showMenu && (
          <>
            <div className="menu-overlay" onClick={() => setShowMenu(false)} />
            <div className="action-menu">
              <button onClick={() => { handleStartEditing(); setShowMenu(false); }} className="edit-button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Holdings
              </button>
              <button onClick={handleRemove} className="remove-button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Remove
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
};

export default TokenRow;
