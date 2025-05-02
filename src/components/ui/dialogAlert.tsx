import { AlertTypes, useAlertStore } from '@/store/DialogAlert';
import { CircleAlert, CircleCheckBig, TriangleAlert } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export const DialogAlert = () => {
  const { isOpen, title, message, type, hideAlert } = useAlertStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsMounted(false);
    setTimeout(() => hideAlert(), 300);
  };

  const getColorClassesByType = (type: AlertTypes) => {
    switch (type) {
      case 'error':
        return {
          icon: 'text-red-700',
          button: 'bg-red-700 hover:bg-red-800 text-white',
        };
      case 'warning':
        return {
          icon: 'text-yellow-400',
          button: 'bg-yellow-400 hover:bg-yellow-500 text-white',
        };
      case 'success':
        return {
          icon: 'text-green-700',
          button: 'bg-green-700 hover:bg-green-800 text-white',
        };
      default:
        return {
          icon: 'text-black',
          button: 'bg-black hover:bg-gray-800 text-white',
        };
    }
  };

  const colors = getColorClassesByType(type);

  if (!isOpen && !isMounted) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center transition-all duration-300',
        isMounted ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div
        className={cn(
          'bg-white max-w-md w-full p-8 rounded-md flex justify-center items-center flex-col gap-3 transform transition-all duration-300',
          isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
      >
        {type === 'error' && (
          <CircleAlert size={50} className={cn(colors.icon)} />
        )}
        {type === 'warning' && (
          <TriangleAlert size={50} className={colors.icon} />
        )}
        {type === 'success' && (
          <CircleCheckBig size={50} className={cn(colors.icon)} />
        )}
        <div className="text-center space-y-1">
          <h2 className={cn('text-xl font-semibold', colors.icon)}>{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="flex gap-2">
          <Button
            className={cn('w-[100px] rounded-sm', colors.button)}
            onClick={handleClose}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};
