import { useState, useMemo } from "react"
import { ArrowLeft, User, FileText, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockPatients } from "@/data/mock-patients"
import { useNavigate } from "react-router-dom"
import { AppointmentType, Patient } from "@/types/patient"
import { Save } from "lucide-react"
import Step2Scheduling from "@/components/Step2Scheduling"
import Step3DateTimeConfirmation from "@/components/Step3Scheduling"


export default function AppointmentScheduling() {
    const navigate = useNavigate();
    const [appointmentType, setAppointmentType] = useState<AppointmentType>(null)
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedProfessional, setSelectedProfessional] = useState("")
    const [selectedConsultationType, setSelectedConsultationType] = useState("")
    const [selectedExamType, setSelectedExamType] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")
    const [observations, setObservations] = useState("")

    const filteredPatients = useMemo(() => {
        if (!searchTerm) return mockPatients

        const term = searchTerm.toLowerCase()
        return mockPatients.filter(
            (patient) =>
                patient.name.toLowerCase().includes(term) ||
                patient.cpf.includes(term) ||
                patient.email.toLowerCase().includes(term) ||
                patient.phone.includes(term),
        )
    }, [searchTerm])

    const canProceed =
        currentStep === 1
            ? appointmentType && selectedPatient
            : currentStep === 2
                ? appointmentType === "consulta"
                    ? selectedProfessional && selectedConsultationType
                    : selectedExamType
                : selectedDate && selectedTime

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient)
    }

    const handleBackToDashboard = () => {
        navigate("/dashboard");
    }

    const handleNext = () => {
        if (currentStep === 1 && canProceed) {
            setCurrentStep(2)
        } else if (currentStep === 2) {
            const step2Complete =
                appointmentType === "consulta" ? selectedProfessional && selectedConsultationType : selectedExamType

            if (step2Complete) {
                setCurrentStep(3)
            }
        } else if (currentStep === 3) {
            console.log("Confirming appointment with:", {
                appointmentType,
                selectedPatient,
                selectedProfessional,
                selectedConsultationType,
                selectedExamType,
                selectedDate,
                selectedTime,
                observations,
            })
            alert("Agendamento confirmado com sucesso!")
        }
    }


    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-8xl px-4">
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
                    <CardContent className="p-6">
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
                                    <h3 className="text-base font-medium text-gray-900 mb-4">Selecionar Paciente</h3>

                                    <div className="relative mb-4">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            placeholder="Buscar por nome, CPF, email ou telefone..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>

                                    {selectedPatient && (
                                        <Card className="mb-4 border-teal-200 bg-teal-50">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
                                                            <Check className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-teal-900">{selectedPatient.name}</h4>
                                                            <p className="text-sm text-teal-700">
                                                                {selectedPatient.cpf} • {selectedPatient.age} anos
                                                                <br />{selectedPatient.email}
                                                            </p>
                                                            {selectedPatient.hasConditions && (
                                                                <div className="mt-1">
                                                                    <span className="text-xs text-teal-600">Condições: </span>
                                                                    {selectedPatient.conditions.map((condition, index) => (
                                                                        <Badge key={index} variant="secondary" className="mr-1 text-xs">
                                                                            {condition}
                                                                        </Badge>
                                                                    ))}
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
                                        <div className="rounded-lg border">
                                            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                                                <table className="w-full">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Nome
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                CPF
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Idade
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Telefone
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Condições
                                                            </th>
                                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Ação
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {filteredPatients.map((patient) => (
                                                            <tr key={patient.id} className="hover:bg-gray-50">
                                                                <td className="px-4 py-4">
                                                                    <div>
                                                                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                                                        <div className="text-sm text-gray-500">{patient.email}</div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-4 text-sm text-gray-900">{patient.cpf}</td>
                                                                <td className="px-4 py-4 text-sm text-gray-900">{patient.age} anos</td>
                                                                <td className="px-4 py-4 text-sm text-gray-900">{patient.phone}</td>
                                                                <td className="px-4 py-4">
                                                                    {patient.hasConditions ? (
                                                                        <span className="text-sm text-green-600">Sim</span>
                                                                    ) : (
                                                                        <span className="text-sm text-gray-500">-</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-0 py-4">
                                                                    <Button className="cursor-pointer" variant="outline" onClick={() => handlePatientSelect(patient)}>
                                                                        Selecionar
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {filteredPatients.length === 0 && (
                                                <div className="text-center py-8 text-gray-500">Nenhum paciente encontrado</div>
                                            )}

                                            <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700">
                                                {filteredPatients.length} paciente(s) encontrado(s)
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {currentStep === 2 && (
                            <Step2Scheduling
                                appointmentType={appointmentType}
                                selectedProfessional={selectedProfessional}
                                selectedConsultationType={selectedConsultationType}
                                selectedExamType={selectedExamType}
                                onProfessionalChange={setSelectedProfessional}
                                onConsultationTypeChange={setSelectedConsultationType}
                                onExamTypeChange={setSelectedExamType}
                            />
                        )}

                        {currentStep === 3 && (
                            <Step3DateTimeConfirmation
                                appointmentType={appointmentType}
                                selectedPatient={selectedPatient}
                                selectedDate={selectedDate}
                                selectedTime={selectedTime}
                                observations={observations}
                                onDateChange={setSelectedDate}
                                onTimeChange={setSelectedTime}
                                onObservationsChange={setObservations}
                            />
                        )}

                    </CardContent>
                    <div className="flex justify-between px-6">
                        <div>
                            {currentStep > 1 && (
                                <Button className="cursor-pointer" variant="outline" onClick={handlePrevious}>
                                    Anterior
                                </Button>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <Button className="cursor-pointer" variant="outline">Cancelar</Button>
                            <Button
                                variant="primary"
                                onClick={handleNext}
                                disabled={!canProceed}
                                className={canProceed ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}
                            >
                                {currentStep === 3 ? (
                                    <>
                                        <Save/>
                                        Confirmar Agendamento
                                    </>
                                ) : (
                                    "Próximo"
                                )}
                            </Button>
                        </div>
                    </div>

                </Card>

            </div>
        </div>
    )
}