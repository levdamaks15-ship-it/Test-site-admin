'use client';

import { useState, useEffect } from 'react';
import styles from './inventory.module.css';

export default function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newPrice, setNewPrice] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/db');
      const db = await res.json();
      
      // Объединяем свойства и услуги для управления в одном месте
      const combined = [
        ...(db.properties || []).map((p: any) => ({ ...p, category: 'Недвижимость' })),
        ...(db.services || []).map((s: any) => ({ ...s, category: 'Услуга', name: s.title }))
      ];
      setItems(combined);
    } catch (err) {
      console.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      const collection = editingItem.category === 'Недвижимость' ? 'properties' : 'services';
      const data: any = {};
      if (newPrice) data.price = parseInt(newPrice);

      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          collection,
          id: editingItem.id,
          data
        })
      });

      if (res.ok) {
        setEditingItem(null);
        setNewPrice('');
        fetchItems();
      }
    } catch (err) {
      alert('Ошибка при обновлении актива');
    }
  };

  return (
    <div className={styles.inventory}>
      <header className={styles.header}>
        <h1 className={styles.title}>Управление активами (Инвентарь)</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            Все категории ⌄
          </div>
        </div>
      </header>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>Загрузка активов...</div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={`${item.category}-${item.id}`} className={styles.card}>
              <div 
                className={styles.image} 
                style={{ backgroundImage: `url(${item.image || item.images?.[0]})` }}
              >
                <span className={styles.badge} style={{ background: item.status === 'available' || !item.status ? 'var(--accent-success)' : 'var(--accent-primary)' }}>
                  {item.status === 'available' ? 'СВОБОДНО' : 'АКТИВЕН'}
                </span>
              </div>
              <div className={styles.content}>
                <div className={styles.type}>
                  {item.category}
                </div>
                <h3 className={styles.itemName}>{item.title_ru || item.name}</h3>
                
                {editingItem?.id === item.id && editingItem?.category === item.category ? (
                   <div style={{ marginTop: '10px' }}>
                    <input 
                      type="number" 
                      className={styles.priceInput}
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="Новая цена (₸)"
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button className={styles.btnSave} onClick={handleUpdateItem} style={{ flex: 1 }}>✓ Сохранить</button>
                      <button className={styles.btnCancel} onClick={() => setEditingItem(null)} style={{ flex: 1 }}>✕</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.statsRow}>
                      <span>Стоимость (₸)</span>
                      <span className={styles.price}>{item.price?.toLocaleString()} ₸</span>
                    </div>
                    <div className={styles.actions}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {item.id}</span>
                      <button 
                        className={styles.btnEdit} 
                        onClick={() => {
                          setEditingItem(item);
                          setNewPrice(item.price.toString());
                        }}
                      >
                        Изменить цену
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
