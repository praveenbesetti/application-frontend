import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../store';
import { PARENT_CATEGORIES } from '../data/staticData';
import { ALL_CATEGORY_PRODUCTS, SORT_OPTIONS } from '../data/categoryData';
import styles from './CategoryPage.module.css';

// ─────────────────────────────────────────────────────────
// Mini ProductCard used inside the category grid
// ─────────────────────────────────────────────────────────
function GridProductCard({ product }) {
  const dispatch = useDispatch();
  const qty      = useSelector(s => s.cart.items[product.id]?.qty || 0);
  const [flash, setFlash] = useState(false);

  const add = () => {
    dispatch(addToCart(product));
    setFlash(true);
    setTimeout(() => setFlash(false), 700);
  };
  const rem = () => dispatch(removeFromCart(product));

  const badgeBg =
    product.badge === 'ORGANIC'     ? '#16a05a' :
    product.badge === 'FRESH'       ? '#0088cc' :
    product.badge === 'BEST SELLER' ? '#7040c8' :
    product.badge === 'POPULAR'     ? '#e07b00' : '#f95d2b';

  return (
    <div className={styles.productCard}>
      {product.badge && (
        <span className={styles.productBadge} style={{ background: badgeBg }}>
          {product.badge}
        </span>
      )}

      <div className={styles.productImg}>{product.emoji}</div>

      <div className={styles.productInfo}>
        <p className={styles.productName}>{product.name}</p>
        <p className={styles.productQty}>{product.qty}</p>
      </div>

      <div className={styles.productFooter}>
        <div>
          {product.oldPrice && (
            <span className={styles.oldPrice}>₹{product.oldPrice}</span>
          )}
          <span className={styles.price}>₹{product.price}</span>
        </div>

        {qty === 0 ? (
          <button
            className={styles.addBtn}
            onClick={add}
            style={{
              background: flash ? 'var(--green)' : 'var(--green-light)',
              color:      flash ? '#fff'          : 'var(--green)',
            }}
          >
            {flash ? '✓' : '+'}
          </button>
        ) : (
          <div className={styles.qtyCtrl}>
            <button className={`${styles.qtyBtn} ${styles.minus}`} onClick={rem}>−</button>
            <span className={styles.qtyNum}>{qty}</span>
            <button className={`${styles.qtyBtn} ${styles.plus}`}  onClick={add}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// CategoryPage
//   Props:
//     categoryId  — e.g. 'groceries'
//     onBack      — function to go back to home
// ─────────────────────────────────────────────────────────
export default function CategoryPage({ categoryId, onBack }) {
  // Find the parent category definition
  const category = PARENT_CATEGORIES.find(c => c.id === categoryId);

  // All products for this category
  const allProducts = ALL_CATEGORY_PRODUCTS[categoryId]?.all || [];

  // UI state
  const [activeSubcat, setActiveSubcat] = useState('all');
  const [sortBy,       setSort]         = useState('relevance');
  const [priceRange,   setPriceRange]   = useState([0, 1000]);
  const [showFilters,  setShowFilters]  = useState(false); // mobile filter drawer

  // Discount filter state
  const [onlyDiscount, setOnlyDiscount] = useState(false);

  // ── Derived product list ──────────────────────────────
  const products = useMemo(() => {
    let list = [...allProducts];

    // Filter by subcategory
    if (activeSubcat !== 'all') {
      list = list.filter(p => p.subcat === activeSubcat);
    }

    // Filter by price range
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter discounted only
    if (onlyDiscount) list = list.filter(p => p.oldPrice);

    // Sort
    if (sortBy === 'price_asc')  list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'discount')   list.sort((a, b) => (b.oldPrice ? b.oldPrice - b.price : 0) - (a.oldPrice ? a.oldPrice - a.price : 0));
    if (sortBy === 'name')       list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [allProducts, activeSubcat, sortBy, priceRange, onlyDiscount]);

  if (!category) {
    return (
      <div className={styles.notFound}>
        <p>Category not found.</p>
        <button onClick={onBack}>← Go Back</button>
      </div>
    );
  }

  // ── Subcategories for sidebar ─────────────────────────
  const subcats = [
    { id: 'all', name: 'All Items', emoji: category.emoji },
    ...category.subcategories,
  ];

  return (
    <div className={styles.page}>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader} style={{ background: category.bg }}>
        <div className={styles.pageHeaderInner}>
          <button className={styles.backBtn} onClick={onBack}>
            ← Back
          </button>
          <span className={styles.pageHeaderEmoji}>{category.emoji}</span>
          <div>
            <h1 className={styles.pageTitle}>{category.name}</h1>
            <p className={styles.pageSubtitle}>{products.length} items</p>
          </div>
        </div>
      </div>

      {/* ── Toolbar: sort + mobile filter toggle ── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {/* Active filter chips */}
          {activeSubcat !== 'all' && (
            <span className={styles.activeChip}>
              {category.subcategories.find(s => s.id === activeSubcat)?.name}
              <span onClick={() => setActiveSubcat('all')}>✕</span>
            </span>
          )}
          {onlyDiscount && (
            <span className={styles.activeChip}>
              On Sale <span onClick={() => setOnlyDiscount(false)}>✕</span>
            </span>
          )}
        </div>

        <div className={styles.toolbarRight}>
          {/* Sort dropdown */}
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>

          {/* Mobile filter toggle */}
          <button
            className={styles.filterToggle}
            onClick={() => setShowFilters(true)}
          >
            ⚙ Filters
          </button>
        </div>
      </div>

      {/* ── Body: sidebar + product grid ── */}
      <div className={styles.body}>

        {/* ── Left Sidebar ── */}
        <aside className={styles.sidebar}>
          <p className={styles.sidebarLabel}>CATEGORIES</p>
          {subcats.map(sub => (
            <button
              key={sub.id}
              className={`${styles.subcatBtn} ${activeSubcat === sub.id ? styles.subcatActive : ''}`}
              onClick={() => setActiveSubcat(sub.id)}
            >
              <span className={styles.subcatEmoji}>{sub.emoji}</span>
              <span className={styles.subcatName}>{sub.name}</span>
              <span className={styles.subcatCount}>
                {sub.id === 'all'
                  ? allProducts.length
                  : allProducts.filter(p => p.subcat === sub.id).length}
              </span>
            </button>
          ))}

          {/* Price filter */}
          <div className={styles.priceFilter}>
            <p className={styles.sidebarLabel}>PRICE RANGE</p>
            <div className={styles.priceRow}>
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
            <input
              type="range" min={0} max={1000} step={10}
              value={priceRange[1]}
              className={styles.rangeSlider}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            />
          </div>

          {/* Discount filter */}
          <div className={styles.discountFilter}>
            <p className={styles.sidebarLabel}>OFFERS</p>
            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={onlyDiscount}
                onChange={e => setOnlyDiscount(e.target.checked)}
              />
              <span>On Sale Only</span>
            </label>
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <main className={styles.productArea}>
          {products.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyEmoji}>🔍</span>
              <p>No products match your filters.</p>
              <button
                className={styles.resetBtn}
                onClick={() => {
                  setActiveSubcat('all');
                  setPriceRange([0, 1000]);
                  setOnlyDiscount(false);
                  setSort('relevance');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {products.map(p => (
                <GridProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {showFilters && (
        <div className={styles.drawerBackdrop} onClick={() => setShowFilters(false)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <span>Filters</span>
              <button onClick={() => setShowFilters(false)}>✕</button>
            </div>

            <p className={styles.sidebarLabel}>SUBCATEGORY</p>
            <div className={styles.drawerSubcats}>
              {subcats.map(sub => (
                <button
                  key={sub.id}
                  className={`${styles.subcatBtn} ${activeSubcat === sub.id ? styles.subcatActive : ''}`}
                  onClick={() => { setActiveSubcat(sub.id); setShowFilters(false); }}
                >
                  <span className={styles.subcatEmoji}>{sub.emoji}</span>
                  <span className={styles.subcatName}>{sub.name}</span>
                </button>
              ))}
            </div>

            <div className={styles.priceFilter}>
              <p className={styles.sidebarLabel}>MAX PRICE: ₹{priceRange[1]}</p>
              <input
                type="range" min={0} max={1000} step={10}
                value={priceRange[1]}
                className={styles.rangeSlider}
                onChange={e => setPriceRange([0, Number(e.target.value)])}
              />
            </div>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                checked={onlyDiscount}
                onChange={e => setOnlyDiscount(e.target.checked)}
              />
              <span>On Sale Only</span>
            </label>

            <button
              className={styles.applyBtn}
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
