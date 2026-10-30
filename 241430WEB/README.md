# E-Commerce Inventory & Stock Management Dashboard

A comprehensive, production-ready React application engineered to fulfill all requirements for **Web Engineering & AI Assignment 01: Advanced React Component Architecture & State Management**.

The project models an enterprise inventory management system seamlessly combining legacy React patterns (**Class Components & Lifecycle Methods**) with modern functional patterns (**Functional Components, Context API & Modern React Hooks**). The user interface is intentionally built with a clean, focused, professional, and accessible design (no distracting animations or flashy elements).

---

## 1. Project Directory Structure

The project strictly follows the required architecture:

```plaintext
src/
├── components/
│   ├── class/
│   │   └── AuditLogger.jsx          # Class Component with lifecycle methods & state
│   └── functional/
│       ├── CardWrapper.jsx          # Reusable container leveraging props.children
│       ├── Header.jsx               # Header with metrics summary & ThemeToggle
│       ├── InventoryMetrics.jsx     # Analytics summary cards (valuation, stock, alerts)
│       ├── ProductCard.jsx          # Individual product item with stock actions & badges
│       ├── ProductForm.jsx          # Add/Edit form with auto-refocus via useRef
│       ├── ProductList.jsx          # Search, filters, sorting, and conditional empty state
│       └── ThemeToggle.jsx          # Theme switch consuming ThemeContext
├── context/
│   └── ThemeContext.jsx             # React Context for global Light/Dark theme state
├── hooks/
│   └── useLocalStorage.js           # Custom hook for localStorage synchronization
├── App.jsx                          # Root orchestrator with useState, useEffect, useMemo, useCallback
├── index.css                        # Clean, responsive, accessible stylesheet
└── main.jsx                         # React root entry point
```

---

## 2. Topic Coverage & Task Implementation

### Task 1: Component-Based Architecture
- Modular breakdown into single-responsibility components: `Header`, `ProductCard`, `ProductList`, `ProductForm`, `InventoryMetrics`, `ThemeToggle`, `CardWrapper`, and `AuditLogger`.
- Clean hierarchy where components can be individually maintained, tested, or reused.

### Task 2: Functional Components & Props
- **Primary Views**: Built cleanly as Functional Components.
- **Data Flow & Callback Props**: Parent-to-child state passing and child-to-parent communication via callbacks (`onSubmitProduct`, `onStockChange`, `onDelete`, `onEdit`, `onSearchChange`, `onCategoryChange`, etc.).
- **React Children**: `CardWrapper.jsx` utilizes `props.children` to provide consistent borders, headers, badges, and layout encapsulation across form panels, metric cards, and product listings.

### Task 3: Class Components & Lifecycle Methods
- **`AuditLogger.jsx`**: Built strictly as a React Class Component (`class AuditLogger extends Component`).
- **State Management**: Uses `this.state` and `this.setState()` explicitly to store operation logs, active toast notifications, and filter settings.
- **Lifecycle Implementation**:
  - `componentDidMount()`: Retrieves initial audit history stored in browser `localStorage` and subscribes to window listeners.
  - `componentDidUpdate(prevProps, prevState)`: Detects when parent transmits a `latestAction` prop, appends it to the log history, persists updated logs to `localStorage`, and triggers an auto-dismissing visual toast notification.
  - `componentWillUnmount()`: Cleans up running timeouts (`clearTimeout(this.toastTimeout)`) and unbinds event listeners to prevent memory leaks.

### Task 4: JSX vs. JavaScript Logic
- **Dynamic JavaScript Expressions (`{ ... }`)**: Embedded throughout JSX for dynamic formatting (currency `${price.toFixed(2)}`, localized dates, conditional classes, calculated metrics).
- **Conditional Rendering**:
  - Ternary operators for stock status badges (`In Stock`, `Low Stock`, `Out of Stock`) and button labels (`Add Product` vs. `Save Changes`).
  - Logical short-circuiting (`&&`) for empty inventory states, active filters banner, and toast alerts.
- **Array Mapping**: Efficient rendering using `Array.prototype.map()` with guaranteed unique `key` props (e.g., `key={product.id}`, `key={log.id}`).
- **Synthetic DOM Events**: Comprehensive event handling (`onClick`, `onChange`, `onSubmit`, `onKeyDown`).

### Task 5: React Hooks Mastery
1. **`useState`**:
   - Manages inventory products catalog.
   - Manages form inputs and real-time validation error states in `ProductForm`.
   - Manages search queries, category filters, stock level filters, and sort options.
   - Manages active edit target (`editingProduct`).
