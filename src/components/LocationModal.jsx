import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  detectLocation,
  setManualLocation,
  selectConfirmed,
  selectLocStatus,
  selectLocError,
} from '../store';
import { CITIES } from '../data/staticData';
import styles from './LocationModal.module.css';

export default function LocationModal() {
  const dispatch   = useDispatch();
  const confirmed  = useSelector(selectConfirmed);
  const status     = useSelector(selectLocStatus);
  const error      = useSelector(selectLocError);
  const [query, setQuery] = useState('');

  // Silent auto-detect on mount
  useEffect(() => {
    if (!confirmed && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => dispatch(detectLocation()),
        () => {},
        { timeout: 2000, maximumAge: 300000 }
      );
    }
  }, []); // eslint-disable-line

  const pick   = (city) => dispatch(setManualLocation({ city, address: city }));
  const skip   = () => dispatch(setManualLocation({ city: 'All India', address: 'All India' }));
  const submit = (e) => { e.preventDefault(); if (query.trim()) pick(query.trim()); };

  const filtered = CITIES.filter(c => c.toLowerCase().includes(query.toLowerCase()));

  if (confirmed) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.card}>
        {/* Close */}
        <button className={styles.close} onClick={skip}>✕</button>

        {/* Heading */}
        <div className={styles.header}>
          <span className={styles.pin}>📍</span>
          <h2>Where should we deliver?</h2>
          <p>Pick your city to see products available near you</p>
        </div>

        {/* Auto detect */}
        <button
          className={styles.detectBtn}
          onClick={() => dispatch(detectLocation())}
          disabled={status === 'loading'}
        >
          {status === 'loading'
            ? <><span className={styles.spin}>⟳</span> Detecting…</>
            : '🎯  Use My Current Location'}
        </button>

        {/* Error */}
        {error && <div className={styles.error}>⚠️ {error}</div>}

        {/* Divider */}
        <div className={styles.divider}><span>OR PICK A CITY</span></div>

        {/* Search */}
        <form onSubmit={submit} className={styles.searchRow}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search city or area…"
          />
          <button type="submit">Go</button>
        </form>

        {/* Cities */}
        <p className={styles.citiesLabel}>POPULAR CITIES</p>
        <div className={styles.cities}>
          {filtered.map(city => (
            <button key={city} className={styles.cityBtn} onClick={() => pick(city)}>
              {city}
            </button>
          ))}
        </div>

        {/* Skip */}
        <div className={styles.skipRow}>
          <span onClick={skip}>Skip — Browse all products</span>
        </div>
      </div>
    </div>
  );
}
