import React from 'react';
import styles from './OfferChips.module.css';

export default function OfferChips({ filters, active, onSelect }) {
  return (
    <div className={`${styles.wrap} hs`}>
      {filters.map(f => (
        <button
          key={f.id}
          className={`${styles.chip} ${active === f.id ? styles.active : ''}`}
          onClick={() => onSelect(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
