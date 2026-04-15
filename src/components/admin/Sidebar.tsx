'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const menuItems = [
  { name: 'Дашборд', path: '/admin', icon: '📊' },
  { name: 'CRM и Клиенты', path: '/admin/crm', icon: '👥' },
  { name: 'Инвентарь', path: '/admin/inventory', icon: '🏠' },
  { name: 'Финансы', path: '/admin/financials', icon: '💰' },
  { name: 'Настройки', path: '/admin/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.logo}>
          Rent<span>Flow</span> OS
        </div>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.name}>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>A</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>Alex Business</div>
            <div className={styles.userRole}>Администратор</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
