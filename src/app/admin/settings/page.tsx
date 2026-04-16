'use client';

import { useState } from 'react';
import styles from './settings.module.css';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'contacts' | 'security' | 'system'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    companyName: 'Arenda LUX',
    tagline: 'Премиальная недвижимость и услуги в Казахстане',
    description: 'Мы предоставляем только лучшие объекты для жизни и бизнеса, а также эксклюзивный парк автомобилей и сервис высшего класса.',
    phone: '+7 (700) 123-45-67',
    whatsapp: '+77001234567',
    instagram: '@arendalux_kz',
    email: 'info@arendalux.kz',
    address: 'Алматы, проспект Аль-Фараби, 77/7',
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🏢 Профиль Компании</h2>
            <div className={styles.formGroup}>
              <label>Название бренда</label>
              <input 
                className={styles.input} 
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Слоган / Тэглайн</label>
              <input 
                className={styles.input} 
                value={formData.tagline}
                onChange={e => setFormData({...formData, tagline: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label>О компании</label>
              <textarea 
                className={`${styles.input} ${styles.textarea}`}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
        );
      case 'contacts':
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📞 Контактная Информация</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className={styles.formGroup}>
                <label>Телефон для связи</label>
                <input 
                  className={styles.input} 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>WhatsApp (только цифры)</label>
                <input 
                  className={styles.input} 
                  value={formData.whatsapp}
                  onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className={styles.formGroup}>
                <label>Instagram Username</label>
                <input 
                  className={styles.input} 
                  value={formData.instagram}
                  onChange={e => setFormData({...formData, instagram: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email поддержки</label>
                <input 
                  className={styles.input} 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Физический адрес</label>
              <input 
                className={styles.input} 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>
        );
      case 'security':
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🔐 Безопасность</h2>
            <p style={{ color: 'var(--text-muted)' }}>Функционал смены пароля будет доступен в следующем обновлении системы.</p>
            <div className={styles.formGroup} style={{ opacity: 0.5 }}>
              <label>Текущий пароль</label>
              <input type="password" className={styles.input} disabled value="********" />
            </div>
            <div className={styles.formGroup} style={{ opacity: 0.5 }}>
              <label>Новый пароль</label>
              <input type="password" className={styles.input} disabled placeholder="Введите новый пароль" />
            </div>
          </div>
        );
      case 'system':
        return (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>⚙️ Системные Настройки</h2>
            <div className={styles.kpiCard} style={{ background: '#f8fafc', marginBottom: '30px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>Статус базы данных</span>
                <span style={{ color: 'var(--accent-success)', fontWeight: 800 }}>CONNECTED (Supabase)</span>
              </div>
            </div>
            
            <div className={styles.dangerZone}>
              <h4 className={styles.dangerTitle}>Зона риска</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Очистка системного кэша приведет к повторной загрузке всех данных при следующем посещении. 
              </p>
              <button className="btn" style={{ background: 'transparent', border: '1px solid #dc2626', color: '#dc2626', padding: '8px 16px', borderRadius: '4px' }}>
                Очистить кэш системы
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.settings}>
      <header className={styles.header}>
        <h1 className={styles.title}>Настройки RentFlow OS</h1>
      </header>

      <div className={styles.grid}>
        <aside className={styles.sidebar}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            🏢 Профиль
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'contacts' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            📞 Контакты
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'security' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔐 Безопасность
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'system' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('system')}
          >
            ⚙️ Система
          </button>
        </aside>

        <div className={styles.contentCard}>
          {renderContent()}

          <div className={styles.saveBar}>
            <button 
              className={styles.btnSave} 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение...' : saveSuccess ? '✓ Сохранено' : 'Сохранить изменения'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
