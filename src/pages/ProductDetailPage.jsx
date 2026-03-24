import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart, removeFromCart,
  addToCartAPI, removeFromCartAPI,
  fetchRelatedProducts, clearRelated,
  openAuthModal,
  selectItemQty, selectIsLoggedIn,
  selectRelatedProducts, selectRelatedStatus,
} from '../store';
import styles from './ProductDetailPage.module.css';
import ProductCard from '../components/ProductCard';
import HScroll from '../components/HScroll';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const product = state?.product;
  const id = product?._id || product?.id;
  const qty = useSelector(selectItemQty(id || ''));
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const related = useSelector(selectRelatedProducts);
  const relStatus = useSelector(selectRelatedStatus);

  const [flash, setFlash] = useState(false);
  const [imgZoomed, setImgZoom] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (id) dispatch(fetchRelatedProducts(id));
    return () => dispatch(clearRelated());
  }, [id, dispatch]);

  const add = () => {
    if (!isLoggedIn) { dispatch(openAuthModal()); return; }
    dispatch(addToCart({ ...product, id }));
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
    dispatch(addToCartAPI({ productId: id, qty: 1 }));
  };
  const rem = () => {
    dispatch(removeFromCart({ ...product, id }));
    if (isLoggedIn) dispatch(removeFromCartAPI({ productId: id, qty: 1 }));
  };

  if (!product) {
    return (
      <div className={styles.notFound}>
        <span>😕</span>
        <p>Product not found.</p>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  const discountPct = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const badgeBg =
    product.badge === 'ORGANIC' ? '#16a05a' :
      product.badge === 'FRESH' ? '#0088cc' :
        product.badge === 'BEST SELLER' ? '#7040c8' :
          product.badge === 'POPULAR' ? '#e07b00' : '#f95d2b';

  const goToProduct = (p) =>
    navigate(`/product/${p._id || p.id}`, { state: { product: p } });

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>

        <div className={styles.detailCard}>

          {/* ── Image side ── */}
          <div className={styles.imageSide}>
            <div
              className={`${styles.imageBox} ${imgZoomed ? styles.imageZoomed : ''}`}
              onClick={() => setImgZoom(v => !v)}
            >
              {product.badge && (
                <span className={styles.badge} style={{ background: badgeBg }}>
                  {product.badge}
                </span>
              )}
              {discountPct > 0 && (
                <span className={styles.discountBubble}>{discountPct}% OFF</span>
              )}
              <div className={styles.productEmoji}>
                {product.imageUrl
                  ? <img src={product.imageUrl} alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                    onLoad={e => e.target.classList.add('loaded')}
                    onError={e => { e.target.style.display = 'none'; }} />
                  : <span style={{ fontSize: '8rem' }}>{product.emoji}</span>
                }
              </div>
              <p className={styles.zoomHint}>{imgZoomed ? 'Click to zoom out' : 'Click to zoom'}</p>
            </div>

            {/* Delivery trust */}
            <div className={styles.deliveryBox}>
              <div className={styles.deliveryRow}>
                <span>⚡</span>
                <div><strong>10–15 min delivery</strong><p>Express delivery available</p></div>
              </div>
              <div className={styles.deliveryRow}>
                <span>🔄</span>
                <div><strong>Easy returns</strong><p>7-day return policy</p></div>
              </div>
              <div className={styles.deliveryRow}>
                <span>✅</span>
                <div><strong>100% Fresh</strong><p>Quality guaranteed</p></div>
              </div>
            </div>
          </div>

          {/* ── Info side ── */}
          <div className={styles.infoSide}>

            {/* Breadcrumb */}
            <div className={styles.category}>
              <span
                className={styles.catLink}
                onClick={() => navigate(`/category/${product.categorySlug}`)}
              >
                {product.categorySlug}
              </span>
              {product.subcategorySlug && (
                <>
                  <span className={styles.catSep}>›</span>
                  <span
                    className={styles.catLink}
                    onClick={() => navigate(`/category/${product.categorySlug}?subcat=${product.subcategorySlug}`)}
                  >
                    {product.subcategorySlug}
                  </span>
                </>
              )}
            </div>

            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.unit}>{product.unit}</p>

            {/* Price */}
            <div className={styles.priceBlock}>
              <span className={styles.price}>₹{product.price}</span>
              {product.oldPrice && (
                <>
                  <span className={styles.oldPrice}>₹{product.oldPrice}</span>
                  <span className={styles.saving}>
                    Save ₹{product.oldPrice - product.price} ({discountPct}%)
                  </span>
                </>
              )}
            </div>

            {/* Stock status */}
            <div className={styles.stockBadge}>
              {product.inStock !== false
                ? <><span className={styles.stockDot} /> In Stock</>
                : <span style={{ color: 'var(--orange)' }}>Out of Stock</span>
              }
            </div>

            {/* Cart controls */}
            <div className={styles.cartSection}>
              {qty === 0 ? (
                <button
                  className={styles.addToCartBtn}
                  onClick={add}
                  disabled={product.inStock === false}
                >
                  {flash ? '✓ Added!' : '🛒 Add to Cart'}
                </button>
              ) : (
                <div className={styles.qtyRow}>
                  <button className={styles.qtyBtn} onClick={rem}>−</button>
                  <span className={styles.qtyNum}>{qty}</span>
                  <button className={`${styles.qtyBtn} ${styles.qtyPlus}`} onClick={add}>+</button>
                  <span className={styles.qtyTotal}>₹{(product.price * qty).toFixed(0)} total</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className={styles.tags}>
                {product.tags.map(t => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            )}

            {/* Details table */}
            <div className={styles.detailsTable}>
              <h3>Product Details</h3>
              <div className={styles.detailRow}>
                <span>Weight / Volume</span><span>{product.unit}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Category</span>
                <span style={{ textTransform: 'capitalize' }}>{product.categorySlug}</span>
              </div>
              {product.subcategorySlug && (
                <div className={styles.detailRow}>
                  <span>Sub-category</span>
                  <span style={{ textTransform: 'capitalize' }}>{product.subcategorySlug}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span>Availability</span>
                <span style={{ color: 'var(--green)', fontWeight: 700 }}>
                  {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {relStatus === 'loading' && (
          <div>
            <div className="skel" style={{ width: 200, height: 28, borderRadius: 8, marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 14 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skel" style={{ width: 160, height: 228, flexShrink: 0, borderRadius: 14 }} />
              ))}
            </div>
          </div>
        )}

        {relStatus === 'succeeded' && related.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>
              More from {product.categorySlug}
            </h2>
            <HScroll>
              {related.map(p => (
                <ProductCard
                  key={p._id || p.id}
                  product={p}
                  onClick={() => goToProduct(p)}
                />
              ))}
            </HScroll>
          </div>
        )}

      </div>
    </div>
  );
}
