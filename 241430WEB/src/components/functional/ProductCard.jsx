import React from 'react';
import CardWrapper from './CardWrapper';

/**
 * ProductCard Component
 * Displays individual product details, stock status badge,
 * and quick-action buttons for stock manipulation, editing, and deletion.
 */
export const ProductCard = ({
  product,
  onStockChange,
  onEdit,
  onDelete,
}) => {
  const { id, name, sku, category, price, stock, description } = product;

  // Determine stock status and badge styling conditionally (Task 4)
  let statusBadge = {
    label: 'In Stock',
    className: 'badge-in-stock',
  };

  if (stock === 0) {
    statusBadge = {
      label: 'Out of Stock',
      className: 'badge-out-of-stock',
    };
  } else if (stock <= 10) {
    statusBadge = {
      label: 'Low Stock',
      className: 'badge-low-stock',
    };
  }

  const handleDecrement = () => {
    if (stock > 0) {
      onStockChange(id, stock - 1);
    }
  };

  const handleIncrement = () => {
    onStockChange(id, stock + 1);
  };

  const handleRestock = () => {
    onStockChange(id, stock + 10);
  };

  return (
    <CardWrapper className={`product-card ${stock === 0 ? 'is-out-of-stock' : ''}`}>
      <div className="product-card-top">
        <div className="product-card-meta">
          <span className="product-sku">{sku}</span>
          <span className="product-category">{category}</span>
        </div>
        <span className={`status-badge ${statusBadge.className}`}>
          {statusBadge.label}
        </span>
      </div>

      <div className="product-card-info">
        <h4 className="product-title">{name}</h4>
        {description && (
          <p className="product-description">{description}</p>
        )}
      </div>

      <div className="product-card-details">
        <div className="product-price-box">
          <span className="detail-label">Price</span>
          <span className="product-price">
            ${Number(price).toFixed(2)}
          </span>
        </div>

        <div className="product-stock-box">
          <span className="detail-label">Stock Quantity</span>
          <div className="stock-counter-group">
            <button
              type="button"
              className="stock-step-btn"
              onClick={handleDecrement}
              disabled={stock === 0}
              title="Decrease stock by 1"
              aria-label="Decrease stock"
            >
              −
            </button>
            <span className="stock-count">{stock}</span>
            <button
              type="button"
              className="stock-step-btn"
              onClick={handleIncrement}
              title="Increase stock by 1"
              aria-label="Increase stock"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="product-card-actions">
        {stock === 0 && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleRestock}
            title="Add 10 units"
          >
            + Restock (10)
          </button>
        )}
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => onEdit(product)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger-outline btn-sm"
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
      </div>
    </CardWrapper>
  );
};

export default ProductCard;
