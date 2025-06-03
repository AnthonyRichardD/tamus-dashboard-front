import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { Edit, MoreHorizontal, Trash2, UserPlus } from "lucide-react"
import { DynamicTable, TableColumn } from "@/components/ui/dynamic-table"
import { ReactNode, useEffect, useState } from "react"
import { Link } from "react-router"
import moment from "moment"
import { useAlertStore } from "@/store/DialogAlert"
import adminServices from "@/services/admin.services"
import { formatCPF } from "@/utils/formatUtils"

interface Administrador {
    id: number,
    cpf: string,
    full_name: string,
    email: string,
    phone: string,
    role: 'admin' | 'superadmin',
    registration_date: string,
    status: string,
}

export function AdminList() {
    const { showAlert } = useAlertStore();
    const [isLoading, setIsLoading] = useState(false)
    const [admins, setAdmins] = useState<Administrador[]>([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit_per_page: 10,
        total: 0
    })
    const [filters, setFilters] = useState({})

    async function getAdminList(page = 1) {
        try {
            setIsLoading(true);
            const response = await adminServices.list({
                page,
                limit_per_page: pagination.limit_per_page,
                filters
            });

            if (!response.is_error) {
                setAdmins(response.data);
                setPagination(prev => ({
                    ...prev,
                    total: response.pagination.total,
                    page
                }));
                return;
            }

            showAlert('Erro na listagem', 'error', response.message);
        } catch (error) {
            console.error('Erro ao listar administradores:', error);
            showAlert(
                'Erro inesperado',
                'error',
                'Ocorreu um problema ao carregar os administradores. Tente novamente mais tarde.'
            );
        } finally {
            setIsLoading(false);
        }
    }

    const handlePageChange = (newPage: number) => {
        getAdminList(newPage);
    };

    const applyFilters = (newFilters: any) => {
        setFilters(newFilters);
        getAdminList(1); // Reset para a primeira página com novos filtros
    };

    useEffect(() => {
        getAdminList();
    }, []);

    const columns: TableColumn<Administrador>[] = [
        { label: "Nome", key: "full_name", sortable: true },
        { label: "CPF", key: "cpf", sortable: false, slot: true },
        { label: "Email", key: "email", sortable: true },
        { label: "Telefone", key: "phone", sortable: false },
        { label: "Cargo", key: "role", sortable: true, slot: true },
        { label: "Status", key: "status", sortable: true, slot: true },
        { label: "Data de Cadastro", key: "registration_date", sortable: true, slot: true },
        { label: "Ações", key: "actions", sortable: false, slot: true, width: "80px" },
    ]

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-500">Ativo</Badge>
            case "inactive":
                return (
                    <Badge variant="outline" className="text-white bg-red-500">
                        Inativo
                    </Badge>
                )
            case "suspended":
                return <Badge className="bg-amber-500">Suspenso</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const renderCell = (item: Administrador, column: TableColumn<Administrador>): ReactNode => {
        switch (column.key) {
            case "full_name":
                return <span className="font-medium">{item.full_name}</span>
            case "cpf":
                return formatCPF(item.cpf)
            case "role":
                return (
                    <Badge variant={item.role === "superadmin" ? "default" : "outline"}>
                        {item.role === "superadmin" ? "SuperAdmin" : "Admin"}
                    </Badge>
                )
            case "status":
                return renderStatusBadge(item.status)
            case "registration_date":
                return moment(item.registration_date).format("DD/MM/YYYY")
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
                            <DropdownMenuItem
                                className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                            >
                                <Link to={`/admin/editar/${item.id}`} className="flex items-center gap-2">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </Link>
                            </DropdownMenuItem>
                            {item.status === "active" ? (
                                <DropdownMenuItem className="text-amber-600 relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                                    Suspender
                                </DropdownMenuItem>
                            ) : item.status === "suspenso" ? (
                                <DropdownMenuItem className="text-green-600 relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                                    Reativar
                                </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            default:
                return item[column.key as keyof Administrador]
        }
    }

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Administradores</h1>
                    <p className="text-muted-foreground">Gerencie os administradores do sistema de agendamento.</p>
                </div>
                <Button className="w-fit bg-black text-white hover:bg-black/90">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Novo Administrador
                </Button>
            </div>

            <DynamicTable
                columns={columns}
                data={admins}
                renderCell={renderCell}
                emptyMessage="Nenhum administrador encontrado."
                isLoading={isLoading}
                pagination={{
                    currentPage: pagination.page,
                    itemsPerPage: pagination.limit_per_page,
                    totalItems: pagination.total,
                    onPageChange: handlePageChange
                }}
            />
        </div>
    );
}