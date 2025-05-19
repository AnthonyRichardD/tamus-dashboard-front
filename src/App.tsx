import { DialogAlert } from '@/components/ui/dialogAlert';
import { useAlertStore } from '@/store/DialogAlert';

function App() {
  const show = () => {
    useAlertStore
      .getState()
      .showAlert(
        'Erro de autenticação',
        'warning',
        'This is a success alert This is a success alert This is a success alert This is a success alert'
      );
  };
  return (
    <>
      <DialogAlert />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-white p-4">
        <div
          className="size-16 bg-teal-600 rounded-full flex items-center justify-center"
          onClick={show}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-10"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
      </div>
    </>
  );
}

export default App;
