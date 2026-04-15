'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import styles from './CustomCalendar.module.css';

interface CustomCalendarProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  label: string;
}

export default function CustomCalendar({ selectedDate, onSelect, label }: CustomCalendarProps) {
  const { language, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate ? new Date(selectedDate) : new Date());

  const daysLocale = {
    ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    kz: ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сн', 'Жк']
  };

  const monthsLocale = {
    ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    kz: ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан']
  };

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // First day of target month
    const firstDay = new Date(year, month, 1);
    // Last day of target month
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Fill leading empty days (Monday as 1)
    let startDayOffset = firstDay.getDay() - 1;
    if (startDayOffset === -1) startDayOffset = 6; // Sunday fix
    
    for (let i = 0; i < startDayOffset; i++) {
      days.push(null);
    }
    
    // Fill actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [viewDate]);

  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
  };

  const handleDayClick = (date: Date) => {
    const iso = date.toISOString().split('T')[0];
    onSelect(iso);
    setIsOpen(false);
  };

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  return (
    <div className={styles.container} data-open={isOpen}>
      <label className={styles.label}>{label}</label>
      <div 
        className={styles.header} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.selectedVal}>
          {selectedDate ? formatDate(new Date(selectedDate)) : (language === 'ru' ? 'Выберите дату' : 'Күнді таңдаңыз')}
        </div>
        <span className={styles.icon}>📅</span>
      </div>

      {isOpen && (
        <div className={`${styles.dropdown} glass`}>
          <div className={styles.nav}>
            <button onClick={() => changeMonth(-1)}>←</button>
            <div className={styles.monthTitle}>
              {monthsLocale[language as 'ru' | 'kz'][viewDate.getMonth()]} {viewDate.getFullYear()}
            </div>
            <button onClick={() => changeMonth(1)}>→</button>
          </div>

          <div className={styles.weekDays}>
            {daysLocale[language as 'ru' | 'kz'].map(d => <span key={d}>{d}</span>)}
          </div>

          <div className={styles.daysGrid}>
            {calendarDays.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} className={styles.empty}></div>;
              
              const isSelected = selectedDate === date.toISOString().split('T')[0];
              const isToday = new Date().toISOString().split('T')[0] === date.toISOString().split('T')[0];

              return (
                <div 
                  key={i} 
                  className={`${styles.day} ${isSelected ? styles.active : ''} ${isToday ? styles.today : ''}`}
                  onClick={() => handleDayClick(date)}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
