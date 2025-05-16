import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Activity, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import adminServices from '@/services/admin.services';
import { useAlertStore } from '@/store/DialogAlert';
import { useLoadingStore } from '@/store/loadingStore';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'O e-mail é obrigatório.' })
    .email({ message: 'E-mail inválido.' }),
});

export default function RecoverPasswordToken() {
  const { showLoading, hideLoading } = useLoadingStore();
  const { showAlert } = useAlertStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      showLoading();

      const response = await adminServices.RecoverPasswordToken(data.email);

      if (response.is_error) {
        showAlert('Erro ao recuperar senha', 'error', response.message || 'Tente novamente.');
        return;
      }

      showAlert(
        'Recuperação de senha',
        'success',
        'Se o e-mail estiver cadastrado, você receberá um link de recuperação.'
      );
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      showAlert(
        'Erro inesperado',
        'error',
        'Ocorreu um problema durante a recuperação. Tente novamente mais tarde.'
      );
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col items-center justify-center">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-teal-600 rounded-full flex items-center justify-center">
          <Activity size={42} className="text-white" />
        </div>
        <h1 className="text-2xl font-medium text-gray-800">Recuperar Senha</h1>
        <p className="text-gray-600 font-medium">
          Enviaremos instruções para redefinir sua senha
        </p>
      </div>
      <div className="w-[448px] bg-white shadow-md rounded-lg border border-gray-200 p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu e-mail cadastrado"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="bg-teal-600 hover:bg-teal-700 h-10 w-full font-medium"
              type="submit"
            >
              Enviar instruções
            </Button>
          </form>
        </Form>
        <Link
          to="/Login"
          className="leading-0 inline-flex items-center justify-center gap-2 text-[14px] h-10 w-full mt-2 py-1 text-[#000000] bg-white hover:bg-[#F4F4F5] rounded-md border border-gray-300 font-medium"
        >
          <ArrowLeft size={14} /> Voltar para o login
        </Link>
      </div>
      <footer className="mt-6 text-center text-gray-500 text-xs font-medium">
        © 2025 Sistema de Agendamento de Saúde. Todos os direitos reservados.
      </footer>
    </div>
  );
}
