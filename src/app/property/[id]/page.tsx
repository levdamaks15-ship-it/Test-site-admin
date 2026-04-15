'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookingCalendar from '@/components/ui/BookingCalendar';
import styles from './PropertyPage.module.css';

export default function PropertyPage() {
  const { id } = useParams();
  const { language, t } = useTranslation();
  const router = useRouter();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/db');
        const db = await res.json();
        const found = db.properties?.find((p: any) => p.id === id);
        setProperty(found);
      } catch (err) {
        console.error('Failed to load property data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Загрузка...</h2>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Объект не найден</h2>
        <button onClick={() => router.push('/')} className="btn-primary" style={{ marginTop: '20px' }}>Вернуться на главную</button>
      </div>
    );
  }

  const title = (language === 'ru' ? property.title_ru : property.title_kz) || property.title;
  const location = (language === 'ru' ? property.location_ru : property.location_kz) || 'Казахстан';
  const images = property.images && property.images.length > 0 ? property.images : ['/placeholder.png'];

  return (
    <>
      <Header />
      
      <main className={styles.main}>
        <div className="container">
          <button className={styles.backBtn} onClick={() => router.back()}>
            <span>←</span> {t('common.backBtn')}
          </button>

          <div className={styles.grid}>
            <div className={styles.content}>
              <div className={styles.gallery}>
                <div 
                  className={styles.mainImage} 
                  onClick={() => setIsFullscreen(true)}
                  title={language === 'ru' ? 'Нажмите, чтобы увеличить' : 'Үлкейту үшін басыңыз'}
                >
                  <img src={images[mainImageIndex]} alt={title} />
                  <div className={styles.zoomIcon}>🔍</div>
                </div>
                <div className={styles.sideImages}>
                  {images.map((img: string, index: number) => (
                    <div 
                      key={index} 
                      className={`${styles.sideImage} ${index === mainImageIndex ? styles.active : ''}`}
                      onClick={() => setMainImageIndex(index)}
                    >
                      <img src={img} alt={`${title} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>

              {isFullscreen && (
                <div className={styles.fullscreenOverlay} onClick={() => setIsFullscreen(false)}>
                  <button className={styles.closeBtn}>×</button>
                  <img src={images[mainImageIndex]} alt={title} />
                </div>
              )}

              <div className={styles.info}>
                <div className={styles.header}>
                  <div className={styles.type}>{t(`common.${property.type || 'apartment'}s`).toUpperCase()}</div>
                  <h1 className={styles.title}>{title}</h1>
                  <p className={styles.location}>{location}</p>
                </div>

                <div className={styles.specsGrid}>
                  <div className={styles.specBox}>
                    <span className={styles.specIcon}>📐</span>
                    <div className={styles.specText}>
                      <span className={styles.specVal}>{property.area || 0} м²</span>
                      <span className={styles.specLab}>{t('common.area')}</span>
                    </div>
                  </div>
                  <div className={styles.specBox}>
                    <span className={styles.specIcon}>🛏️</span>
                    <div className={styles.specText}>
                      <span className={styles.specVal}>{property.rooms || 0}</span>
                      <span className={styles.specLab}>{t('common.rooms')}</span>
                    </div>
                  </div>
                  <div className={styles.specBox}>
                    <span className={styles.specIcon}>🚿</span>
                    <div className={styles.specText}>
                      <span className={styles.specVal}>{property.bathrooms || 0}</span>
                      <span className={styles.specLab}>{t('common.bathrooms')}</span>
                    </div>
                  </div>
                  <div className={styles.specBox}>
                    <span className={styles.specIcon}>🏢</span>
                    <div className={styles.specText}>
                      <span className={styles.specVal}>{property.floor || 1} / {property.floors_total || 1}</span>
                      <span className={styles.specLab}>{t('common.floor')}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.description}>
                  <h3>{t('common.aboutObject')}</h3>
                  <p>
                    {t('common.condition')}: <strong>{language === 'ru' ? property.condition_ru : property.condition_kz}</strong>. 
                    {language === 'ru' 
                      ? ' Этот объект представляет собой идеальное сочетание современного дизайна и комфорта. Расположенный в престижном районе, он предлагает высокий уровень приватности и безопасности.'
                      : ' Бұл нысан заманауи дизайн мен жайлылықтың мінсіз үйлесімі болып табылады. Беделді ауданда орналасқан, ол құпиялылық пен қауіпсіздіктің жоғары деңгейін ұсынады.'}
                  </p>
                </div>

                {property.amenities && (
                  <div className={styles.amenitiesSection}>
                    <h3>{t('common.amenitiesTitle')}</h3>
                    <div className={styles.amenitiesGrid}>
                      {property.amenities.map((item: string) => (
                        <div key={item} className={styles.amenityItem}>
                          <span className={styles.check}>✓</span>
                          {t(`amenities.${item}`) || item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside className={styles.sidebar}>
              <BookingCalendar 
                propertyId={property.id} 
                propertyName={title} 
                price={property.price} 
                currency={property.currency || '₸'} 
              />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
