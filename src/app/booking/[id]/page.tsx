'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import { addBooking } from '@/lib/bookingStore';
import styles from '../booking.module.css';

export default function BookingPage() {
  const { id } = useParams() as { id: string };
  const { t } = useTranslation();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    notes: '',
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/db');
        const db = await res.json();
        const found = db.services?.find((s: any) => s.id === id);
        setService(found);
      } catch (err) {
        console.error('Failed to load service data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.bookingPage}>
        <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
          <h2>Загрузка...</h2>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className={styles.bookingPage}>
        <div className="container">
          <h1>Услуга не найдена</h1>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await addBooking({
      serviceId: id,
      serviceName: service.title,
      clientName: formData.name,
      clientEmail: formData.email,
      date: formData.date,
      price: service.price,
    });

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <>
        <Header />
        <main className={styles.bookingPage}>
          <div className={styles.container}>
            <div className={`${styles.card} ${styles.successCard} glass`}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.title}>Бронирование подтверждено!</h2>
              <p className={styles.subtitle}>
                Ваш запрос принят. Наш менеджер свяжется с вами в ближайшее время для уточнения деталей.
              </p>
              <button 
                onClick={() => router.push('/services')} 
                className="btn-primary"
              >
                Вернуться к услугам
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.bookingPage}>
        <div className={styles.container}>
          <div className={`${styles.card} glass`}>
            <h1 className={styles.title}>{service.title}</h1>
            <p className={styles.subtitle}>Пожалуйста, заполните форму для бронирования услуги.</p>
            
            {service.image && (
              <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
                <img 
                  src={service.image} 
                  alt={service.title} 
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ваше имя</label>
                <input 
                  type="text" 
                  required 
                  className={styles.input}
                  placeholder="Введите полное имя"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email для связи</label>
                <input 
                  type="email" 
                  required 
                  className={styles.input}
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Желаемая дата</label>
                  <input 
                    type="date" 
                    required 
                    className={styles.input}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Стоимость</label>
                  <div className={styles.price} style={{ marginTop: '14px' }}>
                    {service.price.toLocaleString()} ₸
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Дополнительные пожелания</label>
                <textarea 
                  rows={4} 
                  className={styles.textarea}
                  placeholder="Опишите ваши требования..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>
                Подтвердить бронирование
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
