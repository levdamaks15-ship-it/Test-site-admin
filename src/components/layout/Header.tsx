'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import styles from './Header.module.css';

export default function Header() {
  const { t, language, setLanguage } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contacts'), href: '/contact' },
    { name: 'Админ-панель', href: '/admin/login' },
  ];

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
            {menuItems.slice(0, 4).map(item => (
              <Link key={item.name} href={item.href}>{item.name}</Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <div className={`${styles.langSwitcher} desktop-only`}>
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
            <Link href="/contact" className="btn-primary desktop-only" style={{ padding: '8px 16px', fontSize: '14px', textDecoration: 'none' }}>
              {t('nav.contacts')}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className={styles.mobileToggle}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className={`${styles.burger} ${isMenuOpen ? styles.burgerOpen : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''} glass`}>
        <nav className={styles.mobileNavLinks}>
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className={styles.mobileActions}>
            <div className={styles.langSwitcherMobile}>
              <button onClick={() => { setLanguage('ru'); setIsMenuOpen(false); }} className={language === 'ru' ? styles.active : ''}>RU</button>
              <span>|</span>
              <button onClick={() => { setLanguage('kz'); setIsMenuOpen(false); }} className={language === 'kz' ? styles.active : ''}>KZ</button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
