'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import styles from './SearchFilters.module.css';

interface SearchFiltersProps {
  onSearch?: (filters: any) => void;
  activeDealType?: string;
  onTabChange?: (type: string) => void;
}

export default function SearchFilters({ onSearch, activeDealType = 'rent', onTabChange }: SearchFiltersProps) {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState(activeDealType);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setActiveType(activeDealType);
  }, [activeDealType]);

  const toggleRoom = (num: string) => {
    setSelectedRooms(prev => 
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        type: activeType,
        category: selectedCategory,
        rooms: selectedRooms,
        priceRange
      });
    }
  };

  if (!isMounted) return null;

  return (
    <div className={`${styles.searchBlock} glass`}>
      <div className={styles.tabs} style={{ pointerEvents: 'none' }}>
        <button className={`${styles.tab} ${styles.active}`} style={{ width: '100%', border: 'none' }}>
          ПОИСК НЕДВИЖИМОСТИ
        </button>
      </div>

      <div className={styles.filtersInner}>
        <div className={styles.filterGroup}>
          <label>{t('common.type')}</label>
          <div className={styles.customSelect} data-open={isDropdownOpen}>
            <div 
              className={styles.selectHeader} 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedCategory === 'all' ? t('common.all') : t(`common.${selectedCategory.toLowerCase()}`)}
              <span className={styles.arrow}>▼</span>
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdownList}>
                {['all', 'apartments', 'villas', 'offices'].map(cat => (
                  <div 
                    key={cat} 
                    className={`${styles.option} ${selectedCategory === cat ? styles.activeOption : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {t(`common.${cat}`)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label>{t('common.roomsCount')}</label>
          <div className={styles.roomBtns}>
            {['1', '2', '3', '4+'].map(num => (
              <button 
                key={num} 
                className={`${styles.roomBtn} ${selectedRooms.includes(num) ? styles.active : ''}`}
                onClick={() => toggleRoom(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label>{t('common.price')} (KZT)</label>
          <div className={styles.priceInputs}>
            <input 
              type="number" 
              placeholder={t('common.from')}
              className={styles.inputSmall} 
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            />
            <input 
              type="number" 
              placeholder={t('common.to')}
              className={styles.inputSmall} 
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            />
          </div>
        </div>

        <button className={`${styles.searchBtn} btn-primary`} onClick={handleSearch}>
          {t('common.find')}
        </button>
      </div>
    </div>
  );
}
