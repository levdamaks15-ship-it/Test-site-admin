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
        
        // Ensure images are always an array
        const parsedProperties = (db.properties || []).map((p: any) => {
          let images = p.images;
          if (typeof images === 'string') {
            try {
              images = JSON.parse(images);
            } catch (e) {
              images = [];
            }
          }
          return { ...p, images: Array.isArray(images) ? images : [] };
        });
        
        setProperties(parsedProperties);
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

    // Apply Catalog level filter (tabs for Categories)
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
      if (searchCriteria.category && searchCriteria.category !== 'all') {
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
          
          <div className={styles.filtersContainer}>
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
        </div>

        <div className={styles.grid}>
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div style={{ padding: '80px 40px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
              {properties.length === 0 ? (
                <div className={styles.loadingPulse}>Синхронизация с базой данных...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '48px' }}>🔍</span>
                  <div>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Объектов не найдено</h3>
                    <p>По вашему запросу в категории {searchCriteria?.type === 'buy' ? 'Продажа' : 'Аренда'} пока нет доступных вариантов.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
