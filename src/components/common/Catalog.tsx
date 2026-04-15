'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import PropertyCard from '@/components/ui/PropertyCard';
import styles from './Catalog.module.css';

export default function Catalog({ searchCriteria }: { searchCriteria?: any }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/db');
        const db = await res.json();
        setProperties(db.properties || []);
      } catch (err) {
        console.error('Failed to sync with RentFlow OS DB');
      }
    };
    fetchProperties();
  }, []);

  const categories = [
    { id: 'all', label: t('common.all') },
    { id: 'villa', label: t('common.villas') },
    { id: 'apartment', label: t('common.apartments') },
    { id: 'office', label: t('common.offices') }
  ];

  const filteredProperties = useMemo(() => {
    let result = properties;

    // Apply Catalog level filter (tabs)
    if (filter !== 'all') {
      result = result.filter(p => p.type === filter);
    }

    // Apply Search block criteria if present
    if (searchCriteria) {
      if (searchCriteria.rooms && searchCriteria.rooms.length > 0) {
        result = result.filter(p => {
          return searchCriteria.rooms.some((r: string) => {
            if (r === '4+') return p.rooms >= 4;
            return p.rooms === parseInt(r);
          });
        });
      }

      if (searchCriteria.priceRange.min) {
        result = result.filter(p => p.price >= parseInt(searchCriteria.priceRange.min));
      }
      if (searchCriteria.priceRange.max) {
        result = result.filter(p => p.price <= parseInt(searchCriteria.priceRange.max));
      }
      
      // Secondary category filter from search block
      if (searchCriteria.category) {
        const typeMap: any = {
          'apartments': 'apartment',
          'villas': 'villa',
          'offices': 'office'
        };
        const searchType = typeMap[searchCriteria.category];
        if (searchType) {
          result = result.filter(p => p.type === searchType);
        }
      }
    }

    return result;
  }, [filter, searchCriteria, properties]);

  return (
    <section className="section-padding" id="catalog">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{t('common.catalogTitle')}</h2>
          
          <div className={styles.filters}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`${styles.filterBtn} ${filter === cat.id ? styles.active : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {filteredProperties.length > 0 ? filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          )) : (
            <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
              Загрузка каталога из RentFlow OS...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
