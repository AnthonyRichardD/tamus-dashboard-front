import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { LogOutIcon } from 'lucide-react';

export function Sidebar() {
  return (
    <>
      {/* Mobile */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <div className="flex h-16 items-center px-2.5 border-b bg-white">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5 " />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="w-[255px] px-0">
          <DesktopSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-[255px] bg-white border-r">
        <DesktopSidebarContent />
      </div>
    </>
  );
}

function DesktopSidebarContent() {
  return (
    <div className=" justify-between flex h-full flex-col">
      <div className="flex h-16 content-center items-center px-4 border-b gap-2">
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
      <div className="flex h-16 content-center items-center px-4 border-t gap-2 text-red-500">
        <LogOutIcon />
        <span>Sair</span>
      </div>
    </div>
  );
}
