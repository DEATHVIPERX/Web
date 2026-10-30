import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/functional/Header';
import InventoryMetrics from './components/functional/InventoryMetrics';
import ProductForm from './components/functional/ProductForm';
import ProductList from './components/functional/ProductList';
import AuditLogger from './components/class/AuditLogger';

// Initial seed products for first-time launch
const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Wireless Mechanical Keyboard',
    sku: 'TECH-KB-01',
    category: 'Electronics',
    price: 89.99,
    stock: 18,
    description: 'Hot-swappable RGB mechanical keyboard with brown tactile switches.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Noise-Cancelling Headphones',
    sku: 'TECH-AUD-02',
    category: 'Electronics',
    price: 199.5,
    stock: 4,
    description: 'Over-ear wireless headphones with active noise cancellation.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Ergonomic Desk Chair',
    sku: 'FURN-CHR-03',
    category: 'Home & Kitchen',
    price: 249.0,
    stock: 7,
    description: 'High-back mesh ergonomic office chair with lumbar support.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Stainless Steel Water Bottle',
    sku: 'LIF-BTL-04',
    category: 'Fitness',
    price: 24.95,
    stock: 35,
    description: 'Double-wall vacuum insulated 32oz sports hydration bottle.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Organic Green Tea (50 Bags)',
    sku: 'GROC-TEA-05',
    category: 'Home & Kitchen',
    price: 14.5,
    stock: 0,
    description: 'Premium whole-leaf organic green tea sachets.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Full HD 1080p Web Camera',
    sku: 'TECH-CAM-06',
    category: 'Electronics',
    price: 54.99,
    stock: 12,
    description: 'Wide-angle webcam with built-in privacy shutter and dual microphones.',
    createdAt: new Date().toISOString(),
  },
];

