import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartCount, selectIsLoggedIn, openAuthModal } from '../store';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const dispatch   = useDispatch();
  const cartCount  = useSelector(selectCartCount);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const items = [
    { id:'home',   icon:'🏠', label:'Home',    path:'/',       action: () => navigate('/') },
    { id:'survey', icon:'🧾', label:'survey',  path:'/orders', action: () => navigate('/SurveyForm') },
    { id:'cart',   icon:'🛒', label:'Cart',    path:'/cart',   action: () => navigate('/cart') },
    {
      id:'me', icon: isLoggedIn ? '👤' : '🔐',
      label: isLoggedIn ? 'Account' : 'Sign In',
      path:'/signin',
      action: () => isLoggedIn ? navigate('/signin') : dispatch(openAuthModal()),
    },
  ];

  return (
    <nav className={styles.nav}>
      {items.map(item => (
        <button
          key={item.id}
          className={`${styles.item} ${location.pathname === item.path ? styles.active : ''}`}
          onClick={item.action}
        >
          <span className={styles.icon}>{item.icon}</span>
          {item.label}
          {item.id === 'cart' && cartCount > 0 && (
            <span className={styles.badge}>{cartCount}</span>
          )}
        </button>
      ))}
    </nav>
  );
}
