import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { serviceSelectionSchema, type ServiceSelectionFormData } from "@/lib/schemas/secondStepValidations"
import StepNavigation from "./appointment/StepNavigation"

// Definições de tipos
export type AppointmentType = "consulta" | "exame"

export interface Step2ServiceSelectionProps {
  appointmentType: AppointmentType
  selectedProfessional: string
  selectedConsultationType: string
  selectedExamType: string
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
  selectedExamType = "",
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
      selectedExamType,
    },
    mode: "onChange",
  })

  const { watch, formState, setValue, trigger } = form
  const watchedConsultationType = watch("selectedConsultationType")
  const watchedAppointmentType = watch("appointmentType")

  // Sincroniza com as props do componente pai
  useEffect(() => {
    setValue("appointmentType", appointmentType)
    setValue("selectedConsultationType", selectedConsultationType)
    setValue("selectedProfessional", selectedProfessional)
    setValue("selectedExamType", selectedExamType)
  }, [appointmentType, selectedConsultationType, selectedProfessional, selectedExamType, setValue])

  // Limpa o profissional quando o tipo de consulta muda
  useEffect(() => {
    if (appointmentType === "consulta" && !watchedConsultationType && selectedProfessional) {
      setValue("selectedProfessional", "")
      if (onProfessionalChange) {
        onProfessionalChange("")
      }
    }
  }, [watchedConsultationType, appointmentType, selectedProfessional, setValue, onProfessionalChange])

  // Comunica o estado de validação para o componente pai
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(formState.isValid)
    }
  }, [formState.isValid, onValidationChange])

  // Revalida quando o tipo de agendamento muda
  useEffect(() => {
    trigger()
  }, [watchedAppointmentType, trigger])

  const handleConsultationTypeChange = (value: string) => {
    setValue("selectedConsultationType", value)
    if (onConsultationTypeChange) {
      onConsultationTypeChange(value)
    }
    trigger("selectedConsultationType")
  }

  const handleProfessionalChange = (value: string) => {
    setValue("selectedProfessional", value)
    console.log(value)
    if (onProfessionalChange) {
      onProfessionalChange(value)
    }
    trigger("selectedProfessional")
  }

  // const handleExamTypeChange = (value: string) => {
  //   setValue("selectedExamType", value)
  //   if (onExamTypeChange) {
  //     onExamTypeChange(value)
  //   }
  //   trigger("selectedExamType")
  // }

  // Handlers para navegação
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

  const showProfessionalField = appointmentType === "consulta" && watchedConsultationType

  const mockConsultationTypes = [
    {
      id: "1",
      name: "Consulta de Rotina",
    },
    {
      id: "2",
      name: "Consulta de Urgência",
    },
    {
      id: "3",
      name: "Consulta de Retorno",
    },
    {
      id: "4",
      name: "Primeira Consulta",
    },
    {
      id: "5",
      name: "Consulta de Acompanhamento",
    },
    {
      id: "6",
      name: "Consulta Especializada",
    },
  ]


  const mockProfessionals = [
    {
      id: "1",
      name: "Dr. Ana Silva",
      specialty: "Cardiologia",
    },
    {
      id: "2",
      name: "Dr. Carlos Santos",
      specialty: "Dermatologia",
    },
    {
      id: "3",
      name: "Dra. Maria Oliveira",
      specialty: "Pediatria",
    },
    {
      id: "4",
      name: "Dr. João Pereira",
      specialty: "Ortopedia",
    },
    {
      id: "5",
      name: "Dra. Lucia Costa",
      specialty: "Ginecologia",
    },
    {
      id: "6",
      name: "Dr. Roberto Lima",
      specialty: "Neurologia",
    },
  ]

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
                        {mockConsultationTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                            {mockProfessionals.map((professional) => (
                              <SelectItem key={professional.id} value={professional.id}>
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

          {/* {appointmentType === "exame" && (
            <FormField
              control={form.control}
              name="selectedExamType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Tipo de Exame <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select value={field.value || ""} onValueChange={handleExamTypeChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo de exame" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockExamTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}
        </form>
      </Form>

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
