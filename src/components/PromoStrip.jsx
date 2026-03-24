import React from 'react';
import styles from './PromoStrip.module.css';

export default function PromoStrip({ cards }) {
  if (!cards.length) return null;
  return (
    <div className={styles.grid}>
      {cards.map(p => (
        <div key={p.id} className={styles.card} style={{ background: p.gradient }}>
          <h3 className={styles.title}>{p.title}</h3>
          <span className={styles.emoji}>{p.emoji}</span>
        </div>
      ))}
    </div>
  );
}
