'use client';

import { useState, useEffect } from 'react';
import styles from './ContactButtons.module.css';

export default function ContactButtons() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <a 
        href="https://wa.me/77015550000" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.whatsapp}
        aria-label="Contact on WhatsApp"
      >
        <span className={styles.icon}>💬</span>
        <span className={styles.text}>Связаться</span>
      </a>
    </div>
  );
}
