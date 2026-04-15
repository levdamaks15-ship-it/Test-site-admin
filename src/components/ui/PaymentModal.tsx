'use client';

import { useState, useEffect } from 'react';
import styles from './PaymentModal.module.css';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  currency: string;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, amount, currency }: PaymentModalProps) {
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');

  if (!isOpen) return null;

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2500);
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} glass`}>
        {step === 'method' && (
          <>
            <div className={styles.header}>
              <h3>Оплата бронирования</h3>
              <button onClick={onClose} className={styles.close}>×</button>
            </div>
            
            <div className={styles.amountWrap}>
              <span>К оплате:</span>
              <span className={styles.amount}>{amount.toLocaleString('ru-RU')} {currency}</span>
            </div>

            <div className={styles.methods}>
              <div className={styles.methodItem} onClick={handlePay}>
                <div className={styles.methodIcon}>🪙</div>
                <div className={styles.methodInfo}>
                  <strong>Kaspi Gold</strong>
                  <p>Оплата через приложение</p>
                </div>
              </div>
              
              <div className={styles.methodItem} onClick={handlePay}>
                <div className={styles.methodIcon}>🛡️</div>
                <div className={styles.methodInfo}>
                  <strong>Freedom Pay</strong>
                  <p>Банковская карта</p>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className={styles.status}>
            <div className={styles.loader}></div>
            <p>Обработка платежа...</p>
            <span>Пожалуйста, не закрывайте страницу</span>
          </div>
        )}

        {step === 'success' && (
          <div className={styles.status}>
            <div className={styles.successIcon}>✓</div>
            <h3>Оплата прошла успешно!</h3>
            <p>Ваше бронирование подтверждено.</p>
            <span className={styles.orderId}>Номер заказа: #AL-2026-{Math.floor(Math.random() * 9000) + 1000}</span>
          </div>
        )}
      </div>
    </div>
  );
}
