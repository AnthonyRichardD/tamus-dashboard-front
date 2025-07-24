import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white h-16 border-b flex items-center px-4">
      <div className="flex-1 flex justify-end">
        <nav className="flex-1 justify-start content-center overflow-y-auto">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 flex justify-center md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <span className="hidden md:inline">Dashboard</span>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/admin.png" alt="Admin" />
              <AvatarFallback className="uppercase">{`${user?.full_name[0]}${user?.full_name[1]}`}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5 text-sm">
              <div className="font-medium">{user?.full_name}</div>
              <div className="text-gray-500">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
