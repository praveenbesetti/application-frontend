import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  fetchFeaturedProducts, fetchBanners,
  selectByCategory, selectBanners, selectPromoCards,
  selectOfferFilters, selectActiveFilter, selectHomeStatus,
  setActiveFilter, selectAllCategories, selectCity,
} from '../store';

import HeroBanner from '../components/HeroBanner';
import TrustBar from '../components/TrustBar';
import PromoStrip from '../components/PromoStrip';
import ParentCatGrid from '../components/ParentCatGrid';
import OfferChips from '../components/OfferChips';
import SectionHeader from '../components/SectionHeader';
import HScroll from '../components/HScroll';
import SubcatCard from '../components/SubcatCard';
import ProductCard from '../components/ProductCard';
import styles from './HomePage.module.css';

const HOME_SECTIONS = [
  { catId: 'groceries', subTitle: '🛒 Groceries', prodTitle: '🌾 Grocery Essentials' },
  { catId: 'vegetables', subTitle: '🥦 Shop by Vegetable', prodTitle: '🌿 Fresh Vegetables' },
  // { catId: 'fruits', subTitle: '🍎 Shop by Fruit', prodTitle: '🍉 Seasonal Fruits' },
  // { catId: 'dairy', subTitle: '🥛 Dairy, Bread & Eggs', prodTitle: '🥚 Daily Essentials' },
  // { catId: 'beauty', subTitle: '💄 Beauty & Personal Care', prodTitle: null },
  // { catId: 'electronics', subTitle: '📱 Electronics & Gadgets', prodTitle: null },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const city = useSelector(selectCity);
  const cats = useSelector(selectAllCategories);
  const byCategory = useSelector(selectByCategory);
  const banners = useSelector(selectBanners);
  const promoCards = useSelector(selectPromoCards);
  const offerFilters = useSelector(selectOfferFilters);
  const activeFilter = useSelector(selectActiveFilter);
  const homeStatus = useSelector(selectHomeStatus);

  useEffect(() => {
    if (homeStatus === 'idle') dispatch(fetchFeaturedProducts());
    if (banners.length === 0) dispatch(fetchBanners());
  }, [dispatch, homeStatus, banners.length]);

  // Category uses slug (from backend)
  const findCat = (slug) => cats.find(c => c.slug === slug);
  const goToCat = (slug) => navigate(`/category/${slug}`);
  const goToSubcat = (slug, subSlug) => navigate(`/category/${slug}?subcat=${subSlug}`);
  const goToProduct = (p) => navigate(`/product/${p._id || p.id}`, { state: { product: p } });

  const isLoading = homeStatus === 'loading';

  return (
    <main className={styles.main}>

      <div className="dlv-badge">
        <span className="blink-dot" />
        {' '}⚡ Delivery in 10–15 minutes · {city || 'All India'}
      </div>

      <HeroBanner banners={banners} />
      <TrustBar />
      <PromoStrip cards={promoCards} />

      {/* Desktop: All Categories grid */}
      <div className={styles.allCatsSection}>
        {/* <SectionHeader title="🛒 All Categories" /> */}
        {/* <ParentCatGrid cats={cats} onCategoryClick={goToCat} /> */}
      </div>

      {/* Mobile: horizontal icon scroll */}
      <div className={styles.mobileCats}>
        <div className={styles.mobileCatsScroll}>
          {cats.map(cat => (
            <div
              key={cat.slug}
              className={styles.mobileCatItem}
              onClick={() => goToCat(cat.slug)}
            >
              <div className={styles.mobileCatIcon} style={{ background: cat.bg }}>
                {cat.imageUrl
                  ? <img src={cat.imageUrl} alt={cat.name}
                    style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 10 }}
                    onLoad={e => e.target.classList.add('loaded')}
                    onError={e => { e.target.style.display = 'none'; }} />
                  : cat.emoji
                }
              </div>
              <span className={styles.mobileCatName}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      <OfferChips
        filters={offerFilters}
        active={activeFilter}
        onSelect={(f) => dispatch(setActiveFilter(f))}
      />

      {HOME_SECTIONS.map(({ catId, subTitle, prodTitle }) => {
        const cat = findCat(catId);
        const products = byCategory[catId] || [];
        if (!cat) return null;

        return (
          <div key={catId}>
            {/* Subcategory chips */}
            <div className={styles.section}>
              <SectionHeader title={subTitle} onSeeAll={() => goToCat(catId)} />
              <HScroll>
                {(cat.subcategories || []).map(sub => (
                  <SubcatCard
                    key={sub._id || sub.id || sub.slug}
                    sub={sub}
                    onClick={() => goToSubcat(catId, sub.slug)}
                  />
                ))}
              </HScroll>
            </div>

            {/* Products */}
            {prodTitle && (
              <div className={styles.section}>
                <SectionHeader title={prodTitle} onSeeAll={() => goToCat(catId)} />
                {isLoading ? (
                  <div style={{ display: 'flex', gap: 14 }}>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="skel" style={{ width: 160, height: 228, flexShrink: 0, borderRadius: 14 }} />
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <HScroll>
                    {products.map(p => (
                      <ProductCard
                        key={p._id || p.id}
                        product={p}
                        onClick={() => goToProduct(p)}
                      />
                    ))}
                  </HScroll>
                ) : null}
              </div>
            )}
          </div>
        );
      })}
    </main>
  );
}