function DashboardApp() {
  // 1. useState: Product inventories state (Task 5)
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('inventory_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  // useState: Form editing state
  const [editingProduct, setEditingProduct] = useState(null);

  // useState: Filtering & Sorting controls (Task 5)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name-asc');

  // useState: Latest action to feed the Class Component AuditLogger (Task 3)
  const [latestAction, setLatestAction] = useState(null);

  // 2. useEffect: Synchronize inventory state with localStorage (Task 5)
  useEffect(() => {
    try {
      localStorage.setItem('inventory_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to sync products to localStorage', e);
    }
  }, [products]);

  // 3. useEffect: Dynamically update document title based on total active products (Task 5)
  useEffect(() => {
    document.title = `Inventory Dashboard (${products.length} Products)`;
  }, [products.length]);

  // 4. useMemo: Optimize inventory filtering and sorting (Task 5)
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Text search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(query);
          const matchesSku = product.sku.toLowerCase().includes(query);
          const matchesCat = product.category.toLowerCase().includes(query);
          if (!matchesName && !matchesSku && !matchesCat) return false;
        }

        // Category filter
        if (selectedCategory !== 'ALL' && product.category !== selectedCategory) {
          return false;
        }

        // Stock status filter
        if (stockFilter === 'IN_STOCK' && product.stock <= 10) {
          return false;
        }
        if (
          stockFilter === 'LOW_STOCK' &&
          (product.stock === 0 || product.stock > 10)
        ) {
          return false;
        }
        if (stockFilter === 'OUT_OF_STOCK' && product.stock > 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'stock-asc':
            return a.stock - b.stock;
          case 'stock-desc':
            return b.stock - a.stock;
          default:
            return 0;
        }
      });
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  // 5. useMemo: Compute inventory summary analytics (Task 5)
  const inventoryMetrics = useMemo(() => {
    const totalProducts = products.length;
    let totalUnits = 0;
    let totalValuation = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const item of products) {
      totalUnits += item.stock;
      totalValuation += item.price * item.stock;
      if (item.stock === 0) {
        outOfStockCount += 1;
      } else if (item.stock <= 10) {
        lowStockCount += 1;
      }
    }

    return {
      totalProducts,
      totalUnits,
      totalValuation,
      lowStockCount,
      outOfStockCount,
    };
  }, [products]);

  // useMemo: Extract unique categories for filter dropdown
  const availableCategories = useMemo(() => {
    const baseCategories = ['Electronics', 'Home & Kitchen', 'Apparel', 'Books', 'Fitness'];
    const currentCategories = products.map((p) => p.category);
    return Array.from(new Set([...baseCategories, ...currentCategories])).filter(Boolean);
  }, [products]);

  // 6. useCallback: Handler functions to prevent unnecessary child re-renders (Task 5)
  const handleAddProduct = useCallback((productData) => {
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Send action to AuditLogger
    setLatestAction({
      id: `log-${Date.now()}-${Math.random()}`,
      type: 'ADD',
      action: 'PRODUCT_ADDED',
      description: `Added new product "${newProduct.name}" (SKU: ${newProduct.sku}) with ${newProduct.stock} units at $${newProduct.price.toFixed(2)}.`,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const handleUpdateProduct = useCallback(
    (productData) => {
      if (!editingProduct) return;

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...productData, updatedAt: new Date().toISOString() }
            : p
        )
      );

      setLatestAction({
        id: `log-${Date.now()}-${Math.random()}`,
        type: 'UPDATE',
        action: 'PRODUCT_UPDATED',
        description: `Updated details for product "${productData.name}" (SKU: ${productData.sku}).`,
        timestamp: new Date().toISOString(),
      });

      setEditingProduct(null);
    },
    [editingProduct]
  );

  const handleSubmitForm = useCallback(
    (formData) => {
      if (editingProduct) {
        handleUpdateProduct(formData);
      } else {
        handleAddProduct(formData);
      }
    },
    [editingProduct, handleUpdateProduct, handleAddProduct]
  );

  const handleDeleteProduct = useCallback(
    (productId) => {
      const target = products.find((p) => p.id === productId);
      if (!target) return;

      const confirmed = window.confirm(
        `Are you sure you want to delete "${target.name}" (${target.sku})?`
      );
      if (!confirmed) return;

      setProducts((prev) => prev.filter((p) => p.id !== productId));

      if (editingProduct && editingProduct.id === productId) {
        setEditingProduct(null);
      }

      setLatestAction({
        id: `log-${Date.now()}-${Math.random()}`,
        type: 'DELETE',
        action: 'PRODUCT_DELETED',
        description: `Deleted product "${target.name}" (SKU: ${target.sku}) from catalog.`,
        timestamp: new Date().toISOString(),
      });
    },
    [products, editingProduct]
  );

  const handleStockChange = useCallback(
    (productId, newStock) => {
      const target = products.find((p) => p.id === productId);
      if (!target) return;

      const safeStock = Math.max(0, newStock);
      const diff = safeStock - target.stock;

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: safeStock } : p))
      );

      setLatestAction({
        id: `log-${Date.now()}-${Math.random()}`,
        type: 'STOCK',
        action: 'STOCK_CHANGED',
        description: `Adjusted stock for "${target.name}": changed from ${target.stock} to ${safeStock} (${diff >= 0 ? '+' + diff : diff}).`,
        timestamp: new Date().toISOString(),
      });
    },
    [products]
  );

  const handleEditProduct = useCallback((product) => {
    setEditingProduct(product);
    // Smooth scroll to form if needed
    const formEl = document.querySelector('.product-form-card');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingProduct(null);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setStockFilter('ALL');
    setSortBy('name-asc');
  }, []);

  return (
    <div className="app-container">
      {/* Header View (Task 1 & Task 2) */}
      <Header
        totalProducts={inventoryMetrics.totalProducts}
        lowStockCount={inventoryMetrics.lowStockCount}
      />

      {/* Main Content Layout */}
      <main className="main-content">
        {/* Inventory Analytics Bar (Task 1 & Task 5) */}
        <InventoryMetrics
          totalProducts={inventoryMetrics.totalProducts}
          totalUnits={inventoryMetrics.totalUnits}
          totalValuation={inventoryMetrics.totalValuation}
          lowStockCount={inventoryMetrics.lowStockCount}
          outOfStockCount={inventoryMetrics.outOfStockCount}
        />

        {/* Two-Column Responsive Workspace */}
        <div className="dashboard-grid">
          {/* Left Column: Form + AuditLogger Class Component */}
          <aside className="dashboard-sidebar">
            {/* Product Form (Task 2 & Task 5 with useRef) */}
            <ProductForm
              onSubmitProduct={handleSubmitForm}
              editingProduct={editingProduct}
              onCancelEdit={handleCancelEdit}
              availableCategories={availableCategories}
            />

            {/* Audit Logger Class Component (Task 3) */}
            <AuditLogger latestAction={latestAction} />
          </aside>

          {/* Right Column: Search, Filters, and Product Catalog */}
          <section className="dashboard-catalog">
            <ProductList
              products={filteredProducts}
              totalCount={products.length}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              stockFilter={stockFilter}
              onStockFilterChange={setStockFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              categories={availableCategories}
              onStockChange={handleStockChange}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onResetFilters={handleResetFilters}
            />
          </section>
        </div>
      </main>

      {/* Simple, Professional Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>
            <strong>Web Engineering & AI Assignment 01</strong> — Advanced React Component Architecture & State Management
          </p>
          <p className="footer-sub">
            Built with React.js (Class & Functional Components, Hooks, Context API) & Vite SPA
          </p>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <DashboardApp />
    </ThemeProvider>
  );
}

export default App;
