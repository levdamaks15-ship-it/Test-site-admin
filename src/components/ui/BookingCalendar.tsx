'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import styles from './BookingCalendar.module.css';
import PaymentModal from './PaymentModal';
import CustomCalendar from './CustomCalendar';
import { addBooking } from '@/lib/bookingStore';

export default function BookingCalendar({ propertyId, propertyName, price, currency }: { propertyId: string; propertyName: string; price: number; currency: string }) {
  const { language, t } = useTranslation();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * price;
  };

  const total = calculateTotal();

  const handleBooking = async () => {
    if (total <= 0) {
      alert(language === 'ru' ? 'Выберите даты заезда и выезда' : 'Келу және кету күндерін таңдаңыз');
      return;
    }
    if (!name || !email) {
      alert(language === 'ru' ? 'Пожалуйста, введите ваше имя и email' : 'Атыңыз бен электрондық поштаңызды енгізіңіз');
      return;
    }

    try {
      await addBooking({
        serviceId: propertyId,
        serviceName: propertyName,
        clientName: name,
        clientEmail: email,
        date: `${startDate} - ${endDate}`,
        price: total,
      });
      setIsSuccess(true);
      // Если клиент хочет сразу оплатить, можно оставить PaymentModal или перенаправить на страницу успеха
      // setIsPaymentOpen(true);
    } catch (err) {
      alert('Ошибка при бронировании');
    }
  };

  if (isSuccess) {
    return (
      <div className={`${styles.wrapper} glass`} style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '48px', color: 'var(--accent-success)', marginBottom: '20px' }}>✓</div>
        <h3 className={styles.title}>Бронирование принято!</h3>
        <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>
          Мы свяжемся с вами в течение 10 минут по отправленному Email для подтверждения дат.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.wrapper} glass`}>
        <h3 className={styles.title}>{t('booking.bookNow')}</h3>
        
        <div className={styles.form}>
          <div className={styles.calendarStack}>
            <CustomCalendar 
              label={t('booking.checkIn')}
              selectedDate={startDate}
              onSelect={setStartDate}
            />
            <CustomCalendar 
              label={t('booking.checkOut')}
              selectedDate={endDate}
              onSelect={setEndDate}
            />
          </div>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>Имя и Фамилия</label>
              <input 
                type="text" 
                placeholder="Иван Иванов" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'var(--surface-light)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>Email для связи</label>
              <input 
                type="email" 
                placeholder="example@mail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', background: 'var(--surface-light)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              />
            </div>
          </div>

          {total > 0 && (
            <div className={styles.summary} style={{ marginTop: '20px' }}>
              <div className={styles.totalRow}>
                <span>{language === 'ru' ? 'Итого' : 'Жиыны'}:</span>
                <span className={styles.totalPrice}>
                  {total.toLocaleString('ru-RU')} {currency || '₸'}
                </span>
              </div>
            </div>
          )}

          <button 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '20px' }}
            onClick={handleBooking}
          >
            Отправить запрос на бронь
          </button>
          <p className={styles.disclaimer}>
            {language === 'ru' 
              ? 'Вы сможете подтвердить бронирование после проверки доступности менеджером.'
              : 'Менеджер қолжетімділікті тексергеннен кейін брондауды растай аласыз.'}
          </p>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={() => setIsPaymentOpen(false)}
        amount={total}
        currency={currency || '₸'}
      />
    </>
  );
}

