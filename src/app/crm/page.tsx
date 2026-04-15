'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { getBookings, updateBookingStatus, Booking } from '@/lib/bookingStore';
import styles from './crm.module.css';

export default function CRMPage() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setBookings(getBookings());
    setIsLoaded(true);
  }, []);

  const handleStatusChange = (id: string, status: Booking['status']) => {
    const updated = updateBookingStatus(id, status);
    setBookings(updated);
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;

  if (!isLoaded) return null;

  return (
    <>
      <Header />
      <main className={styles.crmPage}>
        <div className="container">
          <header className={styles.header}>
            <h1 className={styles.title}>{t('crm.title')}</h1>
            <div className="btn-secondary">Экспорт отчета</div>
          </header>

          {/* Stats Section */}
          <div className={styles.statsGrid}>
            <div className={`${styles.statCard} glass`}>
              <span className={styles.statLabel}>{t('crm.stats.total')}</span>
              <span className={styles.statValue}>{bookings.length}</span>
              <span className={styles.statGrowth}>↑ 12% {t('crm.stats.growth')}</span>
            </div>
            <div className={`${styles.statCard} glass`}>
              <span className={styles.statLabel}>{t('crm.stats.active')}</span>
              <span className={styles.statValue}>{activeBookings}</span>
              <span className={styles.statGrowth}>↑ 5% {t('crm.stats.growth')}</span>
            </div>
            <div className={`${styles.statCard} glass`}>
              <span className={styles.statLabel}>{t('crm.stats.revenue')}</span>
              <span className={styles.statValue}>{totalRevenue.toLocaleString()} ₸</span>
              <span className={styles.statGrowth}>↑ 18% {t('crm.stats.growth')}</span>
            </div>
          </div>

          {/* AI Insights Card */}
          <div className={`${styles.aiInsightCard} glass`}>
            <div className={styles.aiIcon}>✦</div>
            <div className={styles.aiContent}>
              <h4>{t('crm.ai_insight.title')}</h4>
              <p>{t('crm.ai_insight.peak_demand')}</p>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {t('crm.ai_insight.strategy')}
              </p>
            </div>
          </div>

          {/* TABLE */}
          <div className={`${styles.tableCard} glass`}>
            <div className={styles.tableHeader}>
              <h3>Последние бронирования</h3>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t('crm.table.id')}</th>
                    <th>{t('crm.table.service')}</th>
                    <th>{t('crm.table.client')}</th>
                    <th>{t('crm.table.date')}</th>
                    <th>{t('crm.table.status')}</th>
                    <th>{t('crm.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td style={{ fontWeight: 600 }}>{booking.id}</td>
                      <td>{booking.serviceName}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{booking.clientName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{booking.clientEmail}</div>
                      </td>
                      <td>{booking.date}</td>
                      <td>
                        <span className={`${styles.status} ${styles['status_' + booking.status]}`}>
                          {t(`crm.status.${booking.status}`)}
                        </span>
                      </td>
                      <td>
                        <select 
                          className={styles.statusSelect}
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value as any)}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '12px' }}
                        >
                          <option value="pending">{t('crm.status.pending')}</option>
                          <option value="confirmed">{t('crm.status.confirmed')}</option>
                          <option value="completed">{t('crm.status.completed')}</option>
                          <option value="cancelled">{t('crm.status.cancelled')}</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
