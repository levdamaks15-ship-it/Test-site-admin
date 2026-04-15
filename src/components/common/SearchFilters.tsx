'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import styles from './SearchFilters.module.css';

interface SearchFiltersProps {
  onSearch?: (filters: any) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState('rent');
  const [selectedCategory, setSelectedCategory] = useState('apartments');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categories = ['Квартиры', 'Дома и виллы', 'Офисы'];

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

  return (
    <div className={`${styles.searchBlock} glass`}>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeType === 'rent' ? styles.active : ''}`}
          onClick={() => setActiveType('rent')}
        >
          {t('common.rent')}
        </button>
        <button 
          className={`${styles.tab} ${activeType === 'buy' ? styles.active : ''}`}
          onClick={() => setActiveType('buy')}
        >
          {t('common.buy')}
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
              {t(`common.${selectedCategory.toLowerCase()}`)}
              <span className={styles.arrow}>▼</span>
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdownList}>
                {['apartments', 'villas', 'offices'].map(cat => (
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
