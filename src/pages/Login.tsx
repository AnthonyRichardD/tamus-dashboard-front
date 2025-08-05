import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Activity, LogIn } from 'lucide-react';
import { Link } from 'react-router';
import { PasswordInput } from '@/components/ui/password-input';

import { useAlertStore } from '@/store/DialogAlert';
import { useLoadingStore } from '@/store/loadingStore';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Campo obrigatorio',
    })
    .email({
      message: 'E-mail inválido',
    }),
  password: z.string().min(8, {
    message: 'A senha deve ter pelo menos 8 caracteres',
  }),
});

export function Login() {
  const { showLoading, hideLoading } = useLoadingStore();
  const { showAlert } = useAlertStore();
  const { login, isAuthenticated } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated()) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      showLoading();

      const response = await login({
        email: values.email,
        password: values.password
      })

      if (!response.is_error) {
        return;
      }

      showAlert('Erro na autenticação', 'error', response.message);
    } catch (error) {
      console.error('Erro no login:', error);
      showAlert(
        'Erro inesperado',
        'error',
        'Ocorreu um problema durante o login. Tente novamente mais tarde.'
      );
    } finally {
      hideLoading();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-white p-4">
      <div className="size-16 bg-teal-600 rounded-full flex items-center justify-center mb-4">
        <Activity className="size-10 text-white" />
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Acesso ao Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Sistema de Agendamento de Atendimentos
        </p>
      </div>
      <div className="bg-white max-w-md w-full p-8 rounded-lg shadow-lg border border-gray-200">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <label className="text-sm font-medium leading-none">
                    E-mail
                  </label>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <label className="text-sm font-medium leading-none flex justify-between">
                    <span>Senha</span>
                    <Link
                      className="text-sm text-teal-600 hover:text-teal-800"
                      to="/esqueci-minha-senha"
                    >
                      Esqueci minha senha
                    </Link>
                  </label>
                  <FormControl>
                    <PasswordInput placeholder="Digite sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="h-10" type="submit">
              <div className="flex items-center justify-center">
                <LogIn className="size-4 text-white mr-2" />
                <span>Entrar</span>
              </div>
            </Button>
          </form>
        </Form>
      </div>
      <p className="text-center text-sm text-gray-600 mt-6">
        © 2025 Sistema de Agendamento de Saúde. Todos os direitos <br />
        reservados.
      </p>
    </div>
  );
}