2. **`useEffect`**:
   - Persists inventory items into `localStorage` whenever modified.
   - Dynamically updates the browser tab `document.title` to reflect total catalog count (e.g., `Inventory Dashboard (6 Products)`).
   - Syncs light/dark mode attribute to the DOM document element.
3. **`useContext`**:
   - `ThemeContext.jsx` provides global theme state (`theme`, `toggleTheme`, `isDark`) and persists preferences to `localStorage`.
   - Consumed by `ThemeToggle` and components without prop-drilling.
4. **`useRef`**:
   - In `ProductForm.jsx`, `titleInputRef` automatically shifts DOM focus to the product title input on initial component mount, after submitting a new product, and when switching into edit mode.
5. **`useMemo` & `useCallback`**:
   - `useMemo`: Caches complex multi-criteria filtering, search matching, sorting operations, and inventory metrics calculations (total value, units, low stock count) to avoid redundant computations on unrelated re-renders.
   - `useCallback`: Memoizes event handler references (`handleAddProduct`, `handleUpdateProduct`, `handleDeleteProduct`, `handleStockChange`) to ensure child components (`ProductList`, `ProductCard`, `ProductForm`) do not undergo unnecessary re-renders.

---

## Task 6: Theoretical Analysis — Client-Side Rendering (CSR) vs. Server-Side Rendering (SSR)

### 1. Fundamental Differences in Initial Page Load & Server-Side Execution

Client-Side Rendering (CSR)—as implemented in standard Vite + React Single-Page Applications (SPAs)—relies on a static hosting model where the web server transmits a minimal HTML file shell containing an empty root container (`<div id="root"></div>`) along with bundled JavaScript and CSS assets. When a client visits the application, the browser must first download, parse, and execute the entire JavaScript bundle before the React runtime can mount the component tree, fetch data (or read `localStorage`), and paint the interactive DOM. Consequently, all view compilation and execution work is offloaded entirely to the client device, resulting in a blank screen or loading state during the initial download phase.

In contrast, Server-Side Rendering (SSR)—as championed by frameworks like Next.js or Remix—executes React component logic directly on a Node.js/Edge server for each incoming HTTP request. The server queries required data stores, computes the initial component tree, and streams a fully formed, populated HTML document back to the client. Upon receiving this markup, the browser can immediately render visual content without waiting for JavaScript execution (First Contentful Paint occurs almost instantly). Once the accompanying JavaScript bundle loads, a hydration process attaches React event listeners to the pre-rendered DOM, making the interface fully interactive.

### 2. Performance, SEO, and Hosting Trade-offs for Enterprise E-Commerce

| Dimension | Client-Side Rendering (CSR) | Server-Side Rendering (SSR) |
| :--- | :--- | :--- |
| **Initial Load & Web Vitals** | Slower First Contentful Paint (FCP) and Largest Contentful Paint (LCP) due to bundle transfer and parsing delays, though subsequent in-app route transitions are instantaneous. | Exceptionally fast FCP and LCP because pre-rendered HTML is delivered directly. However, Time to Interactive (TTI) can lag if hydration is heavy. |
| **Search Engine Optimization (SEO)** | Sub-optimal for public-facing storefronts. Search crawlers with limited or deferred JavaScript execution capabilities may index empty HTML shells, degrading ranking. | Superior SEO. Search engine bots immediately crawl fully populated semantic HTML, metadata, and open-graph tags without executing client scripts. |
| **Hosting & Infrastructure Complexity** | Inexpensive, highly scalable, and trivial to deploy on global CDNs or static storage (e.g., GitHub Pages, Vercel, S3, Cloudflare Pages) with zero server runtime maintenance. | Requires active Node.js server runtimes, serverless functions, or edge compute environments. Demands server monitoring, autoscaling, caching strategies, and higher compute costs. |

**Architectural Decision for an E-Commerce Dashboard:**
For an internal, authenticated enterprise inventory dashboard (such as this project), **CSR** is often the optimal engineering choice: it eliminates server hosting overhead, enables friction-free offline capabilities via `localStorage`/Service Workers, and delivers rapid desktop-like client interactions once loaded. Conversely, for a public consumer e-commerce catalog requiring high search visibility and instant mobile first-visit conversions, **SSR** or Hybrid Incremental Static Regeneration (ISR) is essential.

---

## 4. How to Run Locally

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (version 9 or higher)

### Setup & Launch

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at the provided local URL (typically `http://localhost:5173`).

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```
