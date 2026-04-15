'use client';

import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import styles from './PropertyCard.module.css';

interface Property {
  id: string;
  type: string;
  title: string;
  title_ru: string;
  title_kz: string;
  location: string;
  location_ru: string;
  location_kz: string;
  price: number;
  currency: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  featured: boolean;
}

import Link from 'next/link';

export default function PropertyCard({ property }: { property: any }) {
  const { language, t } = useTranslation();

  const title = (language === 'ru' ? property.title_ru : property.title_kz) || property.title;
  const location = (language === 'ru' ? property.location_ru : property.location_kz) || 'Казахстан';
  const mainImage = (property.images && property.images.length > 0) ? property.images[0] : property.image || '/placeholder.png';

  const formatPrice = (price: number) => {
    return (price || 0).toLocaleString('ru-RU');
  };

  return (
    <Link href={`/property/${property.id}`} className={styles.cardLink}>
      <div className={`${styles.card} glass`}>
        <div className={styles.imageWrapper}>
          <img src={mainImage} alt={title} className={styles.image} />
          <div className={styles.badges}>
            {property.featured && <span className={styles.badge}>Hot</span>}
            {property.verified && <span className={`${styles.badge} ${styles.verified}`}>✓ {t('common.verified')}</span>}
          </div>
          <button className={styles.favoriteBtn} onClick={(e) => { e.preventDefault(); }}>❤</button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.typeRow}>
            <span className={styles.type}>{t(`common.${property.type || 'apartment'}s`).toUpperCase()}</span>
            <span className={styles.owner}>• {property.owner_type === 'agency' ? t('common.agency') : t('common.owner')}</span>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.location}>{location}</p>
          
          <div className={styles.specsGrid}>
            <div className={styles.specItem}>
              <span className={styles.specIcon}>📐</span>
              <span>{property.area || 0} м²</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specIcon}>🛏️</span>
              <span>{property.rooms || 0} {t('common.roomsAbbr')}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specIcon}>👤</span>
              <span>{property.guests || 0} {t('common.guestsAbbr')}</span>
            </div>
          </div>
          
          <div className={styles.footer}>
            <div className={styles.priceWrap}>
              <div className={styles.price}>
                {formatPrice(property.price)} <span>{property.currency || '₸'}</span>
              </div>
              <span className={styles.perMonth}>{t('common.perMonth')}</span>
            </div>
            <button className={styles.detailsBtn}>→</button>
          </div>
        </div>
      </div>
    </Link>
  );
}
