import { PasswordInput } from '@/components/ui/password-input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';
import  adminServices  from '@/services/admin.services';
import { useAlertStore } from '@/store/DialogAlert';
import { useLoadingStore } from '@/store/loadingStore';
import { useNavigate } from 'react-router-dom';

const formSchema = z
  .object({
    verification_code: z
      .string()
      .length(6, { message: 'O código de verificação deve ter 6 dígitos' }),

    new_password: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),

    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'As senhas não coincidem',
  });

const RecoverPassword = () => {
  const { showLoading, hideLoading } = useLoadingStore();
  const { showAlert } = useAlertStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      verification_code: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const navigate = useNavigate();
  async function onSubmit(values: z.infer<typeof formSchema>) {
     try {
          showLoading();
    
          const response = await adminServices.resetPassword({
            code: values.verification_code, new_password: values.new_password});
    
          // Tratamento de sucesso
          if (!response.is_error) {
            // TODO: Salvar o token e gerenciar os estados
            showAlert('Senha redefinida com sucesso!', 'success', response.message);

            // Redirecionar para a página de login ou outra ação
            setTimeout(() => {
              navigate('/login');
            }, 1500);
            return;
          }
          console.log(response);
          // Tratamento de erro conhecido (da API)
          showAlert('Erro ao redefinir senha', 'error', response.message);
        } catch (error) {
          // Tratamento de erro inesperado
          console.error('Erro na recuperação de senha:', error);
          showAlert(
            'Erro inesperado',
            'error',
            'Ocorreu um erro ao tentar recuperar a senha. Tente novamente mais tarde.'
          );
        } finally {
          hideLoading();
        }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col items-center justify-center px-4">
      <div className="bg-teal-600 rounded-full p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-key-round-icon lucide-key-round"
        >
          <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
          <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-semibold text-center mt-4">
          Redefinir Senha
        </h1>
        <p className="text-gray-600 text-center text-sm mt-1">
          Digite o código recebido por e-mail e crie uma nova senha
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md w-full max-w-md p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="verification_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium mb-1">
                    Código de Verificação
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium mb-1">
                    Nova Senha
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Digite sua nova senha"
                      className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium mb-1">
                    Confirmar Senha
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirme sua nova senha"
                      className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded font-medium cursor-pointer"
              >
                Redefinir Senha
              </button>

              <Link
                to="/login"
                className="w-full mb-3 bg-white hover:bg-[#F4F4F5] text-gray-800 py-2 px-4 rounded border border-gray-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-left-icon lucide-arrow-left"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                Voltar para o login
              </Link>
            </div>
          </form>
        </Form>
      </div>

      <p className="mt-6 text-sm text-gray-500 text-center">
        © 2025 Sistema de Agendamento de Saúde. Todos os direitos <br />{' '}
        reservados.
      </p>
    </div>
  );
};

export default RecoverPassword;
