import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { serviceSelectionSchema, type ServiceSelectionFormData } from "@/lib/schemas/secondStepValidations"
import StepNavigation from "./appointment/StepNavigation"
import appointmentServices from "@/services/appointment.services"

export type AppointmentType = "consulta" | "exame"

export interface Step2ServiceSelectionProps {
  appointmentType: AppointmentType
  selectedProfessional: string
  selectedConsultationType: string

  currentStep?: number
  totalSteps?: number
  onProfessionalChange?: (professional: string) => void
  onConsultationTypeChange?: (type: string) => void
  onExamTypeChange?: (type: string) => void
  onValidationChange?: (isValid: boolean) => void
  onNext?: () => void
  onPrevious?: () => void
  onCancel?: () => void
}

export default function Step2ServiceSelection({
  appointmentType,
  selectedProfessional = "",
  selectedConsultationType = "",
  currentStep = 2,
  totalSteps = 3,
  onProfessionalChange,
  onConsultationTypeChange,
  onValidationChange,
  onNext,
  onPrevious,
  onCancel,
}: Step2ServiceSelectionProps) {
  const form = useForm<ServiceSelectionFormData>({
    resolver: zodResolver(serviceSelectionSchema),
    defaultValues: {
      appointmentType,
      selectedConsultationType,
      selectedProfessional,
    },
    mode: "onChange",
  })

  const { watch, formState, setValue, trigger } = form
  const watchedConsultationType = watch("selectedConsultationType")
  const watchedAppointmentType = watch("appointmentType")

  useEffect(() => {
    setValue("appointmentType", appointmentType)
    setValue("selectedConsultationType", selectedConsultationType)
    setValue("selectedProfessional", selectedProfessional)
  }, [appointmentType, selectedConsultationType, selectedProfessional, setValue])

  useEffect(() => {
    if (appointmentType === "consulta" && !watchedConsultationType && selectedProfessional) {
      setValue("selectedProfessional", "")
      if (onProfessionalChange) {
        onProfessionalChange("")
      }
    }
  }, [watchedConsultationType, appointmentType, selectedProfessional, setValue, onProfessionalChange])

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(formState.isValid)
    }
  }, [formState.isValid, onValidationChange])

  useEffect(() => {
    trigger()
  }, [watchedAppointmentType, trigger])

  const handleConsultationTypeChange = async (value: string) => {
    setValue("selectedConsultationType", value)

    if (onConsultationTypeChange) {
      onConsultationTypeChange(value)
    }
    trigger("selectedConsultationType")
  }

  const handleProfessionalChange = (value: string) => {
    setValue("selectedProfessional", value)

    if (onProfessionalChange) {
      onProfessionalChange(value)
    }
    trigger("selectedProfessional")
  }

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

  const [consultationTypes, setConsultationTypes] = useState<{
    id: string,
    name: string,
    duration_minutes: number,
    active: boolean
  }[]>([])
  const getConsultationTypes = async () => {
    try {
      const response = await appointmentServices.listConsultationTypes()
      if (!response.is_error) {
        setConsultationTypes(response)
      }
    }
    catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getConsultationTypes()
  }, [])


  const [professionals, setProfessionals] = useState<{ id: string, name: string, specialty: string }[]>([])
  const listProfessionals = async (consultationTypeId: number) => {
    try {
      const response = await appointmentServices.getProffessionalsByConsultationType(consultationTypeId)
      if (!response.is_error) {
        setProfessionals(response)
      }
    }
    catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (watchedConsultationType) {
      listProfessionals(parseInt(watchedConsultationType))
    }
  }, [watchedConsultationType])

  const showProfessionalField = appointmentType === "consulta" && watchedConsultationType

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-foreground">Seleção de Profissional/Serviço</h2>
        <p className="text-sm text-muted-foreground">Escolha o profissional ou tipo de exame</p>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {appointmentType === "consulta" && (
            <>
              {
                consultationTypes.length > 0 && (
                  <FormField
                    control={form.control}
                    name="selectedConsultationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Tipo de Consulta <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select value={field.value || ""} onValueChange={handleConsultationTypeChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione o tipo de consulta" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {consultationTypes.map((type) => (
                              <SelectItem key={type.id} value={String(type.id)}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }

              {showProfessionalField && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <FormField
                    control={form.control}
                    name="selectedProfessional"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Profissional <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select value={field.value || ""} onValueChange={handleProfessionalChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione um profissional" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {professionals.map((professional) => (
                              <SelectItem key={professional.id} value={String(professional.id)}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{professional.name} - <span className="text-xs text-muted-foreground">{professional.specialty}</span></span>

                                </div>
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
            </>
          )}
        </form>
      </Form>

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
