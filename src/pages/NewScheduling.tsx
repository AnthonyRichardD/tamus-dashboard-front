import { useState, useMemo, useCallback, useEffect, ReactNode } from "react"
import { ArrowLeft, User, FileText, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { AppointmentType } from "@/types/patient"
import { Save } from "lucide-react"
import Step2Scheduling from "@/components/Step2Scheduling"
import Step3DateTimeConfirmation from "@/components/Step3Scheduling"
import { DynamicTable, TableColumn } from "@/components/ui/dynamic-table"
import patientService from "@/services/patient.service"
import { useAlertStore } from "@/store/DialogAlert"
import { differenceInYears, parseISO, format } from "date-fns";
import { formatCPF } from "@/utils/formatUtils"
import { Paciente } from "@/types/patient.types"


export default function AppointmentScheduling() {
    const navigate = useNavigate();
    const { showAlert } = useAlertStore();
    const [isLoading, setIsLoading] = useState(true);

    const [patients, setPatients] = useState<Paciente[]>([]);
    const [appointmentType, setAppointmentType] = useState<AppointmentType>(null)
    const [selectedPatient, setSelectedPatient] = useState<Paciente>()
    const [searchTerm, setSearchTerm] = useState("")
    const [currentStep, setCurrentStep] = useState(1)

    // BEGIN: PatientList Logic
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

    const calculateAge = (birthDate: string): number => {
        try {
            return differenceInYears(new Date(), parseISO(birthDate));
        } catch (error) {
            console.error("Data de nascimento inválida:", birthDate, error);
            return 0;
        }
    };

    const renderStatusBadge = (isActive: boolean): ReactNode => {
        if (isActive) {
            return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>;
        }
        return <Badge className="text-white bg-red-500 hover:bg-red-600">Inativo</Badge>;
    };

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
                    <Button variant="default" onClick={() => setSelectedPatient(item)}>
                        Selecionar
                    </Button>
                );
            default:
                return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
        }
    }, []);

    const [pagination, setPagination] = useState({
        page: 1,
        limit_per_page: 10,
        total: 0,
    });

    const fetchPatients = useCallback(async (page: number = pagination.page, filters?: { [key: string]: string | number }) => {
        setIsLoading(true);
        try {
            const response = await patientService.list(page, pagination.limit_per_page, filters);

            if (!response.is_error) {
                const paginatedResponse = response as { data: Paciente[], pagination: { total: number } };
                setPatients(paginatedResponse.data);
                setPagination(prev => ({
                    ...prev,
                    total: paginatedResponse.pagination.total,
                    page: page,
                }));
            } else {
                showAlert("Erro na Listagem", "error", response.message || "Falha ao carregar pacientes.");
            }
        } catch (err: any) {
            const errorMessage = err.message || "Erro inesperado ao carregar pacientes.";
            showAlert("Erro na Listagem", "error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [showAlert, pagination.page, pagination.limit_per_page]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const handlePageChange = (newPage: number) => {
        fetchPatients(newPage);
    };
    // END: PatientList Logic


    const handleBackToDashboard = () => {
        navigate("/dashboard");
    }

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
            return
        }

        if (currentStep === 3) {
            alert("Agendamento confirmado com sucesso!")
        }


        // if (currentStep === 1 && canProceed) {
        //     setCurrentStep(2)
        // } else if (currentStep === 2) {
        //     const step2Complete =
        //         appointmentType === "consulta" ? selectedProfessional && selectedConsultationType : selectedExamType

        //     if (step2Complete) {
        //         setCurrentStep(3)
        //     }
        // } else if (currentStep === 3) {
        //     alert("Agendamento confirmado com sucesso!")
        // }
    }


    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleCancel = () => {
        navigate('/dashboard');
    }

    const handleSearch = (value: string) => {
        const filters = { cpf: value }
        fetchPatients(1, filters)
    }

    const [selectedConsultationType, setSelectedConsultationType] = useState<{
        id: number,
        name: string,
        duration_minutes: number,
        active: boolean
    }>()
    const handleConsultationTypeChange = (value: {
        id: number,
        name: string,
        duration_minutes: number,
        active: boolean
    }) => {
        setSelectedConsultationType(value)
    }

    const [selectedProfessional, setSelectedProfessional] = useState<string>()
    const handleProfessionalChange = (value: string) => {
        setSelectedProfessional(value)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="w-full px-4">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Novo Agendamento</h1>
                        <p className="text-gray-600">Agende uma nova consulta ou exame para um paciente.</p>
                    </div>
                    <Button variant="ghost" className="text-gray-600 cursor-pointer" onClick={handleBackToDashboard}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar ao Dashboard
                    </Button>
                </div>

                <div className="mb-8 flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-medium ${currentStep >= 1 ? "bg-teal-600" : "bg-gray-300 text-gray-600"
                                    }`}
                            >
                                1
                            </div>
                        </div>
                        <div className={`h-px w-16 ${currentStep >= 2 ? "bg-teal-600" : "bg-gray-300"}`}></div>
                        <div className="flex items-center">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${currentStep >= 2 ? "bg-teal-600 text-white" : "bg-gray-300 text-gray-600"
                                    }`}
                            >
                                2
                            </div>
                        </div>
                        <div className={`h-px w-16 ${currentStep >= 3 ? "bg-teal-600" : "bg-gray-300"}`}></div>
                        <div className="flex items-center">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${currentStep >= 3 ? "bg-teal-600 text-white" : "bg-gray-300 text-gray-600"
                                    }`}
                            >
                                3
                            </div>
                        </div>
                    </div>
                </div>

                <Card className="mb-6">
                    <CardContent className="">
                        {currentStep === 1 && (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Informações Básicas</h2>
                                    <p className="text-gray-600 text-sm">Selecione o tipo de agendamento e o paciente</p>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-base font-medium text-gray-900 mb-4">Tipo de Agendamento</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card
                                            className={`cursor-pointer transition-all ${appointmentType === "consulta"
                                                ? "border-teal-500 bg-teal-50"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            onClick={() => setAppointmentType("consulta")}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <User
                                                        className={`h-5 w-5 ${appointmentType === "consulta" ? "text-teal-600" : "text-gray-400"}`}
                                                    />
                                                    <div>
                                                        <h4
                                                            className={`font-medium ${appointmentType === "consulta" ? "text-teal-900" : "text-gray-900"}`}
                                                        >
                                                            Consulta Médica
                                                        </h4>
                                                        <p className={`text-sm ${appointmentType === "consulta" ? "text-teal-700" : "text-gray-600"}`}>
                                                            Agendamento com profissional de saúde
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card
                                            className={`cursor-pointer transition-all ${appointmentType === "exame"
                                                ? "border-purple-500 bg-purple-50"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            onClick={() => setAppointmentType("exame")}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <FileText
                                                        className={`h-5 w-5 ${appointmentType === "exame" ? "text-purple-600" : "text-gray-400"}`}
                                                    />
                                                    <div>
                                                        <h4
                                                            className={`font-medium ${appointmentType === "exame" ? "text-purple-900" : "text-gray-900"}`}
                                                        >
                                                            Exame
                                                        </h4>
                                                        <p className={`text-sm ${appointmentType === "exame" ? "text-purple-700" : "text-gray-600"}`}>
                                                            Agendamento de exame laboratorial ou imagem
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                <div>
                                    {!selectedPatient && (
                                        <div>
                                            <h3 className="text-base font-medium text-gray-900 mb-4">Selecionar Paciente</h3>

                                            <div className="flex w-full items-center justify-center gap-2 mb-4">
                                                <div className="relative w-full">
                                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                    <Input
                                                        placeholder="CPF"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-10"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-[120px] h-[40px]"
                                                    onClick={() => handleSearch(searchTerm)}
                                                >
                                                    Buscar
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {selectedPatient && (
                                        <Card className="mb-4 border-teal-200 bg-teal-50">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
                                                            <Check className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-teal-900">{selectedPatient.full_name}</h4>
                                                            <p className="text-sm text-teal-700">
                                                                {formatCPF(selectedPatient.cpf)} • {calculateAge(selectedPatient.birth_date)} anos
                                                                <br />{selectedPatient.email}
                                                            </p>
                                                            {selectedPatient.health_conditions && (
                                                                <div className="mt-1 text-teal-700">
                                                                    <span className="text-xs font-semibold">Condições: </span> <span className="text-xs">{selectedPatient.health_conditions} </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
                                                        Alterar
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {!selectedPatient && (
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
                                    )}
                                </div>
                            </>
                        )}

                        {currentStep === 2 && (
                            <Step2Scheduling
                                appointmentType={appointmentType}
                                onNext={handleNext}
                                onPrevious={handlePrevious}
                                onCancel={handleCancel}
                                currentStep={currentStep}
                                onConsultationTypeChange={handleConsultationTypeChange}
                                onProfessionalChange={handleProfessionalChange}
                            />
                        )}

                        {currentStep === 3 && (
                            <Step3DateTimeConfirmation
                                appointmentType={appointmentType}
                                selectedPatient={selectedPatient}
                                onNext={handleNext}
                                onPrevious={handlePrevious}
                                onCancel={handleCancel}
                                currentStep={currentStep}
                            />
                        )}

                    </CardContent>
                    {currentStep == 1 && (

                        <div className="flex justify-end px-6">
                            <div className="flex space-x-3">
                                <Button className="cursor-pointer" variant="outline">Cancelar</Button>
                                <Button
                                    variant="primary"
                                    onClick={handleNext}
                                >
                                    Próximo
                                </Button>
                            </div>
                        </div>
                    )}

                </Card>

            </div>
        </div>
    )
}