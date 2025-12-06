import { configureStore } from '@reduxjs/toolkit';
import watchlistReducer from './slices/watchlistSlice';
import walletReducer from './slices/walletSlice';
import { localStorageMiddleware, loadState } from './middleware/localStorageMiddleware';

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    wallet: walletReducer,
  },
  ...(preloadedState && { preloadedState }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware as any),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
