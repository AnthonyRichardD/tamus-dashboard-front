import { Sidebar } from './sidebar';
import { Header } from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f7f9fa]">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-[255px]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
