/**
 * @file PatientList.tsx
 * @description Página para listar, visualizar e gerenciar os pacientes cadastrados.
 * Este componente busca os dados de pacientes de uma API (ou mock) e os exibe em uma tabela dinâmica.
 * Inclui funcionalidades de paginação, ordenação e ações como editar e (in)ativar.
 */

// --- Importações de Bibliotecas e Módulos ---
import { ReactNode, useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { differenceInYears, parseISO, format } from "date-fns";
import { Eye, Edit, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DynamicTable, TableColumn } from "@/components/ui/dynamic-table";

// --- Importações de Serviços e Stores ---
import { useAlertStore } from "@/store/DialogAlert";
import { getPatients } from "../services/patient.service";
import { mockPatients } from "./mock/patients.mock";

// --- Importações de Utilitários e Tipos ---
import { formatCPF } from "@/utils/formatUtils";
import { Paciente } from "../types/patient.types"; // Idealmente, a interface viria de um arquivo de tipos central

// --- Constantes e Funções Puras (Definidas fora do componente para performance) ---

const columns: TableColumn<Paciente>[] = [
  { label: "Nome", key: "full_name", sortable: true },
  { label: "CPF", key: "cpf", sortable: false, slot: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Telefone", key: "phone", sortable: false },
  { label: "Idade", key: "birth_date", sortable: false, slot: true },
  { label: "Status", key: "status", sortable: true, slot: true },
  { label: "Data de Cadastro", key: "registration_date", sortable: true, slot: true },
  { label: "Ações", key: "actions", sortable: false, slot: true, width: "100px" },
];

/**
 * Renderiza um Badge de status com base no valor do status do paciente.
 * @param status - O status do paciente ('active' ou 'inactive').
 * @returns Um componente Badge do React.
 */
const renderStatusBadge = (status: string): ReactNode => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>;
    case "inactive":
      return <Badge className="text-white bg-red-500 hover:bg-red-600">Inativo</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

/**
 * Calcula a idade com base na data de nascimento.
 * @param birthDate - A data de nascimento em formato de string ISO (ex: "1990-01-01T00:00:00.000Z").
 * @returns A idade em anos.
 */
const calculateAge = (birthDate: string): number => {
  try {
    return differenceInYears(new Date(), parseISO(birthDate));
  } catch (error) {
    console.error("Data de nascimento inválida:", birthDate);
    return 0;
  }
};

// --- Componente Principal da Página ---

export function PatientList() {
  const navigate = useNavigate();
  const { showAlert } = useAlertStore();

  const [patients, setPatients] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit_per_page: 10,
    total: 0,
  });

  const USE_MOCK = true; // Altere para false para usar a API real

  const fetchPatients = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        const start = (page - 1) * pagination.limit_per_page;
        const end = start + pagination.limit_per_page;
        // Simula um pequeno delay de rede para o mock
        await new Promise(resolve => setTimeout(resolve, 300));
        setPatients(mockPatients.slice(start, end));
        setPagination(prev => ({ ...prev, total: mockPatients.length, page }));
      } else {
        const response = await getPatients(page, pagination.limit_per_page);
        setPatients(response.data);
        setPagination(prev => ({ ...prev, total: response.pagination.total, page }));
      }
    } catch (err: any) {
      const errorMessage = err.message || "Ocorreu um problema ao carregar os pacientes.";
      setError(errorMessage);
      showAlert("Erro na Listagem", "error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.limit_per_page, showAlert, USE_MOCK]); // Adicionado USE_MOCK às dependências

  useEffect(() => {
    fetchPatients(pagination.page);
  }, [fetchPatients]); // O efeito depende da função fetchPatients memoizada

  const handlePageChange = (newPage: number) => {
    fetchPatients(newPage);
  };

  const handleNewPatient = useCallback(() => {
    navigate("/patients/novo"); // Ajuste para a rota correta da sua aplicação
  }, [navigate]);

  const handleToggleStatus = useCallback((patient: Paciente) => {
    // A lógica para chamar a API e (in)ativar o paciente iria aqui.
    // Ex: await togglePatientStatus(patient.id);
    // Após o sucesso, você poderia chamar fetchPatients(pagination.page) para atualizar a lista.
    showAlert(
      "Ação Necessária",
      "info",
      `Implementar a lógica para ${patient.status === "active" ? "inativar" : "ativar"} o paciente.`
    );
  }, [showAlert]);

  const renderCell = useCallback((item: Paciente, column: TableColumn<Paciente>): ReactNode => {
    const value = item[column.key as keyof Paciente];

    switch (column.key) {
      case "cpf": return formatCPF(item.cpf);
      case "birth_date": return `${calculateAge(item.birth_date)} anos`;
      case "status": return renderStatusBadge(item.status);
      case "registration_date": return format(parseISO(item.registration_date), "dd/MM/yyyy");
      case "actions":
        return (
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={`/patients/${item.id}`}><Eye className="w-4 h-4" /></Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/patients/editar/${item.id}`} className="flex items-center gap-2 w-full cursor-pointer">
                    <Edit className="h-4 w-4" /> Editar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleToggleStatus(item)} className="text-red-500 focus:text-white focus:bg-red-500 flex items-center gap-2 cursor-pointer">
                  {item.status === "active" ? "Inativar" : "Ativar"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      default:
        return typeof value === 'string' || typeof value === 'number' ? value : '';
    }
  }, [handleToggleStatus]);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground">Gerencie os pacientes cadastrados no sistema.</p>
        </div>
        <Button onClick={handleNewPatient} className="w-full md:w-fit">
          + Novo Paciente
        </Button>
      </header>

      <main>
        {error && !isLoading && (
          <div className="text-red-600 bg-red-50 border border-red-200 text-center p-4 rounded-md">
            <strong>Erro:</strong> {error}
          </div>
        )}
        <DynamicTable
          columns={columns}
          data={patients}
          renderCell={renderCell}
          emptyMessage="Nenhum paciente encontrado."
          isLoading={isLoading}
          pagination={{
            currentPage: pagination.page,
            itemsPerPage: pagination.limit_per_page,
            totalItems: pagination.total,
            onPageChange: handlePageChange,
          }}
        />
      </main>
    </div>
  );
}