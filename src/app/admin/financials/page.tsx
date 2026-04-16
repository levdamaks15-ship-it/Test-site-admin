'use client';

import { useState, useEffect } from 'react';
import styles from './financials.module.css';

export default function Financials() {
  const [data, setData] = useState<any>({ bookings: [], expenses: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/db?t=' + Date.now());
      const db = await res.json();
      
      // Simulate expenses since table doesn't exist yet
      const mockExpenses = [
        { id: 1, title: 'Аренда офиса', amount: 150000, date: '2026-04-10', category: 'Офис' },
        { id: 2, title: 'Маркетинг (Instagram)', amount: 85000, date: '2026-04-12', category: 'Реклама' },
        { id: 3, title: 'Зарплата персонала', amount: 450000, date: '2026-04-15', category: 'Персонал' },
      ];

      setData({
        bookings: db.bookings || [],
        expenses: mockExpenses // Fallback to mock
      });
    } catch (err) {
      console.error('Failed to load financial data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Metrics calculation
  const confirmedBookings = data.bookings.filter((b: any) => b.status === 'confirmed' || b.status === 'completed');
  const pendingBookings = data.bookings.filter((b: any) => b.status === 'pending');
  
  const totalRevenue = confirmedBookings.reduce((sum: number, b: any) => sum + (b.price || 0), 0);
  const totalExpenses = data.expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const projectedIncome = pendingBookings.reduce((sum: number, b: any) => sum + (b.price || 0), 0);
  const avgBill = confirmedBookings.length > 0 ? Math.round(totalRevenue / confirmedBookings.length) : 0;

  // Simple chart simulation (7 bars)
  const chartBars = [0.4, 0.6, 0.8, 0.5, 0.9, 0.7, 1.0];

  return (
    <div className={styles.financials}>
      <header className={styles.header}>
        <h1 className={styles.title}>Финансовая аналитика</h1>
      </header>

      {/* KPI Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Выручка</span>
          <div className={styles.kpiValue}>{totalRevenue.toLocaleString()} ₸</div>
          <div className={styles.kpiTrend}>↑ 12% к прошлому мес.</div>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Расходы</span>
          <div className={styles.kpiValue} style={{ color: '#dc2626' }}>{totalExpenses.toLocaleString()} ₸</div>
          <div className={styles.kpiTrend} style={{ color: 'var(--text-muted)' }}>Стабильно</div>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Чистая прибыль</span>
          <div className={styles.kpiValue} style={{ color: 'var(--accent-gold)' }}>{netProfit.toLocaleString()} ₸</div>
          <div className={styles.kpiTrend}>↑ 8% маржинальность</div>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Средний чек</span>
          <div className={styles.kpiValue}>{avgBill.toLocaleString()} ₸</div>
          <div className={styles.kpiTrend}>Стабильно</div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Performance Chart */}
        <div className={styles.chartCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ margin: 0 }}>Динамика доходов</h3>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Последние 7 дней</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '15px', paddingBottom: '20px' }}>
            {chartBars.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '100%', 
                  height: `${h * 100}%`, 
                  background: 'linear-gradient(to top, var(--accent-gold), rgba(197, 160, 89, 0.3))',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 1s ease-out'
                }} />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>День {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projected Card */}
        <div className={styles.kpiCard} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <span className={styles.kpiLabel}>Прогноз (Pending)</span>
          <div className={styles.kpiValue} style={{ fontSize: '36px', marginBottom: '10px' }}>{projectedIncome.toLocaleString()} ₸</div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Ожидаемые поступления от {pendingBookings.length} новых броней</p>
        </div>
      </div>

      {/* Transactions & Expenses Table */}
      <div className={styles.tableCard}>
        <div style={{ padding: '24px 32px', display: 'flex', gap: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <div 
            onClick={() => setActiveTab('income')}
            style={{ 
              fontWeight: 800, 
              fontSize: '14px', 
              cursor: 'pointer',
              color: activeTab === 'income' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'income' ? '2px solid var(--accent-gold)' : 'none',
              paddingBottom: '8px'
            }}
          >
            ДОХОДЫ
          </div>
          <div 
            onClick={() => setActiveTab('expenses')}
            style={{ 
              fontWeight: 800, 
              fontSize: '14px', 
              cursor: 'pointer',
              color: activeTab === 'expenses' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'expenses' ? '2px solid var(--accent-gold)' : 'none',
              paddingBottom: '8px'
            }}
          >
            РАСХОДЫ
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>{activeTab === 'income' ? 'Клиент / Услуга' : 'Описание'}</th>
              <th>Дата</th>
              <th>Категория</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {activeTab === 'income' ? (
              confirmedBookings.slice(0, 5).map((b: any) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.clientName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.serviceName}</div>
                  </td>
                  <td>{b.booking_date || b.date}</td>
                  <td>Бронирование</td>
                  <td className={styles.amount}>+ {b.price?.toLocaleString()} ₸</td>
                  <td><span className={`${styles.status} ${styles.confirmed}`}>ОПЛАЧЕНО</span></td>
                </tr>
              ))
            ) : (
              data.expenses.map((e: any) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600 }}>{e.title}</td>
                  <td>{e.date}</td>
                  <td>{e.category}</td>
                  <td className={styles.amount} style={{ color: '#dc2626' }}>- {e.amount.toLocaleString()} ₸</td>
                  <td><span className={`${styles.status} ${styles.confirmed}`} style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>СПИСАНО</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
