import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';

import {
  LogOutIcon,
  LayoutDashboard,
  UserCog,
  ChevronLeft,
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router';

interface SidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: string | undefined;
}

export function Sidebar({ isOpen, onOpenChange, userRole }: SidebarProps) {
  return (
    <>
      {/* Mobile */}
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-[255px] px-0">
          {/* Botão para fechar/voltar */}
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ChevronLeft />
              <span>Voltar</span>
            </button>
            <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
          </div>
          <DesktopSidebarContent userRole={userRole} />
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-[255px] bg-white border-r z-50">
        <DesktopSidebarContent userRole={userRole} />
      </div>
    </>
  );
}

function DesktopSidebarContent({ userRole }: { userRole: string | undefined }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  const sidebarItems = [
    { name: 'Dashboard', path: '/dashboard', roles: ['admin', 'superadmin'], icon: <LayoutDashboard /> },
    { name: 'Administradores', path: '/admin/list', roles: ['superadmin'], icon: <UserCog /> },
  ];


  const filteredItems = sidebarItems.filter((item) => userRole !== undefined && item.roles.includes(userRole));


  const getItemClass = (path: string) =>
    location.pathname === path
      ? 'bg-teal-50 text-teal-600'
      : 'bg-white text-gray-700 hover:bg-gray-100';

  return (
    <div className="justify-between flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 min-h-16 content-center items-center px-4 border-b gap-2">
        <div className="size-8 bg-teal-600 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <span>HealthScheduler</span>
      </div>

      {/* Menu de Navegação */}
      <div className="w-full p-2 h-full space-y-1">
        {filteredItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-2 rounded-md p-2 ${getItemClass(item.path)}`}
          >
            {/* Ícone do item */}
            {item.icon}
            {/* Nome do item */}
            <span>{item.name}</span>
          </button>
        ))}
      </div>
      <button onClick={() => { logout(); }} className="flex h-16 min-h-16 content-center items-center px-4 border-t gap-2 text-red-500 cursor-pointer">
        <LogOutIcon />
        <span>Sair</span>
      </button>
    </div>
  );
}
