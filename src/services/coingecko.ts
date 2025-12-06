import axios from 'axios';

// Use direct API in production, proxy in development
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.coingecko.com/api/v3'
  : '/api/api/v3';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000;
let requestQueue = Promise.resolve();
let isRequesting = false;

const throttleRequest = async () => {
  while (isRequesting) {
    await delay(100);
  }
  
  isRequesting = true;
  
  requestQueue = requestQueue.then(async () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }
    
    lastRequestTime = Date.now();
  });
  
  await requestQueue;
  isRequesting = false;
};

const retryRequest = async <T>(fn: () => Promise<T>, retries = 3, delayMs = 3000): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      await throttleRequest();
      return await fn();
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      
      if (axiosError.response?.status === 429) {
        const waitTime = delayMs * Math.pow(2, i);
        console.warn(`Rate limited. Waiting ${waitTime}ms before retry ${i + 1}/${retries}`);
        await delay(waitTime);
        
        if (i === retries - 1) throw error;
      } else {
        if (i === retries - 1) throw error;
        await delay(1000);
      }
    }
  }
  throw new Error('Max retries exceeded');
};

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  large: string;
}

export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    large: string;
  };
}

export const coingeckoService = {
  async getMarkets(ids: string[]): Promise<CoinMarket[]> {
    return retryRequest(async () => {
      const response = await api.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: ids.join(','),
          order: 'market_cap_desc',
          per_page: 250,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h',
        },
      });
      return response.data;
    });
  },

  async searchCoins(query: string, page: number = 1): Promise<CoinMarket[]> {
    return retryRequest(async () => {
      const response = await api.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 50,
          page: page,
          sparkline: true,
          price_change_percentage: '24h',
        },
      });
      
      const data = response.data as CoinMarket[];
      
      if (!query) {
        return data;
      }
      
      const searchLower = query.toLowerCase();
      return data.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchLower) ||
          coin.symbol.toLowerCase().includes(searchLower)
      );
    });
  },

  async getTrending(): Promise<SearchResult[]> {
    return retryRequest(async () => {
      const response = await api.get('/search/trending');
      const trendingCoins = response.data.coins as TrendingCoin[];
      
      return trendingCoins.map((coin) => ({
        id: coin.item.id,
        name: coin.item.name,
        symbol: coin.item.symbol,
        thumb: coin.item.thumb,
        large: coin.item.large,
      }));
    });
  },

  async getTrendingWithDetails(): Promise<CoinMarket[]> {
    const trending = await this.getTrending();
    const ids = trending.map((coin) => coin.id).slice(0, 10);
    
    if (ids.length === 0) return [];
    
    return this.getMarkets(ids);
  },

  async getAllCoins(page: number = 1): Promise<CoinMarket[]> {
    return retryRequest(async () => {
      const response = await api.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 50,
          page: page,
          sparkline: true,
          price_change_percentage: '24h',
        },
      });
      return response.data;
    });
  },
};
