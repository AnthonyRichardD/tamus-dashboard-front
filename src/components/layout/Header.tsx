import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white h-16 border-b flex items-center px-4">
      <div className="flex-1 flex justify-end">
        <nav className="flex-1 justify-start content-center overflow-y-auto ">
          <div className="space-y-1">Dashboard</div>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/admin.png" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5 text-sm">
              <div className="font-medium">Admin</div>
              <div className="text-gray-500">admin@saude.gov</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
