'use client';

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  price: number;
}

const STORAGE_KEY = 'arenda_lux_bookings';

const initialBookings: Booking[] = [
  {
    id: 'BK-001',
    serviceId: 'concierge',
    serviceName: 'Персональный консьерж',
    clientName: 'Александр Иванов',
    clientEmail: 'ivanov@example.com',
    date: '2026-04-20',
    status: 'confirmed',
    createdAt: '2026-04-10T10:00:00Z',
    price: 150000,
  },
  {
    id: 'BK-002',
    serviceId: 'vip-viewing',
    serviceName: 'VIP-просмотр объектов',
    clientName: 'Марина Ли',
    clientEmail: 'm.li@example.com',
    date: '2026-04-18',
    status: 'pending',
    createdAt: '2026-04-14T15:30:00Z',
    price: 50000,
  },
  {
    id: 'BK-003',
    serviceId: 'car-rental',
    serviceName: 'Аренда авто премиум-класса',
    clientName: 'Дархан Болатов',
    clientEmail: 'bolatov@example.com',
    date: '2026-04-16',
    status: 'completed',
    createdAt: '2026-04-12T09:15:00Z',
    price: 250000,
  }
];

export const getBookings = (): Booking[] => {
  if (typeof window === 'undefined') return initialBookings;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBookings));
    return initialBookings;
  }
  return JSON.parse(stored);
};

export const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
  const bookings = getBookings();
  const tempId = `BK-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  
  const newBooking: Booking = {
    ...booking,
    id: tempId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  // 1. Сохраняем локально (для надежности)
  const updated = [newBooking, ...bookings];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // 2. Отправляем в RentFlow OS (Автоматика)
  try {
    await fetch('http://localhost:3001/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add',
        collection: 'bookings',
        data: newBooking
      }),
    });
    console.log('Successfully synced with RentFlow OS DB');
  } catch (err) {
    console.error('Failed to sync with RentFlow OS, kept local only');
  }

  return newBooking;
};

export const updateBookingStatus = (id: string, status: Booking['status']) => {
  const bookings = getBookings();
  const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
