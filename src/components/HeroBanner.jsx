import React, { useState, useEffect } from 'react';
import styles from './HeroBanner.module.css';

export default function HeroBanner({ banners }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!banners.length) return;
    const t = setInterval(() => setIdx(i => (i + 1) % banners.length), 3800);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length) return <div className={`skel ${styles.skeleton}`} />;

  const b = banners[idx];
  return (
    <>
      <div className={styles.banner} style={{ background: b.gradient }}>
        <div className={styles.pattern} />
        <div className={styles.content}>
          <h1>
            {b.title}{' '}
            <span className={styles.sub}>{b.subtitle}</span>
          </h1>
          <button className={styles.cta}>{b.cta} →</button>
        </div>
        <div className={styles.emoji}>{b.emoji}</div>
      </div>

      <div className={styles.dots}>
        {banners.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </>
  );
}
