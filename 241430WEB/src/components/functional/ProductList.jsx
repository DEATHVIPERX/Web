import React from 'react';
import ProductCard from './ProductCard';
import CardWrapper from './CardWrapper';

/**
 * ProductList Component
 * Renders the filter controls (search, category, stock level, sorting)
 * and the list/grid of ProductCard components.
 * Demonstrates:
 * - Conditional rendering for empty state and filter badges
 * - Array rendering with .map() and unique keys
 * - Passing callbacks down to child components
 */
export const ProductList = ({
  products = [],
  totalCount = 0,
  searchQuery = '',
  onSearchChange,
  selectedCategory = 'ALL',
  onCategoryChange,
  stockFilter = 'ALL',
  onStockFilterChange,
  sortBy = 'name-asc',
  onSortChange,
  categories = [],
  onStockChange,
  onEdit,
  onDelete,
  onResetFilters,
}) => {
  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'ALL' ||
    stockFilter !== 'ALL';

  return (
    <CardWrapper
      title="Product Inventory"
      subtitle={`Showing ${products.length} of ${totalCount} items`}
      badge={`${products.length} Items`}
      actions={
        isFiltered && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onResetFilters}
          >
            Reset Filters
          </button>
        )
      }
      className="product-list-container"
    >
      {/* Search and Filters Control Bar */}
      <div className="filter-controls">
        <div className="search-box">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, SKU, or category..."
            className="search-input"
            aria-label="Search products"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-dropdowns">
          <div className="filter-group">
            <label htmlFor="filter-cat" className="filter-label">
              Category:
            </label>
            <select
              id="filter-cat"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-stock" className="filter-label">
              Stock Status:
            </label>
            <select
              id="filter-stock"
              value={stockFilter}
              onChange={(e) => onStockFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">In Stock (&gt;10)</option>
              <option value="LOW_STOCK">Low Stock (1–10)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0)</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-by" className="filter-label">
              Sort By:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="filter-select"
            >
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="price-asc">Price (Low → High)</option>
              <option value="price-desc">Price (High → Low)</option>
              <option value="stock-asc">Stock (Low → High)</option>
              <option value="stock-desc">Stock (High → Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conditional Rendering: Empty State vs Product Cards Grid (Task 4) */}
      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            📦
          </div>
          <h4 className="empty-state-title">No products found</h4>
          <p className="empty-state-text">
            {isFiltered
              ? 'No items match your active search and filter criteria. Try adjusting your filters.'
              : 'Your inventory catalog is currently empty. Add your first product using the form.'}
          </p>
          {isFiltered && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onResetFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="product-cards-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onStockChange={onStockChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </CardWrapper>
  );
};

export default ProductList;
