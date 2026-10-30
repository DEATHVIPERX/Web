import React, { useState, useEffect, useRef } from 'react';
import CardWrapper from './CardWrapper';

/**
 * ProductForm Component
 * Handles creating new products and updating existing products.
 * Demonstrates:
 * - useState for form inputs and validation errors
 * - useRef to shift focus to the product title input field on mount and after submission
 * - useEffect to sync with editing state
 * - Synthetic event handling (onSubmit, onChange, onClick)
 */
export const ProductForm = ({
  onSubmitProduct,
  editingProduct,
  onCancelEdit,
  availableCategories = ['Electronics', 'Home & Kitchen', 'Apparel', 'Books', 'Fitness'],
}) => {
  // useRef to target the product title/name input field (Task 5)
  const titleInputRef = useRef(null);

  const initialFormState = {
    name: '',
    sku: '',
    category: availableCategories[0] || 'Electronics',
    customCategory: '',
    price: '',
    stock: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Automatically shift focus to product title input on mount (Task 5)
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  // Update form data and refocus when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      const isKnownCategory = availableCategories.includes(editingProduct.category);
      setFormData({
        name: editingProduct.name || '',
        sku: editingProduct.sku || '',
        category: isKnownCategory ? editingProduct.category : 'OTHER',
        customCategory: isKnownCategory ? '' : editingProduct.category,
        price: editingProduct.price !== undefined ? String(editingProduct.price) : '',
        stock: editingProduct.stock !== undefined ? String(editingProduct.stock) : '',
        description: editingProduct.description || '',
      });
      setIsCustomCategory(!isKnownCategory);
      setErrors({});

      // Shift focus when entering edit mode
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    } else {
      setFormData(initialFormState);
      setIsCustomCategory(false);
      setErrors({});
    }
  }, [editingProduct]);

  // Synthetic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      if (value === 'OTHER') {
        setIsCustomCategory(true);
      } else {
        setIsCustomCategory(false);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product title is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (isCustomCategory && !formData.customCategory.trim()) {
      newErrors.category = 'Please enter a category name';
    }

    const priceNum = parseFloat(formData.price);
    if (formData.price === '' || isNaN(priceNum) || priceNum < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    const stockNum = parseInt(formData.stock, 10);
    if (formData.stock === '' || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = 'Stock must be 0 or a positive integer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const finalCategory = isCustomCategory
      ? formData.customCategory.trim()
      : formData.category;

    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: finalCategory,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      description: formData.description.trim(),
    };

    onSubmitProduct(payload);

    // If not editing, reset form; if editing, parent clears editingProduct
    if (!editingProduct) {
      setFormData(initialFormState);
      setIsCustomCategory(false);
      setErrors({});
    }

    // Task 5 requirement: Shift focus back to product title after submission
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setIsCustomCategory(false);
    setErrors({});
    if (editingProduct && onCancelEdit) {
      onCancelEdit();
    }
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const isEditing = Boolean(editingProduct);

  return (
    <CardWrapper
      title={isEditing ? 'Edit Product' : 'Add New Product'}
      subtitle={
        isEditing
          ? `Modifying SKU: ${editingProduct.sku}`
          : 'Enter product details to update the live inventory'
      }
      badge={isEditing ? 'Editing' : 'New'}
      className="product-form-card"
    >
      <form onSubmit={handleSubmit} noValidate className="product-form">
        <div className="form-group">
          <label htmlFor="product-name" className="form-label">
            Product Title <span className="required-star">*</span>
          </label>
          <input
            id="product-name"
            ref={titleInputRef}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Wireless Mechanical Keyboard"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-row">
          <div className="form-group form-col">
            <label htmlFor="product-sku" className="form-label">
              SKU Code <span className="required-star">*</span>
            </label>
            <input
              id="product-sku"
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g. TECH-KB-01"
              className={`form-input ${errors.sku ? 'input-error' : ''}`}
            />
            {errors.sku && <span className="error-text">{errors.sku}</span>}
          </div>

          <div className="form-group form-col">
            <label htmlFor="product-category" className="form-label">
              Category <span className="required-star">*</span>
            </label>
            <select
              id="product-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="OTHER">+ Add Custom Category</option>
            </select>
          </div>
        </div>

        {isCustomCategory && (
          <div className="form-group">
            <label htmlFor="custom-category" className="form-label">
              Custom Category Name <span className="required-star">*</span>
            </label>
            <input
              id="custom-category"
              type="text"
              name="customCategory"
              value={formData.customCategory}
              onChange={handleChange}
              placeholder="e.g. Office Supplies"
              className={`form-input ${errors.category ? 'input-error' : ''}`}
            />
            {errors.category && (
              <span className="error-text">{errors.category}</span>
            )}
          </div>
        )}

        <div className="form-row">
          <div className="form-group form-col">
            <label htmlFor="product-price" className="form-label">
              Unit Price ($) <span className="required-star">*</span>
            </label>
            <input
              id="product-price"
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              className={`form-input ${errors.price ? 'input-error' : ''}`}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          <div className="form-group form-col">
            <label htmlFor="product-stock" className="form-label">
              Stock Quantity <span className="required-star">*</span>
            </label>
            <input
              id="product-stock"
              type="number"
              step="1"
              min="0"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              className={`form-input ${errors.stock ? 'input-error' : ''}`}
            />
            {errors.stock && <span className="error-text">{errors.stock}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="product-description" className="form-label">
            Description <span className="optional-tag">(Optional)</span>
          </label>
          <textarea
            id="product-description"
            rows="2"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief item description or storage location..."
            className="form-textarea"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Save Changes' : '+ Add to Inventory'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
          >
            {isEditing ? 'Cancel Edit' : 'Clear'}
          </button>
        </div>
      </form>
    </CardWrapper>
  );
};

export default ProductForm;
