import React from 'react';
import styles from './SectionHeader.module.css';

export default function SectionHeader({ title, onSeeAll }) {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>{title}</h2>
      <span className={styles.seeAll} onClick={onSeeAll}>
        See All →
      </span>
    </div>
  );
}
