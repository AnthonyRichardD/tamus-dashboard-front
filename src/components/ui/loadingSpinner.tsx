import spinner from '@/assets/spinner.svg';
import { useLoadingStore } from '@/store/loadingStore';

export const LoadingSpinner = () => {
  const { isLoading } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <img src={spinner} alt="Loading..." className="h-40 w-40 animate-spin" />
    </div>
  );
};
