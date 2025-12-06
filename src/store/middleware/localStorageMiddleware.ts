import type { Middleware } from '@reduxjs/toolkit';

const STORAGE_KEY = 'token-portfolio-state';

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  const state = store.getState();
  
  try {
    const stateToSave = {
      watchlist: state.watchlist,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
  
  return result;
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return undefined;
  }
};
