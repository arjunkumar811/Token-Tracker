import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addTokens } from '../../store/slices/watchlistSlice';
import type { CoinMarket } from '../../services/coingecko';
import { coingeckoService } from '../../services/coingecko';
import SearchInput from './SearchInput';
import TokenList from './TokenList';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './AddTokenModal.css';

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTokenModal: React.FC<AddTokenModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set());
  const [allCoins, setAllCoins] = useState<CoinMarket[]>([]);
  const [displayedCoins, setDisplayedCoins] = useState<CoinMarket[]>([]);
  const [trending, setTrending] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastTokenRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const coinsData = await coingeckoService.getAllCoins(1);
      const validCoins = coinsData.filter((coin) => coin.id && coin.symbol && coin.name);
      setAllCoins(validCoins);
      setDisplayedCoins(validCoins);
      setTrending(validCoins.slice(0, 10));
    } catch (err) {
      setError('Failed to load tokens. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setDisplayedCoins(allCoins);
      } else {
        const filtered = allCoins.filter(
          (coin) =>
            coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setDisplayedCoins(filtered);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, allCoins]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, [loading, searchQuery]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleTokenSelect = (tokenId: string) => {
    setSelectedTokens((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tokenId)) {
        newSet.delete(tokenId);
      } else {
        newSet.add(tokenId);
      }
      return newSet;
    });
  };

  const handleAddToWatchlist = () => {
    const allAvailableCoins = searchQuery ? displayedCoins : [...trending, ...allCoins];
    const uniqueCoins = Array.from(
      new Map(allAvailableCoins.map(coin => [coin.id, coin])).values()
    );
    
    const tokensToAdd = uniqueCoins
      .filter((coin) => selectedTokens.has(coin.id))
      .map((coin) => {
        const token: CoinMarket & { holdings: number } = {
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image || '',
          current_price: coin.current_price ?? 0,
          price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
          sparkline_in_7d: coin.sparkline_in_7d || { price: [] },
          holdings: 0,
        };
        return token;
      });

    if (tokensToAdd.length > 0) {
      dispatch(addTokens(tokensToAdd));
    }
    setSelectedTokens(new Set());
    setSearchQuery('');
    onClose();
  };

  const handleClose = () => {
    setSelectedTokens(new Set());
    setSearchQuery('');
    onClose();
  };

  if (!isOpen) return null;

  const tokensToShow = searchQuery ? displayedCoins : (trending.length > 0 ? trending : displayedCoins.slice(0, 10));

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <SearchInput value={searchQuery} onChange={handleSearchChange} />

        {error && <ErrorMessage message={error} />}

        <div className="modal-body">
          {!searchQuery && <div className="section-label">Trending</div>}

          {loading && tokensToShow.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <TokenList
              tokens={tokensToShow}
              selectedTokens={selectedTokens}
              onSelect={handleTokenSelect}
              lastTokenRef={lastTokenRef}
            />
          )}

          {loading && tokensToShow.length > 0 && (
            <div className="loading-more">Loading more...</div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="add-to-watchlist-btn"
            onClick={handleAddToWatchlist}
            disabled={selectedTokens.size === 0}
          >
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTokenModal;
