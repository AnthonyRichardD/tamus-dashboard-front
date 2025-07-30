import { ReactNode, useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { differenceInYears, parseISO, format } from "date-fns";
import { Eye, Edit, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";

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

import { useAlertStore } from "@/store/DialogAlert";
import PatientService from "../services/patient.service"; // Importa apenas o serviço
import { Paciente } from "@/types/patient.types"; // Importa a interface Paciente de um local central

import { formatCPF } from "@/utils/formatUtils";

// Colunas da tabela de pacientes
const columns: TableColumn<Paciente>[] = [
  { label: "Nome", key: "full_name", sortable: true },
  { label: "CPF", key: "cpf", sortable: false, slot: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Telefone", key: "phone", sortable: false },
  { label: "Idade", key: "birth_date", sortable: false, slot: true },
  { label: "Status", key: "active", sortable: true, slot: true },
  { label: "Data de Cadastro", key: "registration_date", sortable: true, slot: true },
  { label: "Ações", key: "actions", sortable: false, slot: true, width: "100px" },
];

// Renderiza o badge de status (Ativo/Inativo)
const renderStatusBadge = (isActive: boolean): ReactNode => {
  if (isActive) {
    return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>;
  }
  return <Badge className="text-white bg-red-500 hover:bg-red-600">Inativo</Badge>;
};

// Calcula a idade a partir da data de nascimento
const calculateAge = (birthDate: string): number => {
  try {
    return differenceInYears(new Date(), parseISO(birthDate));
  } catch (error) {
    console.error("Data de nascimento inválida:", birthDate, error);
    return 0;
  }
};

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
  const [filters] = useState({}); // Estado de filtros, não usado na UI ainda

  // Busca a lista de pacientes da API
  const fetchPatients = useCallback(async (page: number = pagination.page) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await PatientService.list(page, pagination.limit_per_page);

      if (!response.is_error) {
        // Afirmação de tipo para resposta bem-sucedida
        const paginatedResponse = response as { data: Paciente[], pagination: { total: number } };
        setPatients(paginatedResponse.data);
        setPagination(prev => ({
          ...prev,
          total: paginatedResponse.pagination.total,
          page: page,
        }));
      } else {
        setError(response.message || "Falha ao carregar pacientes.");
        showAlert("Erro na Listagem", "error", response.message || "Falha ao carregar pacientes.");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erro inesperado ao carregar pacientes.";
      setError(errorMessage);
      showAlert("Erro na Listagem", "error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.limit_per_page, showAlert]);

  // Carrega pacientes no mont do componente
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Lida com a mudança de página da paginação
  const handlePageChange = (newPage: number) => {
    fetchPatients(newPage);
  };

  // Alterna o status (Ativo/Inativo) do paciente
  const handleToggleStatus = useCallback(async (patientToToggle: Paciente) => {
    setIsLoading(true);
    try {
      const newStatus = !patientToToggle.active;
      const response = await PatientService.update(
        String(patientToToggle.id),
        { active: newStatus }
      );

      if (!response.is_error) {
        showAlert("Sucesso", "success", response.message || `Paciente ${newStatus ? 'ativado' : 'inativado'} com sucesso!`);
        fetchPatients(pagination.page);
      } else {
        showAlert("Erro", "error", response.message || `Falha ao alterar status do paciente.`);
      }
    } catch (err: any) {
      showAlert("Erro", "error", err.message || `Erro ao alternar status do paciente.`);
    } finally {
      setIsLoading(false);
    }
  }, [showAlert, fetchPatients, pagination.page]);

  // Placeholder para a função de exclusão de paciente
  const handleDeletePatient = useCallback(async (patientToDelete: Paciente) => {
    showAlert("Ação Necessária", "info", `Implementar lógica de exclusão para o paciente: ${patientToDelete.full_name}`);
  }, [showAlert]);

  // Renderiza o conteúdo de cada célula da tabela
  const renderCell = useCallback((item: Paciente, column: TableColumn<Paciente>): ReactNode => {
    const value = item[column.key as keyof Paciente];

    switch (column.key) {
      case "full_name":
        return <span className="font-medium">{item.full_name}</span>;
      case "cpf":
        return formatCPF(item.cpf);
      case "email":
        return item.email;
      case "phone":
        return item.phone;
      case "birth_date":
        return `${calculateAge(item.birth_date)} anos`;
      case "active":
        return renderStatusBadge(item.active);
      case "registration_date":
        return item.registration_date ? format(parseISO(item.registration_date), "dd/MM/yyyy") : '';
      case "actions":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            >
              <DropdownMenuItem asChild>
                <Link to={`/paciente/${item.id}`} className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <Eye className="mr-2 h-4 w-4" /> Visualizar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/patients/editar/${item.id}`} className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleToggleStatus(item)}
                className={`relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ${item.active ? 'text-amber-600 focus:bg-amber-500 focus:text-white' : 'text-green-600 focus:bg-green-500 focus:text-white'}`}
              >
                {item.active ? "Inativar" : "Ativar"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeletePatient(item)}
                className="text-red-600 relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive focus:text-destructive-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
    }
  }, [handleToggleStatus, handleDeletePatient]);

  // Lida com a navegação para a página de novo paciente
  const handleNewPatient = useCallback(() => {
    navigate("/patients/novo");
  }, [navigate]);

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground">Gerencie os pacientes cadastrados no sistema.</p>
        </div>
        <Button onClick={handleNewPatient} className="w-full md:w-auto bg-black text-white hover:bg-black/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Paciente
        </Button>
      </div>

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
    </div>
  );
}