import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  resetLocation, searchProducts, clearSearch,
  selectCity, selectAllCategories,
  selectCartCount, selectSearchResults, selectSearchStatus,
  selectIsLoggedIn, selectUser, openAuthModal,
} from '../store';
import styles from './Header.module.css';

// ── Category dropdown ──────────────────────────────────────
function CatDropdown({ cat }) {
  const navigate = useNavigate();
  return (
    <div className={styles.dropdown}>
       <div 
        className={`${styles.dropItem} ${styles.viewAllItem}`}
        onClick={() => navigate(`/category/${cat.slug}`)}
      >
        <span className={styles.dropItemEmoji}>✨</span>
        <span className={styles.viewAllText}>View All Products</span>
      </div>
      {(cat.subcategories || []).map(sub => (
        <div
          key={sub._id || sub.slug}
          className={styles.dropItem}
          onClick={() => navigate(`/category/${cat.slug}?subcat=${sub.slug}`)}
        >
          <span className={styles.dropItemEmoji}>{sub.emoji}</span>
          <span>{sub.name}</span>
        </div>
      ))}
    </div>
  );
}

// ── Search bar ─────────────────────────────────────────────
function SearchBar({ mobile = false }) {
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const searchResults = useSelector(selectSearchResults);
  const searchStatus  = useSelector(selectSearchStatus);
  const [query,   setQuery]   = useState('');
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length >= 2) dispatch(searchProducts(val.trim()));
    else dispatch(clearSearch());
  };

  const handleSelect = (product) => {
    navigate(`/product/${product._id || product.id}`, { state: { product } });
    setQuery('');
    dispatch(clearSearch());
    setFocused(false);
  };

  const showDrop = focused && query.length >= 2;

  return (
    <div className={mobile ? styles.mobileSearchWrap : styles.searchWrap}>
      <div className={mobile ? styles.mobileSearch : styles.search}>
        <span>🔍</span>
        <input
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search groceries, medicines, electronics…"
        />
        {searchStatus === 'loading' && (
          <span style={{ fontSize:'.8rem', color:'var(--muted)', animation:'spin 1s linear infinite', display:'inline-block' }}>⟳</span>
        )}
      </div>

      {showDrop && searchResults.length > 0 && (
        <div className={styles.searchResults}>
          {searchResults.map(p => (
            <div key={p._id} className={styles.searchItem} onMouseDown={() => handleSelect(p)}>
              <span className={styles.searchEmoji}>{p.emoji}</span>
              <div className={styles.searchInfo}>
                <span className={styles.searchName}>{p.name}</span>
                <span className={styles.searchMeta}>{p.unit} · ₹{p.price}</span>
              </div>
              <span className={styles.searchCat}>{p.categorySlug}</span>
            </div>
          ))}
        </div>
      )}

      {showDrop && query.length >= 2 && searchResults.length === 0 && searchStatus === 'succeeded' && (
        <div className={styles.searchResults}>
          <div className={styles.searchEmpty}>No results for "{query}"</div>
        </div>
      )}
    </div>
  );
}

// ── Desktop Header ─────────────────────────────────────────
export function DesktopHeader() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const city       = useSelector(selectCity);
  const cats       = useSelector(selectAllCategories);
  const cartCount  = useSelector(selectCartCount);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user       = useSelector(selectUser);
  const [hovered, setHovered] = useState(null);

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.logo} onClick={() => navigate('/')} style={{ cursor:'pointer' }}>
          Quick<span className={styles.logoBadge}>⚡</span>
        </div>

        <button className={styles.locBtn} onClick={() => dispatch(resetLocation())}>
          📍 <span className={styles.locText}>{city || 'Set Location'} ▾</span>
        </button>

        <SearchBar />

        <div className={styles.actions}>
          <button className={`${styles.iconBtn} ${styles.hideOnTablet}`}>❤️</button>
          <button  className={`${styles.iconBtn} ${styles.hideOnTablet}`}  onClick={() => navigate('/SurveyForm')}>📋</button>
          <button
            className={`${styles.iconBtn} ${styles.cartBtn}`}
            onClick={() => navigate('/cart')}
          >
            🛒
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </button>

          {isLoggedIn ? (
            <button className={styles.signInBtn} onClick={() => navigate('/signin')}>
              <span className={styles.userAvatar}>
                {user?.name ? user.name[0].toUpperCase() : '👤'}
              </span>
              {/* <span className={styles.userName}>
                {user?.name?.split(' ')[0] || 'Account'}
              </span> */}
            </button>
          ) : (
            <button className={styles.signInBtn} onClick={() => dispatch(openAuthModal())}>
              👤 Sign In
            </button>
          )}
        </div>
      </div>

      {/* Category strip */}
     <div className={styles.catWrap} onMouseLeave={() => setHovered(null)}>
        <div className={styles.catStrip}>
          {cats.map(cat => (
            /* 1. Make each chip a 'relative' anchor */
            <div
              key={cat.slug}
              className={`${styles.catChip} ${hovered?.slug === cat.slug ? styles.active : ''}`}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHovered(cat)}
              onClick={() => navigate(`/category/${cat.slug}`)}
            >
              <span className={styles.chipEm}>{cat.emoji}</span>
              {cat.name}
              {/* 2. Place the dropdown INSIDE the chip so it's anchored to it */}
              {hovered?.slug === cat.slug && <CatDropdown cat={cat} />}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

// ── Mobile Header ──────────────────────────────────────────
export function MobileHeader() {
  const dispatch = useDispatch();
  const city     = useSelector(selectCity);

  return (
    <div className={styles.mobileHeader}>
      <button className={styles.mobileLocBtn} onClick={() => dispatch(resetLocation())}>
        📍 <span>{city || 'Set your delivery location'}</span>
        <span className={styles.caret}>▾</span>
      </button>
      <SearchBar mobile />
    </div>
  );
}
