'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import styles from './Contact.module.css';

export default function ContactPage() {
  const { language, t } = useTranslation();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>{t('contacts.title')}</h1>
            <p className={styles.subtitle}>{t('contacts.subtitle')}</p>
          </div>

          <div className={styles.grid}>
            <div className={styles.infoCards}>
              <div className={styles.card}>
                <div className={styles.icon}>📞</div>
                <div>
                  <label>{language === 'ru' ? 'Телефон' : 'Телефон'}</label>
                  <a href={`tel:${t('contacts.phone')}`}>{t('contacts.phone')}</a>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.icon}>💬</div>
                <div>
                  <label>WhatsApp</label>
                  <a href={`https://wa.me/${t('contacts.whatsapp').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">
                    {t('contacts.whatsapp')}
                  </a>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.icon}>📍</div>
                <div>
                  <label>{t('contacts.addressTitle')}</label>
                  <p>{t('contacts.address')}</p>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.icon}>📸</div>
                <div>
                  <label>Instagram</label>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    {t('contacts.instagram')}
                  </a>
                </div>
              </div>
            </div>

            <div className={`${styles.formBox} glass`}>
              <h3>{t('contacts.form.title')}</h3>
              <form className={styles.form}>
                <input type="text" placeholder={t('contacts.form.name')} />
                <input type="email" placeholder={t('contacts.form.email')} />
                <textarea placeholder={t('contacts.form.message')} rows={5}></textarea>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>{t('contacts.form.send')}</button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
