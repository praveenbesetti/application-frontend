import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchCategoryBySlug, fetchCategoryProducts,
  clearCategoryProducts, clearCurrentCategory,
  addToCart, removeFromCart,
  addToCartAPI, removeFromCartAPI,
  openAuthModal,
  selectCurrentCategory, selectCurrentCatStatus,
  selectCategoryProducts, selectCategoryTotal,
  selectCategoryStatus, selectCategoryError,
  selectItemQty, selectIsLoggedIn,
} from '../store';

import { SORT_OPTIONS } from '../data/categoryData';
import styles from './CategoryPage.module.css';

// ── Product card for the grid ──────────────────────────────
function GridProductCard({ product, onClick }) {
  const dispatch = useDispatch();
  const id = product._id || product.id;
  const qty = useSelector(selectItemQty(id));
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [flash, setFlash] = useState(false);
  const outOfStock = product.inStock === false || product.stock === 0;

  const add = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) { dispatch(openAuthModal()); return; }
    dispatch(addToCart({ ...product, id }));
    setFlash(true);
    setTimeout(() => setFlash(false), 700);
    dispatch(addToCartAPI({ productId: id, qty: 1 }));
  };
  const rem = (e) => {
    e.stopPropagation();
    dispatch(removeFromCart({ ...product, id }));
    if (isLoggedIn) dispatch(removeFromCartAPI({ productId: id, qty: 1 }));
  };

  const badgeBg =
    product.badge === 'ORGANIC' ? '#16a05a' :
      product.badge === 'FRESH' ? '#0088cc' :
        product.badge === 'BEST SELLER' ? '#7040c8' :
          product.badge === 'POPULAR' ? '#e07b00' : '#f95d2b';

  return (
    <div className={styles.productCard} onClick={onClick}>
      {product.badge && (
        <span className={styles.productBadge} style={{ background: badgeBg }}>
          {product.badge}
        </span>
      )}

      <div className={styles.productImg}>
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name}
            onLoad={e => e.target.classList.add('loaded')}
            onError={e => { e.target.style.display = 'none'; }} />
          : <span>{product.emoji}</span>
        }

      </div>
      <div className={styles.productInfo}>
        <p className={styles.productName}>{product.name}</p>
        <p className={styles.productQty}>{product.unit}</p>
      </div>
      <div className={styles.productFooter}>
        <div>
          {product.oldPrice && <span className={styles.oldPrice}>₹{product.oldPrice}</span>}
          <span className={styles.price}>₹{product.price}</span>
        </div>
        {qty === 0 ? (
          <button className={styles.addBtn} onClick={add}
            style={{ background: flash ? 'var(--green)' : 'var(--green-light)', color: flash ? '#fff' : 'var(--green)' }}>
            {flash ? '✓' : '+'}
          </button>
        ) : (
          <div className={styles.qtyCtrl}>
            <button className={`${styles.qtyBtn} ${styles.minus}`} onClick={rem}>−</button>
            <span className={styles.qtyNum}>{qty}</span>
            <button className={`${styles.qtyBtn} ${styles.plus}`} onClick={add}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Category Page ──────────────────────────────────────────
export default function CategoryPage() {
  const { catId } = useParams();   // this is actually the slug e.g. "groceries"
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = useSelector(selectCurrentCategory);
  const catStatus = useSelector(selectCurrentCatStatus);
  const products = useSelector(selectCategoryProducts);
  const total = useSelector(selectCategoryTotal);
  const prodStatus = useSelector(selectCategoryStatus);
  const prodError = useSelector(selectCategoryError);

  const [activeSubcat, setActiveSubcat] = useState(searchParams.get('subcat') || 'all');
  const [sortBy, setSort] = useState('relevance');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoryBySlug(catId));
    return () => {
      dispatch(clearCurrentCategory());
      dispatch(clearCategoryProducts());
    };
  }, [catId, dispatch]);

  // Sync subcat from URL on mount
  useEffect(() => {
    const sub = searchParams.get('subcat');
    if (sub) setActiveSubcat(sub);
  }, []); // eslint-disable-line

  // Fetch products when filters change — uses slugs not ObjectIds
  useEffect(() => {
    dispatch(fetchCategoryProducts({
      categorySlug: catId,                                          // slug e.g. "groceries"
      subcat: activeSubcat !== 'all' ? activeSubcat : '',    // slug e.g. "atta"
      sort: sortBy,
      maxPrice: maxPrice < 1000 ? maxPrice : undefined,
      onSale: onlyDiscount,
    }));
  }, [catId, activeSubcat, sortBy, maxPrice, onlyDiscount, dispatch]);

  const handleSubcatChange = (slug) => {
    setActiveSubcat(slug);
    setShowDrawer(false);
    setSearchParams(slug === 'all' ? {} : { subcat: slug });
  };

  const resetFilters = () => {
    setActiveSubcat('all');
    setMaxPrice(1000);
    setOnlyDiscount(false);
    setSort('relevance');
    setSearchParams({});
  };

  const goToProduct = (p) =>
    navigate(`/product/${p._id || p.id}`, { state: { product: p, categorySlug: catId } });

  // Loading state
  if (catStatus === 'loading') {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader} style={{ background: '#f2f8f5' }}>
          <div className={styles.pageHeaderInner}>
            <div className="skel" style={{ width: 80, height: 36, borderRadius: 10 }} />
            <div className="skel" style={{ width: 200, height: 40, borderRadius: 10 }} />
          </div>
        </div>
        <div className={styles.body}>
          <div className="skel" style={{ width: 230, height: 400, borderRadius: 18 }} />
          <div className={styles.grid}>
            {[...Array(8)].map((_, i) => <div key={i} className="skel" style={{ height: 240, borderRadius: 16 }} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!category) return null;

  const subcats = [
    { _id: 'all', slug: 'all', name: 'All Items', emoji: category.emoji },
    ...(category.subcategories || []),
  ];

  const FilterPanel = () => (
    <>
      <p className={styles.filterLabel}>
        SUBCATEGORIES
        <span
          onClick={() => navigate('/')}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--green)';
            e.currentTarget.style.borderColor = 'var(--green)';
            e.currentTarget.style.backgroundColor = 'var(--green-light)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'black';
            e.currentTarget.style.borderColor = 'black';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          style={{
            cursor: 'pointer',
            color: 'black',
            fontWeight: 700,
            fontSize: '0.75rem',
            border: '1.5px solid black',
            borderRadius: '8px',
            padding: '4px 10px',
            marginLeft: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s',
          }}
        >
          ← Back
        </span>
      </p>
      {subcats.map(sub => (
        <button
          key={sub._id || sub.slug}
          className={`${styles.subcatBtn} ${activeSubcat === sub.slug ? styles.subcatActive : ''}`}
          onClick={() => handleSubcatChange(sub.slug)}
        >
          <span className={styles.subcatEmoji}>{sub.emoji}</span>
          <span className={styles.subcatName}>{sub.name}</span>
        </button>
      ))}

      <div className={styles.filterBlock}>
        <p className={styles.filterLabel}>MAX PRICE</p>
        <div className={styles.priceRow}>
          <span>₹0</span>
          <span className={styles.priceVal}>{maxPrice >= 1000 ? 'Any' : `₹${maxPrice}`}</span>
        </div>
        <input
          type="range" min={0} max={1000} step={10}
          value={maxPrice} className={styles.slider}
          onChange={e => setMaxPrice(Number(e.target.value))}
        />
      </div>

      <div className={styles.filterBlock}>
        <p className={styles.filterLabel}>OFFERS</p>
        <label className={styles.checkRow}>
          <input type="checkbox" checked={onlyDiscount}
            onChange={e => setOnlyDiscount(e.target.checked)} />
          On Sale Only
        </label>
      </div>

      <button className={styles.resetSmall} onClick={resetFilters}>
        Reset All Filters
      </button>
    </>
  );

  return (
    <div className={styles.page}>

      {/* Page header */}
      <div className={styles.pageHeader} style={{ background: category.bg || '#f2f8f5' }}>
        {/* <div className={styles.pageHeaderInner}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>← Back</button>
          <span className={styles.headerEmoji}>{category.emoji}</span>
          <div>
            <h1 className={styles.pageTitle}>{category.name}</h1>
            <p className={styles.pageSubtitle}>
              {prodStatus === 'loading' ? 'Loading…' : `${total} items`}
            </p>
          </div>
        </div> */}

        {/* Subcat pill strip */}
        {/* <div className={styles.subcatStrip}>
          <div className={styles.subcatStripScroll}>
            {subcats.map(sub => (
              <button
                key={sub._id || sub.slug}
                className={`${styles.subcatPill} ${activeSubcat === sub.slug ? styles.subcatPillActive : ''}`}
                onClick={() => handleSubcatChange(sub.slug)}
              >
                <span>{sub.emoji}</span> {sub.name}
              </button>
            ))}
          </div>
        </div> */}
      </div>

      {/* Toolbar */}
      {/* <div className={styles.toolbar}>
        <div className={styles.activeChips}>
          {activeSubcat !== 'all' && (
            <span className={styles.chip}>
              {subcats.find(s => s.slug === activeSubcat)?.name}
              <button onClick={() => handleSubcatChange('all')}>✕</button>
            </span>
          )}
          {onlyDiscount && (
            <span className={styles.chip}>
              On Sale <button onClick={() => setOnlyDiscount(false)}>✕</button>
            </span>
          )}
          {maxPrice < 1000 && (
            <span className={styles.chip}>
              Under ₹{maxPrice} <button onClick={() => setMaxPrice(1000)}>✕</button>
            </span>
          )}
        </div>

        <div className={styles.toolbarRight}>
          <select className={styles.sortSelect} value={sortBy} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <button className={styles.filterToggle} onClick={() => setShowDrawer(true)}>
            ⚙ Filters
          </button>
        </div>
      </div> */}

      {/* Body */}
      <div className={styles.body}>
        <aside className={styles.sidebar}><FilterPanel /></aside>

        <main className={styles.productArea}>
          {prodStatus === 'loading' ? (
            <div className={styles.grid}>
              {[...Array(8)].map((_, i) => <div key={i} className="skel" style={{ height: 240, borderRadius: 16 }} />)}
            </div>
          ) : prodStatus === 'failed' ? (
            <div className={styles.empty}>
              <span className={styles.emptyEmoji}>❌</span>
              <p>{prodError || 'Failed to load products'}</p>
              <button className={styles.resetBtn} onClick={resetFilters}>Try Again</button>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyEmoji}>🔍</span>
              <p>No products match your filters.</p>
              <button className={styles.resetBtn} onClick={resetFilters}>Reset Filters</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map(p => (
                <GridProductCard key={p._id || p.id} product={p} onClick={() => goToProduct(p)} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile drawer */}
      {showDrawer && (
        <div className={styles.backdrop} onClick={() => setShowDrawer(false)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHead}>
              <span>Filters</span>
              <button onClick={() => setShowDrawer(false)}>✕</button>
            </div>
            <FilterPanel />
            <button className={styles.applyBtn} onClick={() => setShowDrawer(false)}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
}
