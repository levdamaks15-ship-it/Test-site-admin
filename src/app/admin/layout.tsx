import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RentFlow OS | Управление бизнесом',
  description: 'Панель управления арендой премиальной недвижимости',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root">
      {children}
    </div>
  );
}
