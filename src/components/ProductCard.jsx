import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart, removeFromCart,
  addToCartAPI, removeFromCartAPI,
  selectItemQty, selectIsLoggedIn,
  openAuthModal,
} from '../store';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, onClick }) {
  const dispatch = useDispatch();
  const id = product._id || product.id;
  const qty = useSelector(selectItemQty(id));
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [flash, setFlash] = useState(false);
  const outOfStock = product.inStock === false || product.stock === 0;
  console.log("home page,",product)
  const add = (e) => {
    e.stopPropagation();

    // Not logged in → open sign in modal
    if (!isLoggedIn) {
      dispatch(openAuthModal());
      return;
    }

    // Optimistic local update
    dispatch(addToCart({ ...product, id }));
    setFlash(true);
    setTimeout(() => setFlash(false), 800);

    // Sync with backend
    dispatch(addToCartAPI({ productId: id, qty: 1 }));
  };

  const rem = (e) => {
    e.stopPropagation();
    dispatch(removeFromCart({ ...product, id }));
    if (isLoggedIn) {
      dispatch(removeFromCartAPI({ productId: id, qty: 1 }));
    }
  };

  const badgeBg =
    product.badge === 'ORGANIC' ? 'var(--green)' :
      product.badge === 'FRESH' ? '#0088cc' :
        product.badge === 'BEST SELLER' ? '#7040c8' :
          product.badge === 'POPULAR' ? '#e07b00' : 'var(--orange)';

  return (
  <div
    className={`${styles.card} ${outOfStock ? styles.outOfStock : ''}`}
    onClick={!outOfStock ? onClick : undefined}
    style={{ cursor: outOfStock ? 'default' : onClick ? 'pointer' : 'default' }}
  >
    {/* Badge — absolute over image */}
    {product.badge && !outOfStock && (
      <div className={styles.badge} style={{ background: badgeBg }}>
        {product.badge}
      </div>
    )}
    {outOfStock && <div className={styles.oosLabel}>Out of Stock</div>}

    {/* Image */}
    <div className={`${styles.img} ${outOfStock ? styles.imgGrey : ''}`}>
      {product.imageUrl
        ? <img
            src={product.imageUrl}
            alt={product.name}
            ref={el => { if (el && el.complete) el.classList.add('loaded'); }}
          onLoad={e => e.target.classList.add('loaded')}
            onError={e => { e.target.style.display = 'none'; }}
          />
        : <span>{product.emoji}</span>
      }
    </div>

    {/* Details */}
    <div className={styles.details}>
      <div className={styles.name}>{product.name}</div>
      <div className={styles.qty}>{product.unit || product.qty}</div>

      <div className={styles.footer}>
        <div>
          {product.oldPrice && (
            <span className={styles.oldPrice}>₹{product.oldPrice}</span>
          )}
          <span className={styles.price}>₹{product.price}</span>
        </div>

        {outOfStock ? (
          <button className={styles.oosBtn} disabled>Notify</button>
        ) : qty === 0 ? (
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
            <button className={`${styles.qtyBtn} ${styles.plus}`} onClick={add}>+</button>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
