import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Token {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
  holdings: number;
}

interface WatchlistState {
  tokens: Token[];
  lastUpdated: number | null;
}

const initialState: WatchlistState = {
  tokens: [],
  lastUpdated: null,
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addTokens: (state, action: PayloadAction<Token[]>) => {
      const validTokens = action.payload.filter(
        (token) => token.id && token.symbol && token.name && token.image !== undefined
      );
      const newTokens = validTokens.filter(
        (newToken) => !state.tokens.some((token) => token.id === newToken.id)
      );
      state.tokens.push(...newTokens);
      state.lastUpdated = Date.now();
    },
    removeToken: (state, action: PayloadAction<string>) => {
      state.tokens = state.tokens.filter((token) => token.id !== action.payload);
      state.lastUpdated = Date.now();
    },
    updateHoldings: (state, action: PayloadAction<{ id: string; holdings: number }>) => {
      const token = state.tokens.find((t) => t.id === action.payload.id);
      if (token) {
        token.holdings = action.payload.holdings;
        state.lastUpdated = Date.now();
      }
    },
    refreshPrices: (state, action: PayloadAction<Token[]>) => {
      action.payload.forEach((updatedToken) => {
        const token = state.tokens.find((t) => t.id === updatedToken.id);
        if (token) {
          token.current_price = updatedToken.current_price;
          token.price_change_percentage_24h = updatedToken.price_change_percentage_24h;
          token.sparkline_in_7d = updatedToken.sparkline_in_7d;
        }
      });
      state.lastUpdated = Date.now();
    },
    setTokens: (state, action: PayloadAction<Token[]>) => {
      state.tokens = action.payload;
      state.lastUpdated = Date.now();
    },
  },
});

export const { addTokens, removeToken, updateHoldings, refreshPrices, setTokens } = watchlistSlice.actions;
export default watchlistSlice.reducer;
export type { Token, WatchlistState };
