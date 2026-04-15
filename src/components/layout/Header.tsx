'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import styles from './Header.module.css';

export default function Header() {
  const { t, language, setLanguage } = useTranslation();

  return (
    <header className={`${styles.header} glass`}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.logoContainer}>
            <Link href="/" className={styles.logo}>
              ARENDA<span>LUX</span>
            </Link>
          </div>

          <nav className={styles.nav}>
            <Link href="/">{t('nav.home')}</Link>
            <Link href="/services">{t('nav.services')}</Link>
            <Link href="/about">{t('nav.about')}</Link>
            <Link href="/contact">{t('nav.contacts')}</Link>
            <Link href="/admin/login" style={{ opacity: 0.7, fontSize: '0.9em' }}>{t('nav.crm')}</Link>
          </nav>

          <div className={styles.actions}>
            <div className={styles.langSwitcher}>
              <button 
                onClick={() => setLanguage('ru')} 
                className={language === 'ru' ? styles.active : ''}
              >
                RU
              </button>
              <span>|</span>
              <button 
                onClick={() => setLanguage('kz')} 
                className={language === 'kz' ? styles.active : ''}
              >
                KZ
              </button>
            </div>
            <Link href="/contact" className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px', textDecoration: 'none' }}>
              {t('nav.contacts')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
