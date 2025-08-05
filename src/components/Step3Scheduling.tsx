"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, Clock } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dateTimeConfirmationSchema, type DateTimeConfirmationFormData } from "@/lib/schemas/thirdStepValidations"
import StepNavigation from "./appointment/StepNavigation"
import { Paciente } from "@/types/patient.types"

// Tipos locais
export type AppointmentType = "consulta" | "exame"

export interface Patient {
    id: string
    name: string
    email: string
    phone: string
}

export interface Step3DateTimeConfirmationProps {
    appointmentType: AppointmentType
    selectedPatient: Paciente
    selectedDate: string
    selectedTime: string
    observations: string
    currentStep?: number
    totalSteps?: number
    onDateChange?: (date: string) => void
    onTimeChange?: (time: string) => void
    onObservationsChange?: (observations: string) => void
    onValidationChange?: (isValid: boolean) => void
    onNext?: () => void
    onPrevious?: () => void
    onCancel?: () => void
}

export default function Step3DateTimeConfirmation({
    appointmentType,
    selectedPatient,
    selectedDate = "",
    selectedTime = "",
    observations = "",
    currentStep = 3,
    totalSteps = 3,
    onDateChange,
    onTimeChange,
    onObservationsChange,
    onValidationChange,
    onNext,
    onPrevious,
    onCancel,
}: Step3DateTimeConfirmationProps) {
    const [showTimeField, setShowTimeField] = useState(false)

    // Mock de horários disponíveis (local)
    const mockAvailableTimes = [
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
    ]

    const form = useForm<DateTimeConfirmationFormData>({
        resolver: zodResolver(dateTimeConfirmationSchema),
        defaultValues: {
            selectedDate,
            selectedTime,
            observations,
        },
        mode: "onChange",
    })

    const { watch, formState, setValue, trigger } = form
    const watchedDate = watch("selectedDate")

    // Controla a visibilidade do campo de horário baseado na data selecionada
    useEffect(() => {
        setShowTimeField(!!watchedDate)
        // Limpa o horário selecionado se a data for alterada
        if (!watchedDate && selectedTime) {
            setValue("selectedTime", "")
            if (onTimeChange) {
                onTimeChange("")
            }
        }
    }, [watchedDate, selectedTime, setValue, onTimeChange])

    // Sincroniza com as props do componente pai
    useEffect(() => {
        setValue("selectedDate", selectedDate)
        setValue("selectedTime", selectedTime)
        setValue("observations", observations)
    }, [selectedDate, selectedTime, observations, setValue])

    // Comunica o estado de validação para o componente pai
    useEffect(() => {
        if (onValidationChange) {
            onValidationChange(formState.isValid)
        }
    }, [formState.isValid, onValidationChange])

    const handleDateChange = (value: string) => {
        setValue("selectedDate", value)
        if (onDateChange) {
            onDateChange(value)
        }
        trigger("selectedDate")
    }

    const handleTimeChange = (value: string) => {
        setValue("selectedTime", value)
        if (onTimeChange) {
            onTimeChange(value)
        }
        trigger("selectedTime")
    }

    const handleObservationsChange = (value: string) => {
        setValue("observations", value)
        if (onObservationsChange) {
            onObservationsChange(value)
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR")
    }

    const today = new Date().toISOString().split("T")[0]


    const handleNext = () => {
        if (formState.isValid && onNext) {
            onNext()
        }
    }

    const handlePrevious = () => {
        if (onPrevious) {
            onPrevious()
        }
    }

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        }
    }

    console.log(selectedPatient)

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Data e Horário</h2>
                <p className="text-sm text-muted-foreground">Defina a data, horário e observações</p>
            </div>

            <Form {...form}>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Campo de Data */}
                        <FormField
                            control={form.control}
                            name="selectedDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                        Data <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                type="date"
                                                value={field.value || ""}
                                                onChange={(e) => handleDateChange(e.target.value)}
                                                className="pl-10"
                                                min={today}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Campo de Horário - Só aparece após selecionar data */}
                        {showTimeField && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <FormField
                                    control={form.control}
                                    name="selectedTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Horário <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <Select value={field.value || ""} onValueChange={handleTimeChange}>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                                                        <SelectTrigger className="pl-10">
                                                            <SelectValue placeholder="Selecione um horário" />
                                                        </SelectTrigger>
                                                    </div>
                                                </FormControl>
                                                <SelectContent>
                                                    {mockAvailableTimes.map((time) => (
                                                        <SelectItem key={time} value={time}>
                                                            {time}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* Placeholder quando horário não está visível */}
                        {!showTimeField && (
                            <div className="space-y-2">
                                <FormLabel className="text-sm font-medium text-muted-foreground">
                                    Horário <span className="text-destructive">*</span>
                                </FormLabel>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <div className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-muted text-muted-foreground text-sm">
                                        Selecione uma data primeiro
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Campo de Observações */}
                    <FormField
                        control={form.control}
                        name="observations"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">Observações (Opcional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Adicione observações sobre o agendamento..."
                                        value={field.value || ""}
                                        onChange={(e) => handleObservationsChange(e.target.value)}
                                        rows={3}
                                        className="resize-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>

            {/* Resumo do Agendamento */}
            <div className="border-t pt-6">
                <h3 className="text-base font-medium text-foreground mb-4">Resumo do Agendamento</h3>
                <Card className="bg-muted/50">
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Tipo:</span>
                                <Badge variant={appointmentType === "consulta" ? "default" : "secondary"}>
                                    {appointmentType === "consulta" ? "Consulta" : "Exame"}
                                </Badge>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Paciente:</span>
                                <span className="text-sm text-foreground font-medium">
                                    {selectedPatient?.full_name || "Não selecionado"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Data:</span>
                                <span className="text-sm text-foreground font-medium">
                                    {selectedDate ? formatDate(selectedDate) : "Não selecionada"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Horário:</span>
                                <span className="text-sm text-foreground font-medium">
                                    {selectedTime || "Não selecionado"}
                                </span>
                            </div>

                            {observations && (
                                <div className="space-y-1">
                                    <span className="text-sm font-medium text-muted-foreground block">Observações:</span>
                                    <p className="text-sm text-foreground bg-background p-2 rounded border">
                                        {observations}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Indicador de campos obrigatórios */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="text-destructive">*</span>
                <span>Campos obrigatórios</span>
            </div>
            <StepNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                isValid={formState.isValid}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onCancel={handleCancel}
            />
        </div>
    )
}
