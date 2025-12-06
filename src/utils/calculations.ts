import type { Token } from '../store/slices/watchlistSlice';

export const calculateTokenValue = (token: Token): number => {
  return token.holdings * token.current_price;
};

export const calculatePortfolioTotal = (tokens: Token[]): number => {
  return tokens.reduce((total, token) => total + calculateTokenValue(token), 0);
};

export const getChartData = (tokens: Token[]) => {
  return tokens
    .filter((token) => token.holdings > 0)
    .map((token, index) => ({
      name: token.symbol.toUpperCase(),
      value: calculateTokenValue(token),
      color: getColorForIndex(index),
      fullName: token.name,
    }));
};

export const getColorForIndex = (index: number): string => {
  const colors = [
    '#a9e851',
    '#6366f1',
    '#14b8a6',
    '#ec4899',
    '#f97316',
    '#8b5cf6',
  ];
  return colors[index % colors.length];
};
