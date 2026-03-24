import React from 'react';
import styles from './TrustBar.module.css';

const ITEMS = [
  { icon: '⚡', title: '10–15 Min',    desc: 'Express delivery',    bg: '#fef9e0' },
  { icon: '🌿', title: '100% Fresh',   desc: 'Farm to doorstep',    bg: '#e8f8ef' },
  { icon: '💰', title: 'Best Prices',  desc: 'Daily deals & offers', bg: '#fff0f5' },
  { icon: '🔄', title: 'Easy Returns', desc: 'No questions asked',   bg: '#eef4ff' },
];

export default function TrustBar() {
  return (
    <div className={styles.bar}>
      {ITEMS.map((item, i) => (
        <div key={i} className={styles.item} style={{ borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
          <div className={styles.icon} style={{ background: item.bg }}>{item.icon}</div>
          <div>
            <div className={styles.title}>{item.title}</div>
            <div className={styles.desc}>{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
