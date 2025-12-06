import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Token } from '../../store/slices/watchlistSlice';
import TokenRow from './TokenRow';
import './WatchlistTable.css';

interface WatchlistTableProps {
  onAddToken: () => void;
  onRefresh: () => void;
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({ onAddToken, onRefresh }) => {
  const { tokens } = useSelector((state: RootState) => state.watchlist);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalItems = tokens.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentTokens = tokens.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h2>Watchlist</h2>
        <div className="watchlist-actions">
          <button className="refresh-button" onClick={onRefresh}>
            <span className="btn-icon">↻</span>
            Refresh Prices
          </button>
          <button className="add-token-button" onClick={onAddToken}>
            <span className="btn-icon">+</span>
            Add Token
          </button>
        </div>
      </div>

      {tokens.length === 0 ? (
        <div className="empty-state">
          <p>No tokens in your watchlist</p>
          <button className="add-first-token" onClick={onAddToken}>
            Add your first token
          </button>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="watchlist-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Price</th>
                  <th>24h %</th>
                  <th>Sparkline (7d)</th>
                  <th>Holdings</th>
                  <th>Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentTokens.map((token: Token) => (
                  <TokenRow key={token.id} token={token} />
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="pagination-footer">
            <div className="pagination-info">
              1 of {totalPages} pages
            </div>
            <div className="pagination-controls">
              <button 
                className="pagination-btn" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <button 
                className="pagination-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WatchlistTable;
