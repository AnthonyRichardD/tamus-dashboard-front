"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import moment from "moment"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dateTimeConfirmationSchema, type DateTimeConfirmationFormData } from "@/lib/schemas/thirdStepValidations"
import StepNavigation from "./appointment/StepNavigation"
import { Paciente } from "@/types/patient.types"
import appointmentServices from "@/services/appointment.services"

export type AppointmentType = "consulta" | "exame"

interface TimeSlot {
    slot_id: number;
    start_time: string;
    end_time: string;
}

export interface Step3DateTimeConfirmationProps {
    appointmentType: AppointmentType
    selectedPatient: Paciente
    selectedDate: string
    selectedTime: string
    observations: string
    currentStep?: number
    totalSteps?: number
    professionalId: number
    onSlotChange?: (time: string) => void
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
    professionalId,
    currentStep = 3,
    totalSteps = 3,
    onSlotChange,
    onObservationsChange,
    onValidationChange,
    onNext,
    onPrevious,
    onCancel,
}: Step3DateTimeConfirmationProps) {
    const [showTimeField, setShowTimeField] = useState(false)
    const [availableDates, setAvailableDates] = useState<string[]>([])
    const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([])
    const [isLoadingTimes, setIsLoadingTimes] = useState(false)

    const form = useForm<DateTimeConfirmationFormData>({
        resolver: zodResolver(dateTimeConfirmationSchema),
        defaultValues: { selectedDate, selectedTime, observations },
        mode: "onChange",
    })

    const { watch, formState, setValue } = form
    const watchedDate = watch("selectedDate")
    const watchedTimeId = watch("selectedTime")

    useEffect(() => {
        const getProfessionalDays = async () => {
            if (!professionalId) return;
            try {
                const response = await appointmentServices.getProfessionalsAvaliableDays(professionalId)
                if (response && !response.is_error) {
                    setAvailableDates(response)
                }
            } catch (error) {
                console.error("Erro ao buscar dias disponíveis:", error)
            }
        }
        getProfessionalDays()
    }, [professionalId])

    useEffect(() => {
        const fetchTimes = async () => {
            if (!watchedDate) {
                setShowTimeField(false);
                setAvailableTimes([]);
                return;
            }

            setShowTimeField(true);
            setIsLoadingTimes(true);
            setAvailableTimes([]);

            try {
                const response = await appointmentServices.getProfessionalAvailableTime(professionalId, watchedDate);
                if (response && !response.is_error) {
                    setAvailableTimes(response);
                }
            } catch (error) {
                console.error("Erro ao buscar horários disponíveis:", error);
                setAvailableTimes([]);
            } finally {
                setIsLoadingTimes(false);
            }
        };

        fetchTimes();
    }, [watchedDate, professionalId, setValue, onSlotChange]);


    useEffect(() => {
        setValue("selectedDate", selectedDate)
        setValue("selectedTime", selectedTime)
        setValue("observations", observations)
    }, [selectedDate, selectedTime, observations, setValue])

    useEffect(() => {
        onValidationChange?.(formState.isValid)
    }, [formState.isValid, onValidationChange])


    const availableDatesSet = new Set(availableDates);
    const isDateDisabled = (date: Date) => {
        if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
            return true;
        }
        const formattedDate = format(date, "yyyy-MM-dd");
        return !availableDatesSet.has(formattedDate);
    };

    const handleTimeChange = (value: string) => {
        setValue("selectedTime", value, { shouldValidate: true })
        onSlotChange?.(value)
    }

    const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log('observações No step 3:', e.target.value)
        setValue("observations", e.target.value)
        onObservationsChange?.(e.target.value)
    }

    const handleNext = () => formState.isValid && onNext?.()
    const handlePrevious = () => onPrevious?.()
    const handleCancel = () => onCancel?.()

    let displayTime = "Não selecionado";
    if (watchedTimeId && availableTimes.length > 0) {
        const selectedSlot = availableTimes.find(slot => String(slot.slot_id) === watchedTimeId);
        if (selectedSlot) {
            displayTime = moment(selectedSlot.start_time).format("HH:mm");
        }
    }

    return (
        <div className="space-y-4">

            <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-foreground">Data e Horário</h2>
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
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-sm font-medium">Data <span className="text-destructive">*</span></FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value ? (format(new Date(field.value), "PPP", { locale: ptBR })) : (<span>Escolha uma data</span>)}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                locale={ptBR}
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => { if (date) { field.onChange(format(date, "yyyy-MM-dd")); } }}
                                                disabled={isDateDisabled}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* --- CAMPO DE HORÁRIO MODIFICADO --- */}
                        {showTimeField ? (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <FormField
                                    control={form.control}
                                    name="selectedTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Horário <span className="text-destructive">*</span></FormLabel>
                                            <Select
                                                value={field.value || ""}
                                                onValueChange={handleTimeChange}
                                                disabled={isLoadingTimes}
                                            >
                                                <FormControl>
                                                    <div className="relative">
                                                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                                                        <SelectTrigger className="pl-10">
                                                            <SelectValue placeholder={isLoadingTimes ? "Carregando..." : "Selecione um horário"} />
                                                        </SelectTrigger>
                                                    </div>
                                                </FormControl>
                                                <SelectContent>
                                                    {!isLoadingTimes && availableTimes.length === 0 && (
                                                        <p className="p-4 text-sm text-muted-foreground">Nenhum horário disponível.</p>
                                                    )}
                                                    {availableTimes.map((time) => {
                                                        const formattedTime = moment(time.start_time).format("HH:mm");
                                                        return (
                                                            <SelectItem key={time.slot_id} value={String(time.slot_id)}>
                                                                {formattedTime}
                                                            </SelectItem>
                                                        )
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <FormLabel className="text-sm font-medium text-muted-foreground">Horário <span className="text-destructive">*</span></FormLabel>
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
                                        {...field}
                                        onChange={handleObservationsChange}
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
                                <span className="text-sm text-foreground font-medium">{selectedPatient?.full_name || "Não selecionado"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Data:</span>
                                <span className="text-sm text-foreground font-medium">
                                    {watchedDate ? format(new Date(watchedDate), "P", { locale: ptBR }) : "Não selecionada"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-muted-foreground">Horário:</span>
                                {/* --- CORREÇÃO FINAL: USA A VARIÁVEL DE EXIBIÇÃO --- */}
                                <span className="text-sm text-foreground font-medium">{displayTime}</span>
                            </div>
                            {watch("observations") && (
                                <div className="space-y-1">
                                    <span className="text-sm font-medium text-muted-foreground block">Observações:</span>
                                    <p className="text-sm text-foreground bg-background p-2 rounded border">{watch("observations")}</p>
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