'use client';

import { useTranslation } from '@/lib/i18n';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              Arenda<span>LUX</span>
            </div>
            <p className={styles.tagline}>{t('hero.subtitle')}</p>
          </div>

          <div className={styles.contact}>
            <p>{t('footer.address')}</p>
            <p>{t('footer.phone')}</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            {t('footer.rights')} 
            <a 
              href="http://localhost:3001/login" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ opacity: 0.3, cursor: 'pointer', textDecoration: 'none', marginLeft: '10px', color: 'inherit' }}
            >
              •
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
