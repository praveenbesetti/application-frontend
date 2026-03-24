import React from 'react';
import styles from './ParentCatGrid.module.css';

export default function ParentCatGrid({ cats, onCategoryClick }) {
  if (!cats.length) {
    return (
      <div className={styles.grid}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`skel ${styles.skeletonCard}`} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {cats.map(cat => (
        <div
          key={cat.slug || cat.id}
          className={styles.card}
          onClick={() => onCategoryClick && onCategoryClick(cat.slug || cat.id)}
          title={`Browse ${cat.name}`}
        >
          {/* Image fills full card */}
          <div className={styles.imgWrap}>
            {cat.imageUrl
              ? <img src={cat.imageUrl} alt={cat.name} />
              : <span className={styles.emoji}>{cat.emoji}</span>
            }
            {/* Gradient overlay + text at bottom */}
            <div className={styles.overlay}>
              <span className={styles.name}>{cat.name}</span>
              <span className={styles.sub}>{cat.sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
