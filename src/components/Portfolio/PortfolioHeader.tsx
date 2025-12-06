import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { calculatePortfolioTotal, getChartData } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import DonutChart from './DonutChart';
import './PortfolioHeader.css';

const PortfolioHeader: React.FC = () => {
  const { tokens, lastUpdated } = useSelector((state: RootState) => state.watchlist);

  const portfolioTotal = calculatePortfolioTotal(tokens);
  const chartData = getChartData(tokens);

  const calculatePercentage = (value: number) => {
    if (portfolioTotal === 0) return '0%';
    return ((value / portfolioTotal) * 100).toFixed(1) + '%';
  };

  const getFormattedTime = () => {
    if (!lastUpdated) return 'Never';
    return new Date(lastUpdated).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="portfolio-header">
      <div className="portfolio-card">
        <div className="portfolio-left">
          <span className="portfolio-label">Portfolio Total</span>
          <h2 className="portfolio-value">{formatCurrency(portfolioTotal)}</h2>
          <span className="portfolio-updated">Last updated: {getFormattedTime()}</span>
        </div>
        <div className="portfolio-right">
          <div className="chart-section">
            <span className="chart-title">Portfolio Total</span>
            <div className="chart-wrapper">
              {chartData.length > 0 ? (
                <DonutChart data={chartData} />
              ) : (
                <div className="empty-chart">No holdings</div>
              )}
            </div>
          </div>
          {chartData.length > 0 && (
            <div className="chart-legend">
              {chartData.map((item, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-name" style={{ color: item.color }}>
                    {item.fullName} ({item.name})
                  </span>
                  <span className="legend-percent">{calculatePercentage(item.value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioHeader;
