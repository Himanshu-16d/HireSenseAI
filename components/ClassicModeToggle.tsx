'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import styles from './ClassicModeToggle.module.css';

export default function ClassicModeToggle() {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(theme === 'dark');
  }, [theme]);

  const handleChange = () => {
    setTheme(checked ? 'light' : 'dark');
    setChecked(!checked);
  };

  return (
    <div className={styles.centerer}>
      <input
        type="checkbox"
        id="dark-mode"
        checked={checked}
        onChange={handleChange}
        className={styles.input}
      />
      <label htmlFor="dark-mode" className={styles.label}>
        <span className={styles.sun}></span>
        <span className={styles.clouds}></span>
        <span className={styles.moon}></span>
        <span className={styles.stars}>
          <span className={styles.star1}></span>
          <span className={styles.star2}></span>
          <span className={styles.star3}></span>
        </span>
      </label>
    </div>
  );
} 