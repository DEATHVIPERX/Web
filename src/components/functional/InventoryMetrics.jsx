import React from 'react';
import CardWrapper from './CardWrapper';

/**
 * InventoryMetrics Component
 * Functional component displaying key inventory metrics and analytics.
 * Reuses CardWrapper for modular layout.
 */
export const InventoryMetrics = ({
  totalProducts = 0,
  totalUnits = 0,
  totalValuation = 0,
  lowStockCount = 0,
  outOfStockCount = 0,
}) => {
  return (
    <div className="metrics-grid">
      <CardWrapper className="metric-card">
        <div className="metric-content">
          <span className="metric-label">Total Products</span>
          <div className="metric-value-row">
            <span className="metric-number">{totalProducts}</span>
            <span className="metric-icon">📑</span>
          </div>
          <span className="metric-sub">Catalog items</span>
        </div>
      </CardWrapper>

      <CardWrapper className="metric-card">
        <div className="metric-content">
          <span className="metric-label">Total Stock Units</span>
          <div className="metric-value-row">
            <span className="metric-number">{totalUnits.toLocaleString()}</span>
            <span className="metric-icon">📦</span>
          </div>
          <span className="metric-sub">Physical quantity</span>
        </div>
      </CardWrapper>

      <CardWrapper className="metric-card">
        <div className="metric-content">
          <span className="metric-label">Total Inventory Value</span>
          <div className="metric-value-row">
            <span className="metric-number">
              ${totalValuation.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="metric-icon">💰</span>
          </div>
          <span className="metric-sub">Retail asset value</span>
        </div>
      </CardWrapper>

      <CardWrapper className={`metric-card ${lowStockCount > 0 ? 'metric-card-warning' : ''}`}>
        <div className="metric-content">
          <span className="metric-label">Low Stock Items</span>
          <div className="metric-value-row">
            <span className="metric-number">{lowStockCount}</span>
            <span className="metric-icon">⚠️</span>
          </div>
          <span className="metric-sub">Stock between 1 and 10</span>
        </div>
      </CardWrapper>

      <CardWrapper className={`metric-card ${outOfStockCount > 0 ? 'metric-card-danger' : ''}`}>
        <div className="metric-content">
          <span className="metric-label">Out of Stock</span>
          <div className="metric-value-row">
            <span className="metric-number">{outOfStockCount}</span>
            <span className="metric-icon">🚫</span>
          </div>
          <span className="metric-sub">Requires replenishment</span>
        </div>
      </CardWrapper>
    </div>
  );
};

export default InventoryMetrics;
