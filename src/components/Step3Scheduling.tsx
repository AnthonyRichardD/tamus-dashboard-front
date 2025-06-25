"use client"
import { Calendar, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { mockAvailableTimes } from "@/data/mock-available-times"
import type { AppointmentType, Patient } from "@/types/patient"

interface Step3DateTimeConfirmationProps {
    appointmentType: AppointmentType
    selectedPatient: Patient | null
    selectedDate: string
    selectedTime: string
    observations: string
    onDateChange: (date: string) => void
    onTimeChange: (time: string) => void
    onObservationsChange: (observations: string) => void
}

export default function Step3DateTimeConfirmation({
    appointmentType,
    selectedPatient,
    selectedDate,
    selectedTime,
    observations,
    onDateChange,
    onTimeChange,
    onObservationsChange,
}: Step3DateTimeConfirmationProps) {
  
    const formatDate = (dateString: string) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR")
    }

    return (
        <>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Data e Horário</h2>
                <p className="text-gray-600 text-sm">Defina a data, horário e observações</p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Data</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => onDateChange(e.target.value)}
                                className="pl-10"
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Horário</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <select
                                value={selectedTime}
                                onChange={(e) => onTimeChange(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                disabled={!selectedDate}
                            >
                                <option value="">Selecione um horário</option>
                                {mockAvailableTimes.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {!selectedDate && <p className="text-xs text-gray-500 mt-1">Selecione uma data primeiro</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Observações (Opcional)</label>
                    <Textarea
                        placeholder="Adicione observações sobre o agendamento..."
                        value={observations}
                        onChange={(e) => onObservationsChange(e.target.value)}
                        rows={3}
                        className="resize-none"
                    />
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-base font-medium text-gray-900 mb-4">Resumo do Agendamento</h3>

                    <Card className="bg-gray-50">
                        <CardContent className="p-4">
                            <div className="">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Tipo:</span>
                                        <Badge variant={appointmentType === "consulta" ? "default" : "default"}>
                                            {appointmentType === "consulta" ? "Consulta" : "Exame"}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Paciente:</span>
                                        <span className="text-sm text-gray-900 font-medium">{selectedPatient?.name || ""}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Data:</span>
                                        <span className="text-sm text-gray-900 font-medium">
                                            {selectedDate ? formatDate(selectedDate) : "Não selecionada"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-600">Horário:</span>
                                        <span className="text-sm text-gray-900 font-medium">{selectedTime || "Não selecionado"}</span>
                                    </div>

                                    {observations && (
                                        <div className="col-span-2">
                                            <span className="text-sm font-medium text-gray-600 block mb-1">Observações:</span>
                                            <p className="text-sm text-gray-900 bg-white p-2 rounded border">{observations}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
