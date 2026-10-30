import React from 'react';
import ThemeToggle from './ThemeToggle';

/**
 * Header Component
 * Functional component displaying dashboard branding, active product count,
 * and global controls like the ThemeToggle.
 */
export const Header = ({ totalProducts = 0, lowStockCount = 0 }) => {
  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="brand-icon" aria-hidden="true">
            📦
          </div>
          <div>
            <h1 className="brand-title">Inventory & Stock Dashboard</h1>
            <p className="brand-subtitle">
              E-Commerce Management & Real-time Audit System
            </p>
          </div>
        </div>

        <div className="header-meta">
          <div className="status-pill">
            <span className="status-dot"></span>
            <span>{totalProducts} Total Items</span>
          </div>
          {lowStockCount > 0 && (
            <div className="warning-pill">
              <span>⚠️ {lowStockCount} Low Stock</span>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
