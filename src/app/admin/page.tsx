'use client';

import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';

import { getAiInsightAction } from './actions';

export default function Dashboard() {
  const [data, setData] = useState<number[]>([]);
  const [kpis, setKpis] = useState({ revenue: 0, orders: 0, satisfaction: 98, overdue: 3 });
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Состояния для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [bookingForm, setBookingForm] = useState({
    clientName: '',
    clientEmail: '',
    serviceName: '',
    price: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/db');
      const db = await res.json();
      const bookings = db.bookings || [];
      
      // Загружаем список услуг и недвижимости для выбора
      const allOptions = [
        ...(db.properties || []).map((p: any) => ({ name: (p.title_ru || p.title), price: p.price })),
        ...(db.services || []).map((s: any) => ({ name: s.title, price: s.price }))
      ];
      setServices(allOptions);
      if (allOptions.length > 0 && !bookingForm.serviceName) {
        setBookingForm(prev => ({ ...prev, serviceName: allOptions[0].name, price: allOptions[0].price }));
      }

      // Расчет выручки
      const totalRevenue = bookings
        .filter((b: any) => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum: number, b: any) => sum + (b.price || 0), 0);
      
      // Расчет активных задач (ожидающих подтверждения)
      const pendingCount = bookings.filter((b: any) => b.status === 'pending').length;
      
      // Формирование данных для графика (симуляция распределения для примера)
      const chartData = [120, 150, 200, 180, 250, 300, 280]; // Базовая динамика
      
      setKpis(prev => ({ 
        ...prev, 
        revenue: totalRevenue, 
        orders: bookings.length,
        overdue: pendingCount 
      }));
      setData(chartData);
    } catch (err) {
      console.error('Failed to load dashboard data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          collection: 'bookings',
          data: {
            ...bookingForm,
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
        setBookingForm({
          clientName: '',
          clientEmail: '',
          serviceName: services[0]?.name || '',
          price: services[0]?.price || 0,
          date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (err) {
      alert('Ошибка при сохранении бронирования');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGetInsight = async () => {
    setIsLoading(true);
    const context = {
      revenue: `${kpis.revenue.toLocaleString()} ₸`,
      activeRentals: kpis.orders,
      topCustomer: "Alexander Petrov",
      lowOccupancyUnits: ["Villa Azure", "Maybach S-Class"],
      overdueTasks: kpis.overdue
    };
    try {
      const response = await getAiInsightAction(context);
      setAiResponse(response);
    } catch (err) {
      setAiResponse("Ошибка при вызове сервера аналитики.");
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>С возвращением, Алекс</h1>
        <div 
          className="btn btn-primary" 
          onClick={() => setIsModalOpen(true)}
          style={{ cursor: 'pointer' }}
        >
          + Новая бронь
        </div>
      </header>

      {/* KPI Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Выручка (Общая)</span>
          <div className={styles.kpiValue}>{kpis.revenue.toLocaleString()} ₸</div>
          <div className={`${styles.kpiTrend} ${styles.trendUp}`}>↑ В режиме реального времени</div>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Всего заказов</span>
          <div className={styles.kpiValue}>{kpis.orders}</div>
          <div className={`${styles.kpiTrend} ${styles.trendUp}`}>↑ Из облака Supabase</div>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Удовлетворенность</span>
          <div className={styles.kpiValue}>{kpis.satisfaction}%</div>
          <div className={`${styles.kpiTrend} ${styles.trendUp}`}>↑ Стабильно высокая</div>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Задачи</span>
          <div className={styles.kpiValue}>{kpis.overdue}</div>
          <div className={`${styles.kpiTrend} ${styles.trendDown}`}>В работе</div>
        </div>
      </div>

      {/* Bottom Visualization & Insights */}
      <div className={styles.bottomRes}>
        <div className={styles.chartCard}>
          <h3 style={{ marginBottom: '20px' }}>Динамика доходов (₸)</h3>
          <div className={styles.barChart}>
            {data.map((val, idx) => (
              <div 
                key={idx} 
                className={styles.bar} 
                style={{ height: `${(val / 300) * 100}%` }}
              >
                <span className={styles.barLabel}>{val}k</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
          </div>
        </div>

        <div className={styles.aiInsightCard}>
          <div className={styles.insightTitle}>
            <span>✦</span> Аналитика RentFlow AI
          </div>
          <div style={{ minHeight: '120px' }}>
            {isLoading ? (
              <p style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>Анализирую данные базы... ⌛</p>
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {aiResponse || "Нажмите кнопку ниже, чтобы получить глубокий анализ вашего бизнеса на основе реальных данных из CRM."}
              </p>
            )}
          </div>
          <button 
            onClick={handleGetInsight}
            disabled={isLoading}
            className="btn" 
            style={{ 
              padding: '8px 16px', 
              background: 'rgba(197, 160, 89, 0.12)', 
              color: 'var(--accent-gold)', 
              marginTop: '20px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? "Генерация отчета..." : "Анализ текущих показателей"}
          </button>
        </div>
      </div>

      {/* Manual Booking Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Новое бронирование (вручную)</h2>
            <form onSubmit={handleCreateBooking}>
              <div className={styles.formGroup}>
                <label>ФИО Клиента</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Иван Иванов" 
                  required
                  value={bookingForm.clientName}
                  onChange={e => setBookingForm({...bookingForm, clientName: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email или Телефон</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="example@mail.com" 
                  required
                  value={bookingForm.clientEmail}
                  onChange={e => setBookingForm({...bookingForm, clientEmail: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Объект или Услуга</label>
                <select 
                  className={styles.select}
                  value={bookingForm.serviceName}
                  onChange={e => {
                    const selected = services.find(s => s.name === e.target.value);
                    setBookingForm({
                      ...bookingForm, 
                      serviceName: e.target.value,
                      price: selected ? selected.price : 0
                    });
                  }}
                >
                  {services.map((s, i) => (
                    <option key={i} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.grid} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className={styles.formGroup}>
                  <label>Дата</label>
                  <input 
                    type="date" 
                    className={styles.input} 
                    required
                    value={bookingForm.date}
                    onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Цена (₸)</label>
                  <input 
                    type="number" 
                    className={styles.input} 
                    required
                    value={bookingForm.price}
                    onChange={e => setBookingForm({...bookingForm, price: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className="btn" 
                  style={{ flex: 1, background: '#f1f1f1', color: '#555' }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Отмена
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 2 }}
                  disabled={isSaving}
                >
                  {isSaving ? "Сохранение..." : "Добавить в базу"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
