import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendOtp, verifyOtp,
  closeAuthModal,
  selectAuthModal, selectOtpSent, selectDevOtp,
  selectAuthStatus, selectAuthError, selectAuthPhone,
  setPhone,
} from '../store';
import styles from './AuthModal.module.css';

export default function AuthModal() {
  const dispatch  = useDispatch();
  const open      = useSelector(selectAuthModal);
  const otpSent   = useSelector(selectOtpSent);
  const devOtp    = useSelector(selectDevOtp);
  const status    = useSelector(selectAuthStatus);
  const error     = useSelector(selectAuthError);
  const phone     = useSelector(selectAuthPhone);

  const [tab,   setTab]  = useState('signin');
  const [name,  setName] = useState('');
  const [otp,   setOtp]  = useState('');

  const loading = status === 'loading';

  if (!open) return null;

  const close = () => dispatch(closeAuthModal());

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

  return (
    <div className={styles.backdrop} onClick={close}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <button className={styles.close} onClick={close}>✕</button>

        <div className={styles.logo}>
          Quick<span className={styles.logoBadge}>⚡</span>
        </div>

        {!otpSent ? (
          <>
            <h2 className={styles.title}>
              {tab === 'signin' ? 'Sign in to continue 👋' : 'Create account 🎉'}
            </h2>
            <p className={styles.sub}>Sign in to add items to your cart</p>

            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tab === 'signin'   ? styles.tabActive : ''}`}
                onClick={() => setTab('signin')}
              >Sign In</button>
              <button
                className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
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
                  <span className={styles.code}>🇮🇳 +91</span>
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
                  ? <><span className={styles.spin}>⟳</span> Sending…</>
                  : 'Send OTP →'}
              </button>
            </form>

            <div className={styles.divider}><span>OR</span></div>
            <button className={styles.googleBtn}>
              <span className={styles.googleIcon}>G</span>
              Continue with Google
            </button>
          </>
        ) : (
          <>
            <h2 className={styles.title}>Enter OTP 📱</h2>
            <p className={styles.sub}>Sent to +91 {phone}</p>

            {/* Dev mode helper */}
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
          By continuing you agree to our{' '}
          <span>Terms</span> &amp; <span>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
