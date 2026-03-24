import React from 'react';
import styles from './SubcatCard.module.css';

export default function SubcatCard({ sub, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.em}>{sub.emoji}</div>
      <div className={styles.label}>{sub.name}</div>
    </div>
  );
}
