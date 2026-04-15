'use client';

import { useState, useEffect } from 'react';
import styles from './crm.module.css';

export default function CRM() {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/db');
      const db = await res.json();
      setBookings(db.bookings || []);
    } catch (err) {
      console.error('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          collection: 'bookings',
          id,
          data: { status: newStatus }
        })
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      alert('Ошибка при обновлении статуса');
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;
    
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          collection: 'bookings',
          id
        })
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.crm}>
      <header className={styles.header}>
        <h1 className={styles.title}>Центр управления заказами (CRM)</h1>
      </header>

      <div className={styles.filters}>
        <input 
          type="text" 
          placeholder="Поиск по имени, email или услуге..." 
          className={styles.filterInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.tableCard}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка данных...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Клиент</th>
                <th>Услуга</th>
                <th>Стоимость</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{booking.id}</td>
                  <td>
                    <div className={styles.clientName}>{booking.clientName}</div>
                    <div className={styles.clientEmail}>{booking.clientEmail}</div>
                  </td>
                  <td style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                    {booking.serviceName}
                  </td>
                  <td style={{ fontStyle: 'italic', fontWeight: '600', color: 'var(--accent-secondary)' }}>
                    {booking.price?.toLocaleString()} ₸
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[booking.status]}`}>
                      {booking.status === 'pending' ? 'В ОЖИДАНИИ' : 
                       booking.status === 'confirmed' ? 'ПОДТВЕРЖДЕНО' : 
                       booking.status === 'completed' ? 'ЗАВЕРШЕН' : 'ОТМЕНЕН'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {booking.status === 'pending' ? (
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                          style={{ padding: '4px 12px', fontSize: '11px' }}
                        >
                          Подтвердить
                        </button>
                      ) : (
                        <button 
                          className="btn" 
                          onClick={() => handleUpdateStatus(booking.id, 'pending')}
                          style={{ padding: '4px 12px', fontSize: '11px', background: 'transparent', border: '1px solid var(--border-color)' }}
                        >
                          В ожидание
                        </button>
                      )}
                      
                      <button 
                        className="btn" 
                        onClick={() => handleRemove(booking.id)}
                        style={{ padding: '4px 12px', fontSize: '11px', background: 'rgba(217, 83, 79, 0.1)', color: '#d9534f', border: '1px solid #d9534f' }}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Записей не найдено</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
