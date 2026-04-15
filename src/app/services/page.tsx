'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import styles from './services.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function ServicesPage() {
  const { t } = useTranslation();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/db');
        const db = await res.json();
        setServices(db.services || []);
      } catch (err) {
        console.error('Failed to load services');
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <>
      <Header />
      <main className={styles.servicesPage}>
        <div className="container">
          <header className={styles.header}>
            <h1 className={styles.title}>{t('services.title')}</h1>
            <p className={styles.subtitle}>{t('services.subtitle')}</p>
          </header>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>Загрузка услуг...</div>
          ) : (
            <div className={styles.grid}>
              {services.map((service) => (
                <div key={service.id} className={`${styles.serviceCard} glass`}>
                  <div className={styles.imageWrapper}>
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.content}>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <p className={styles.description}>{t(`services.${service.id.replace('-', '_')}.description`)}</p>
                    <div className={styles.price}>{service.price?.toLocaleString()} ₸</div>
                    <Link href={`/booking/${service.id}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      {t('services.book_btn')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
