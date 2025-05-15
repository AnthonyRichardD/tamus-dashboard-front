import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { Edit, MoreHorizontal, Trash2, UserPlus } from "lucide-react"
import { DynamicTable, TableColumn } from "@/components/ui/dynamic-table"
import { ReactNode, useState } from "react"
import { Link } from "react-router"
import moment from "moment"

interface Administrador {
    id: number
    cpf: string
    nome_completo: string
    email: string
    telefone: string
    cargo: string
    data_cadastro: string
    status: "ativo" | "inativo" | "suspenso"
}

const administradoresSimulados: Administrador[] = [
    {
        id: 1,
        cpf: "12345678901",
        nome_completo: "João Silva",
        email: "joao.silva@saude.gov",
        telefone: "(11) 98765-4321",
        cargo: "admin",
        data_cadastro: "2023-01-15T10:30:00",
        status: "ativo",
    },
    {
        id: 2,
        cpf: "23456789012",
        nome_completo: "Maria Oliveira",
        email: "maria.oliveira@saude.gov",
        telefone: "(11) 97654-3210",
        cargo: "superadmin",
        data_cadastro: "2023-02-20T14:45:00",
        status: "ativo",
    },
    {
        id: 3,
        cpf: "34567890123",
        nome_completo: "Carlos Santos",
        email: "carlos.santos@saude.gov",
        telefone: "(11) 96543-2109",
        cargo: "admin",
        data_cadastro: "2023-03-10T09:15:00",
        status: "inativo",
    },
    {
        id: 4,
        cpf: "45678901234",
        nome_completo: "Ana Pereira",
        email: "ana.pereira@saude.gov",
        telefone: "(11) 95432-1098",
        cargo: "admin",
        data_cadastro: "2023-04-05T16:20:00",
        status: "ativo",
    },
    {
        id: 5,
        cpf: "56789012345",
        nome_completo: "Roberto Almeida",
        email: "roberto.almeida@saude.gov",
        telefone: "(11) 94321-0987",
        cargo: "admin",
        data_cadastro: "2023-05-12T11:10:00",
        status: "suspenso",
    },
]

const tableContent = {
    items: administradoresSimulados,
}



export function AdminList() {
    const [isLoading, setIsLoading] = useState(false)
    const columns: TableColumn<Administrador>[] = [
        { label: "Nome", key: "nome_completo", sortable: true },
        { label: "CPF", key: "cpf", sortable: false },
        { label: "Email", key: "email", sortable: true },
        { label: "Telefone", key: "telefone", sortable: false },
        { label: "Cargo", key: "cargo", sortable: true, slot: true },
        { label: "Status", key: "status", sortable: true, slot: true },
        { label: "Data de Cadastro", key: "data_cadastro", sortable: true, slot: true },
        { label: "Ações", key: "actions", sortable: false, slot: true, width: "80px" },
    ]
    const renderStatusBadge = (status: string) => {
        switch (status) {
            case "ativo":
                return <Badge className="bg-green-500">Ativo</Badge>
            case "inativo":
                return (
                    <Badge variant="outline" className="text-white bg-red-500">
                        Inativo
                    </Badge>
                )
            case "suspenso":
                return <Badge className="bg-amber-500">Suspenso</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const renderCell = (item: Administrador, column: TableColumn<Administrador>): ReactNode => {
        switch (column.key) {
            case "nome_completo":
                return <span className="font-medium">{item.nome_completo}</span>
            case "cpf":
                return item.cpf
            case "cargo":
                return (
                    <Badge variant={item.cargo === "superadmin" ? "default" : "outline"}>
                        {item.cargo === "superadmin" ? "SuperAdmin" : "Admin"}
                    </Badge>
                )
            case "status":
                return renderStatusBadge(item.status)
            case "data_cadastro":
                return moment(item.data_cadastro).format("DD/MM/YYYY")
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
                            {item.status === "ativo" ? (
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

    const handleSimulateLoading = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Administradores</h1>
                    <p className="text-muted-foreground">Gerencie os administradores do sistema de agendamento.</p>
                </div>
                <Button onClick={() => handleSimulateLoading()} className="w-fit bg-black text-white hover:bg-black/90">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Novo Administrador
                </Button>
            </div>

            <div className="rounded-md border">
                <DynamicTable
                    columns={columns}
                    data={tableContent.items}
                    renderCell={renderCell}
                    emptyMessage="Nenhum administrador encontrado."
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}