import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Consultation } from "@/types/consultation"
import { formatDate, formatTimeRange } from "@/utils/dateUtils"
import { User, Calendar, Clock, FileText } from "lucide-react"

const statusConfig = {
    completed: {
        label: "Concluído",
        color: "bg-green-100 text-green-800 hover:bg-green-100",
        borderColor: "border-l-blue-500",
    },
    scheduled: {
        label: "Agendado",
        color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        borderColor: "border-l-red-500",
    },
    canceled: {
        label: "Cancelado",
        color: "bg-red-100 text-red-800 hover:bg-red-100",
        borderColor: "border-l-gray-500",
    },
    no_show: {
        label: "Faltou",
        color: "bg-orange-100 text-orange-800 hover:bg-orange-100",
        borderColor: "border-l-red-500",
    },
}

export function ConsultationCard({ consultation, onViewDetails }: {
    consultation: Consultation
    onViewDetails: (consultationId: number) => void
}) {
    const config = statusConfig[consultation.status]

    let borderColor = config.borderColor
    if (consultation.status === "scheduled") {
        
        if (consultation.professional.color_code === "#e74c3c") {
            borderColor = "border-l-red-500"
        } else if (consultation.professional.color_code === "#2ecc71") {
            borderColor = "border-l-green-500"
        } else {
            borderColor = "border-l-blue-500"
        }
    }

    return (
        <Card className={`border-l-4 ${borderColor}`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900">{consultation.patient.full_name} #{consultation.patient_id}</h3>
                            <Badge className={config.color}>{config.label}</Badge>
                        </div>

                        <p className="mb-4 text-sm text-gray-600">
                            {consultation.consultation_type.name} • {consultation.consultation_type.duration_minutes} minutos
                        </p>

                        <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <User className="h-4 w-4" />
                                {consultation.professional.name}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                {formatDate(consultation.slot.start_time)}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="h-4 w-4" />
                                {formatTimeRange(consultation.slot.start_time, consultation.slot.end_time)}
                            </div>
                        </div>

                        {consultation.status === "completed" && consultation.notes && (
                            <div className="rounded-lg bg-gray-50 p-3">
                                <div className="flex items-start gap-2">
                                    <FileText className="h-4 w-4 mt-0.5 text-gray-600" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 mb-1">Observações:</div>
                                        <div className="text-sm text-gray-700">{consultation.notes}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {consultation.status === "canceled" && consultation.cancellation_reason && (
                            <div className="rounded-lg bg-red-50 p-3">
                                <div className="flex items-start gap-2">
                                    <FileText className="h-4 w-4 mt-0.5 text-red-600" />
                                    <div>
                                        <div className="text-sm font-medium text-red-900 mb-1">Motivo do Cancelamento:</div>
                                        <div className="text-sm text-red-700">{consultation.cancellation_reason}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => onViewDetails(consultation.id)}>
                        Ver Detalhes
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}