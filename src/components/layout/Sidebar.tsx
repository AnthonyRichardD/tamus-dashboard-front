import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export function Sidebar() {
  return (
    <>
      {/* Mobile */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <div className="flex h-16 items-center px-4 border-b bg-white">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
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
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-4 border-b">
        <span>HealthScheduler</span>
      </div>
    </div>
  );
}
