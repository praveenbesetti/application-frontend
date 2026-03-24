import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCartItems, selectCartCount, selectCartTotal, selectIsLoggedIn,
  addToCart, removeFromCart, clearCart,
  addToCartAPI, removeFromCartAPI, clearCartAPI,
  openAuthModal,
} from '../store';
import styles from './CartPage.module.css';

export default function CartPage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const items      = useSelector(selectCartItems);
  const count      = useSelector(selectCartCount);
  const total      = useSelector(selectCartTotal);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const cartArray  = Object.values(items);

  const deliveryFee = total >= 199 ? 0 : 25;
  const grandTotal  = total + deliveryFee;

  const handleAdd = (item) => {
    const id = item._id || item.id;
    dispatch(addToCart({ ...item, id }));
    if (isLoggedIn) dispatch(addToCartAPI({ productId: id, qty: 1 }));
  };

  const handleRemove = (item) => {
    const id = item._id || item.id;
    dispatch(removeFromCart({ ...item, id }));
    if (isLoggedIn) dispatch(removeFromCartAPI({ productId: id, qty: 1 }));
  };

  const handleClear = () => {
    dispatch(clearCart());
    if (isLoggedIn) dispatch(clearCartAPI());
  };

  const handleCheckout = () => {
    if (!isLoggedIn) { dispatch(openAuthModal()); return; }
    // TODO: navigate to checkout page
    alert('Checkout coming soon!');
  };

  if (cartArray.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add items from the store to get started</p>
        <button className={styles.shopBtn} onClick={() => navigate('/')}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
          <h1 className={styles.title}>My Cart</h1>
          <span className={styles.itemCount}>{count} item{count !== 1 ? 's' : ''}</span>
        </div>

        <div className={styles.layout}>

          {/* ── Items list ── */}
          <div className={styles.itemsList}>

            {/* Delivery progress */}
            {total < 199 ? (
              <div className={styles.deliveryBanner}>
                🎁 Add <strong>₹{(199 - total).toFixed(0)}</strong> more for free delivery
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width:`${Math.min((total / 199) * 100, 100)}%` }} />
                </div>
              </div>
            ) : (
              <div className={styles.freeDelivery}>
                🎉 You've unlocked <strong>Free Delivery!</strong>
              </div>
            )}

            {cartArray.map(item => {
              const id = item._id || item.id;
              return (
                <div key={id} className={styles.cartItem}>
                  <div
                    className={styles.itemImg}
                    onClick={() => navigate(`/product/${id}`, { state: { product: item } })}
                  >
                    {item.emoji}
                  </div>

                  <div className={styles.itemInfo}>
                    <p
                      className={styles.itemName}
                      onClick={() => navigate(`/product/${id}`, { state: { product: item } })}
                    >
                      {item.name}
                    </p>
                    <p className={styles.itemUnit}>{item.unit}</p>
                    <div className={styles.itemPrice}>
                      ₹{item.price}
                      {item.oldPrice && (
                        <span className={styles.itemOld}>₹{item.oldPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.itemQty}>
                    <button className={styles.qtyBtn}  onClick={() => handleRemove(item)}>−</button>
                    <span className={styles.qtyNum}>{item.qty}</span>
                    <button className={`${styles.qtyBtn} ${styles.qtyPlus}`} onClick={() => handleAdd(item)}>+</button>
                  </div>

                  <div className={styles.itemTotal}>
                    ₹{(item.price * item.qty).toFixed(0)}
                  </div>
                </div>
              );
            })}

            <button className={styles.clearBtn} onClick={handleClear}>
              🗑 Clear Cart
            </button>
          </div>

          {/* ── Order Summary ── */}
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal ({count} items)</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? styles.free : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <div className={styles.summaryNote}>
                  Add ₹{(199 - total).toFixed(0)} more for free delivery
                </div>
              )}
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>₹{grandTotal.toFixed(0)}</span>
            </div>

            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              {isLoggedIn ? 'Proceed to Checkout →' : '🔐 Sign In to Checkout'}
            </button>

            <div className={styles.safePayment}>🔒 Safe &amp; Secure Payments</div>
            <div className={styles.paymentIcons}>
              <span>💳</span><span>📱</span><span>🏦</span>
              <span style={{ fontSize:'.74rem', color:'var(--muted)', marginLeft:4 }}>
                UPI · Cards · NetBanking
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
