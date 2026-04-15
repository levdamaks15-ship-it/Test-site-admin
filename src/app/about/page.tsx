'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n';
import styles from './About.module.css';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <h1 className={styles.title}>{t('about.title')}</h1>
            <p className={styles.description}>{t('about.description')}</p>
          </div>
        </section>

        <section className={styles.missionSection}>
          <div className="container">
            <div className={styles.grid}>
              <div className={styles.content}>
                <h2>{t('about.missionTitle')}</h2>
                <p>{t('about.mission')}</p>
                
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <h3>{t('about.stats.experience')}</h3>
                  </div>
                  <div className={styles.statItem}>
                    <h3>{t('about.stats.objects')}</h3>
                  </div>
                  <div className={styles.statItem}>
                    <h3>{t('about.stats.clients')}</h3>
                  </div>
                </div>
              </div>
              <div className={styles.imageBox}>
                <img src="/villa_1.png" alt="Office Premium" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
