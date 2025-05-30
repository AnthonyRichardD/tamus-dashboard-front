import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PasswordInput } from "@/components/ui/password-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useLoadingStore } from "@/store/loadingStore";
import adminServices from "@/services/admin.services";
import { useAlertStore } from "@/store/DialogAlert";
import { useNavigate } from "react-router-dom";

function generateRandomPassword(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
};

function isValidCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== Number(cpf.charAt(9))) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== Number(cpf.charAt(10))) return false;
  return true;
};

const formSchema = z.object({
  full_name: z.string().min(7, { message: "Nome completo é obrigatório" }),
  cpf: z.string()
    .length(11, { message: "CPF deve ter 11 dígitos" })
    .refine(isValidCPF, { message: "CPF inválido" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().optional(),
  cargo: z.string().min(1, "Cargo é obrigatório"),
  status: z.enum(["ativo", "inativo"]),
  gerarSenha: z.boolean().optional(),
  senha: z.string().optional(),
}).refine((data) => {
  if (!data.gerarSenha) {
    return !!data.senha && data.senha.length >= 8
  }
  return true
}, {
  message: "Senha deve ter pelo menos 8 caracteres",
  path: ["senha"],
});

export default function AdminForm() {
  const [gerarSenha, setGerarSenha] = useState(false);
  const { showLoading, hideLoading } = useLoadingStore();
  const { showAlert } = useAlertStore();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      cpf: "",
      email: "",
      phone: "",
      cargo: "",
      status: "ativo",
      gerarSenha: false,
      senha: "",
    },
  });

  const handleCheckbox = (checked: boolean) => {
    setGerarSenha(checked)
    form.setValue("gerarSenha", checked)
    if (checked) {
      form.setValue("senha", "")
    }
  };

  const handleCpfChange = (fieldOnChange: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 11)
    fieldOnChange(onlyNums)
  };

  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    showLoading();
    try {
      if (!values.gerarSenha && !values.senha) {
        showAlert("Erro", "error", "Por favor, preencha a senha ou marque a opção de gerar senha automaticamente.");
        hideLoading();
        return;
      }

      if (values.gerarSenha) {
        values.senha = generateRandomPassword(10);
      }

      const response = await adminServices.createAdmin({
        full_name: values.full_name,
        cpf: values.cpf,
        email: values.email,
        phone: values.phone || "",
        role: "admin",
        status: values.status === "ativo" ? "ACTIVE" : "INACTIVE",
        password: values.senha || "",
      });

      if (
        response.message?.toLowerCase().includes("acesso negado") ||
        response.message?.toLowerCase().includes("não tem permissão")
      ) {
        showAlert("Acesso negado", "error", "Você não tem permissão para realizar esta ação.");
        return;
      }

      if (!response.is_error) {
        showAlert("Administrador criado com sucesso!", "success", response.message);
        setTimeout(() => {
          navigate("/admin/list");
        }, 1500);
        return;
      }

      showAlert("Erro", "error", response.message || "Erro ao criar administrador.");
    } catch (error) {
      console.error('Erro:', error);
      showAlert("Erro inesperado", "error", "Erro inesperado ao criar administrador. Tente novamente.");
    } finally {
      hideLoading();
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Novo Administrador</h1>
          <p className="text-gray-600">Cadastre um novo administrador no sistema.</p>
        </div>
        <Button variant="ghost" className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Button>
      </div>

      <div className="border rounded-lg p-6 bg-white">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Informações do Administrador</h2>
          <p className="text-gray-600">Preencha os dados abaixo para criar um novo administrador.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="full_name">Nome Completo</Label>
                        <FormControl>
                          <Input id="full_name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="cpf">CPF</Label>
                        <FormControl>
                          <Input
                            id="cpf"
                            inputMode="numeric"
                            {...field}
                            onChange={handleCpfChange(field.onChange)}
                          />
                        </FormControl>
                        <FormDescription>
                          Digite apenas os números (11 dígitos)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email">Email</Label>
                        <FormControl>
                          <Input id="email" type="email" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="phone">Telefone</Label>
                        <FormControl>
                          <Input id="phone" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="cargo"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="cargo">Cargo</Label>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cargo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="administrador">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="status">Status</Label>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center space-x-2">
              <Checkbox
                id="gerar-senha"
                checked={gerarSenha}
                onCheckedChange={handleCheckbox}
              />
              <Label htmlFor="gerar-senha" className="font-normal">
                Gerar senha automaticamente e enviar por email
              </Label>
            </div>

            {!gerarSenha && (
              <div className="mt-6 space-y-2">
                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="senha">Senha</Label>
                      <FormControl>
                        <PasswordInput id="senha" {...field} />
                      </FormControl>
                      <FormDescription>
                        A senha deve ter pelo menos 8 caracteres e incluir letras e números.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" className="px-5 cursor-pointer" type="button">
                Cancelar
              </Button>
              <Button variant="primary" className="cursor-pointer" type="submit">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}