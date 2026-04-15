'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../page.module.css'; // Путь к стилям в корне app

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0000') {
      localStorage.setItem('rf_auth', 'true');
      router.push('/admin');
    } else {
      setError('Неверный пароль. Попробуйте 0000');
    }
  };

  return (
    <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className={styles.card} style={{ maxWidth: '400px', width: '100%', padding: '40px', textAlign: 'center' }}>
        <h1 className={styles.title} style={{ fontSize: '24px', marginBottom: '20px' }}>RentFlow OS</h1>
        <p className={styles.subtitle} style={{ marginBottom: '30px' }}>Введите код доступа для управления системой</p>
        
        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            placeholder="Пароль" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '18px',
              letterSpacing: '5px'
            }}
          />
          {error && <p style={{ color: '#d9534f', fontSize: '14px', marginBottom: '20px' }}>{error}</p>}
          <button 
            type="submit" 
            className="btn-primary" // Используем глобальный стиль, если есть, или инлайн
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#B8860B',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Войти в систему
          </button>
        </form>
      </div>
    </div>
  );
}
