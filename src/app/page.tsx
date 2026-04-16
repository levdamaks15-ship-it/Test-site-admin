'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import styles from './page.module.css';
import Catalog from '@/components/common/Catalog';
import SearchFilters from '@/components/common/SearchFilters';
import properties from '@/data/properties.json';

export default function Home() {
  const { t } = useTranslation();
  const [searchCriteria, setSearchCriteria] = useState<any>(null);

  const handleSearch = (filters: any) => {
    setSearchCriteria(filters);
    // Smooth scroll to catalog after search
    const catalog = document.getElementById('catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.overlay}></div>
          </div>
          
          <div className="container">
            <div className={styles.heroContent}>
              <h1 className={styles.title}>{t('hero.title')}</h1>
              <p className={styles.subtitle}>{t('hero.subtitle')}</p>
              
              <SearchFilters onSearch={handleSearch} />
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <Catalog searchCriteria={searchCriteria} />
      </main>

      <Footer />
    </>
  );
}
