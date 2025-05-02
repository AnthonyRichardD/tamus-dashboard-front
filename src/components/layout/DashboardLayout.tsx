import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#f7f9fa]">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-[255px]">
        <Header />
        <main></main>
        <Outlet />
      </div>
    </div>
  );
}
