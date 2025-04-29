import { AlertTypes, useAlertStore } from '@/store/DialogAlert';
import { CircleAlert, CircleCheckBig, TriangleAlert } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export const DialogAlert = () => {
  const { isOpen, title, message, type, hideAlert } = useAlertStore();

  // Função para obter as classes de cor baseadas no tipo
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

  return (
    <>
      <div
        className={
          isOpen
            ? 'fixed inset-0 bg-black/60 flex items-center justify-center'
            : 'hidden'
        }
      >
        <div className="bg-white max-w-md w-full p-8 rounded-md flex justify-center items-center flex-col gap-3">
          {type === 'error' && (
            <CircleAlert size={50} className={colors.icon} />
          )}
          {type === 'warning' && (
            <TriangleAlert size={50} className={colors.icon} />
          )}
          {type === 'success' && (
            <CircleCheckBig size={50} className={colors.icon} />
          )}
          <div className="text-center space-y-1">
            <h2 className={cn('text-xl font-semibold', colors.icon)}>
              {title}
            </h2>
            <p className="text-gray-600">{message}</p>
          </div>
          <div className="flex gap-2">
            <Button
              className={cn('w-[100px] rounded-sm', colors.button)}
              onClick={hideAlert}
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
