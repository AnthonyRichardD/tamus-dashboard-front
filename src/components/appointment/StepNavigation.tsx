import { Save } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface StepNavigationProps {
    currentStep: number
    totalSteps: number
    isValid: boolean
    isLoading?: boolean
    onPrevious: () => void
    onNext: () => void
    onCancel: () => void
}

export default function StepNavigation({
    currentStep,
    totalSteps,
    isValid,
    isLoading = false,
    onPrevious,
    onNext,
    onCancel,
}: StepNavigationProps) {
    const isLastStep = currentStep === totalSteps

    return (
        <div className="flex w-full justify-between bg-background">
            <div>
                {currentStep > 1 && (
                    <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={onPrevious}
                        disabled={isLoading}
                    >
                        Anterior
                    </Button>
                )}
            </div>

            <div className="flex space-x-3">
                <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>

                <Button
                    variant="secondary"
                    className="cursor-pointer w-fit"
                    onClick={onNext}
                    disabled={!isValid || isLoading}
                >
                    {isLastStep ? (
                        <>
                            <Save className="w-4 h-4 mr-1" />
                            Confirmar Agendamento
                        </>
                    ) : (
                        "Próximo"
                    )}
                </Button>
            </div>
        </div>
    )
}
