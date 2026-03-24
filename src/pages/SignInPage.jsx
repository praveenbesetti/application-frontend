import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendOtp, verifyOtp, logoutUser,
  selectIsLoggedIn, selectUser,
  selectOtpSent, selectDevOtp,
  selectAuthStatus, selectAuthError,
  selectAuthPhone, setPhone,
} from '../store';
import styles from './SignInPage.module.css';

export default function SignInPage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user       = useSelector(selectUser);
  const otpSent    = useSelector(selectOtpSent);
  const devOtp     = useSelector(selectDevOtp);
  const status     = useSelector(selectAuthStatus);
  const error      = useSelector(selectAuthError);
  const phone      = useSelector(selectAuthPhone);

  const [tab,  setTab]  = useState('signin');
  const [name, setName] = useState('');
  const [otp,  setOtp]  = useState('');

  const loading = status === 'loading';

  // Redirect to home after login
  useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) return;
    dispatch(sendOtp(phone));
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length < 4) return;
    dispatch(verifyOtp({
      phone,
      otp,
      name: tab === 'register' ? name : undefined,
    }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Already logged in — show profile
  if (isLoggedIn && user) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.logo}>Quick<span className={styles.logoBadge}>⚡</span></div>

          <div className={styles.profileSection}>
            <div className={styles.avatar}>
              {user.name ? user.name[0].toUpperCase() : '👤'}
            </div>
            <h2 className={styles.profileName}>{user.name || 'QuickBasket User'}</h2>
            <p className={styles.profilePhone}>+91 {user.phone}</p>
            {user.email && <p className={styles.profileEmail}>{user.email}</p>}
          </div>

          <div className={styles.profileMenu}>
            <button className={styles.menuItem} onClick={() => navigate('/cart')}>
              🛒 My Cart
            </button>
            <button className={styles.menuItem}>
              🧾 My Orders
            </button>
            <button className={styles.menuItem}>
              📍 Saved Addresses
            </button>
            <button className={styles.menuItem}>
              ❤️ Wishlist
            </button>
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            🚪 Sign Out
          </button>

          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Continue Shopping
          </button>
        </div>

        <div className={styles.decorSide}>
          <div className={styles.decorContent}>
            <div className={styles.decorEmojis}>
              <span>🥦</span><span>🍎</span><span>🥛</span>
              <span>💊</span><span>📱</span><span>💄</span>
            </div>
            <h2>Welcome back,<br /><span>{user.name || 'friend'}!</span></h2>
            <p>Everything you need, delivered in 10–15 minutes.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.logo}>Quick<span className={styles.logoBadge}>⚡</span></div>

        {!otpSent ? (
          <>
            <h1 className={styles.title}>
              {tab === 'signin' ? 'Welcome back 👋' : 'Create account 🎉'}
            </h1>
            <p className={styles.subtitle}>
              {tab === 'signin'
                ? 'Sign in to track orders & save addresses'
                : 'Join millions shopping on QuickBasket'}
            </p>

            <div className={styles.tabs}>
              <button
                className={`${styles.tabBtn} ${tab === 'signin' ? styles.tabActive : ''}`}
                onClick={() => setTab('signin')}
              >Sign In</button>
              <button
                className={`${styles.tabBtn} ${tab === 'register' ? styles.tabActive : ''}`}
                onClick={() => setTab('register')}
              >Register</button>
            </div>

            <form onSubmit={handleSendOtp} className={styles.form}>
              {tab === 'register' && (
                <div className={styles.field}>
                  <label>Full Name</label>
                  <input
                    type="text" value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name" required
                  />
                </div>
              )}

              <div className={styles.field}>
                <label>Mobile Number</label>
                <div className={styles.phoneRow}>
                  <span className={styles.countryCode}>🇮🇳 +91</span>
                  <input
                    type="tel" value={phone}
                    onChange={e => dispatch(setPhone(e.target.value.replace(/\D/g,'').slice(0,10)))}
                    placeholder="98765 43210"
                    required maxLength={10}
                  />
                </div>
              </div>

              {error && <p className={styles.errorMsg}>⚠️ {error}</p>}

              <button
                className={styles.submitBtn} type="submit"
                disabled={loading || phone.length < 10}
              >
                {loading
                  ? <><span className={styles.spin}>⟳</span> Sending OTP…</>
                  : 'Send OTP →'}
              </button>
            </form>

            <div className={styles.divider}><span>OR</span></div>
            <button className={styles.socialBtn}>
              <span className={styles.googleIcon}>G</span>
              Continue with Google
            </button>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Verify OTP 📱</h1>
            <p className={styles.subtitle}>Enter the 6-digit code sent to +91 {phone}</p>

            {devOtp && (
              <div className={styles.devOtp}>
                🔧 Dev OTP: <strong>{devOtp}</strong>
              </div>
            )}

            <form onSubmit={handleVerify} className={styles.form}>
              <div className={styles.field}>
                <label>6-digit OTP</label>
                <input
                  type="tel" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                  placeholder="• • • • • •"
                  className={styles.otpInput}
                  maxLength={6} autoFocus required
                />
              </div>

              {error && <p className={styles.errorMsg}>⚠️ {error}</p>}

              <button
                className={styles.submitBtn} type="submit"
                disabled={loading || otp.length < 4}
              >
                {loading
                  ? <><span className={styles.spin}>⟳</span> Verifying…</>
                  : 'Verify & Continue →'}
              </button>
            </form>

            <button
              className={styles.changeBtn}
              onClick={() => { dispatch(setPhone('')); setOtp(''); }}
            >
              ← Change number
            </button>
          </>
        )}

        <p className={styles.terms}>
          By continuing, you agree to our{' '}
          <span className={styles.link}>Terms of Service</span> and{' '}
          <span className={styles.link}>Privacy Policy</span>
        </p>

        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Continue Shopping
        </button>
      </div>

      {/* Decorative right panel */}
      <div className={styles.decorSide}>
        <div className={styles.decorContent}>
          <div className={styles.decorEmojis}>
            <span>🥦</span><span>🍎</span><span>🥛</span>
            <span>💊</span><span>📱</span><span>💄</span>
          </div>
          <h2>Everything delivered in<br /><span>10–15 minutes</span></h2>
          <p>Fresh groceries, medicines, electronics and more — right to your door.</p>
          <div className={styles.decorStats}>
            <div><strong>10M+</strong><span>Happy customers</span></div>
            <div><strong>50K+</strong><span>Products</span></div>
            <div><strong>15 min</strong><span>Avg delivery</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
