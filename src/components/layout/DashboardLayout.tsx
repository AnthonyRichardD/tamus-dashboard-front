import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen bg-[#f7f9fa]">
      <Sidebar userRole={user?.roles[0]} isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col w-full md:ml-[255px]">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 w-full overflow-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
