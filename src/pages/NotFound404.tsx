import { Link } from 'react-router';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound404() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-teal-600 rounded-full p-4 mb-4">
          <AlertTriangle size={40} className="text-white" />
        </div>
        <h1 className="text-6xl font-bold text-teal-600">404</h1>
        <h2 className="text-2xl font-semibold mt-2 text-gray-800 text-center">
          Página não encontrada
        </h2>
        <p className="text-gray-600 text-center mt-1">
          Ops! Parece que você está tentando acessar uma página que não existe ou foi movida.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Link
          to="/"
          className="h-10 w-full bg-teal-600 hover:bg-teal-700 text-white rounded-md font-medium text-sm inline-flex items-center justify-center"
        >
          Página Inicial
        </Link>

        <Link
          to="/login"
          className="w-full bg-white rounded-md hover:bg-[#F4F4F5] text-gray-800 py-2 px-4 h-10 border font-medium text-sm border-gray-200 inline-flex items-center justify-center gap-2"
        >
          <ArrowLeft size={14} />
          Voltar para o login
        </Link>
      </div>

      <footer className="mt-6 text-sm text-gray-500 text-center">
        © 2025 Sistema de Agendamento de Saúde. Todos os direitos <br />
        reservados.
      </footer>
    </div>
  );
}
