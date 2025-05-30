import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { LogOutIcon } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ isOpen, onOpenChange }: SidebarProps) {
  return (
    <>
      {/* Mobile */}
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-[255px] px-0">
          <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
          <DesktopSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-[255px] bg-white border-r z-50">
        <DesktopSidebarContent />
      </div>
    </>
  );
}
function DesktopSidebarContent() {
  const { logout } = useAuth();
  return (
    <div className="justify-between flex h-full flex-col">
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
      <div className="w-full p-2 h-full">
        <button className="w-full hover:bg-gray-200 flex items-center gap-2 rounded-md p-2">
          <span>Dashboard</span>
        </button>
      </div>
      <button onClick={() => { logout(); }} className="flex h-16 min-h-16 content-center items-center px-4 border-t gap-2 text-red-500 cursor-pointer">
        <LogOutIcon />
        <span>Sair</span>
      </button>
    </div>
  );
}
