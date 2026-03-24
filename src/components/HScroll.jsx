import React, { useRef } from 'react';
import styles from './HScroll.module.css';

export default function HScroll({ children }) {
  const ref = useRef();
  const go  = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });

  return (
    <div className={styles.wrap}>
      <button className={`${styles.btn} ${styles.left}`}  onClick={() => go(-1)}>‹</button>
      <div ref={ref} className={`${styles.outer} hs`}>
        <div className={styles.inner}>{children}</div>
      </div>
      <button className={`${styles.btn} ${styles.right}`} onClick={() => go(1)}>›</button>
    </div>
  );
}
