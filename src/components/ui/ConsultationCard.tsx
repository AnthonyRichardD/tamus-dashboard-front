import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, formatTimeRange } from "@/utils/dateUtils"
import { User, Calendar, Clock, FileText } from "lucide-react"
import { Consultation, ConsultationStatus } from "@/types/consultation.types"

export function ConsultationCard({ consultation, onViewDetails }: {
    consultation: Consultation
    onViewDetails: (consultationId: number) => void
}) {

    const getCardBorder = (status: string) => {
        switch (status) {
            case 'completed':
                return '#28A745';
            case 'scheduled':
                return '#007BFF';
            case 'canceled':
                return '#e85445';
            case 'no_show':
                return '#f59e0b';
            default:
                return '';
        }
    };

    const getBadgeVariant = (status: ConsultationStatus) => {
        switch (status) {
            case 'completed':
                return 'bg-[#28A745] text-white';
            case 'scheduled':
                return 'bg-[#007BFF] text-white';
            case 'canceled':
                return 'bg-red-500 text-white';
            case 'no_show':
                return 'bg-[#f59e0b] text-white';
            default:
                return '';
        }
    };

    const getTranlatedStatus = (status: ConsultationStatus) => {
        switch (status) {
            case 'scheduled':
                return 'Agendado';
            case 'completed':
                return 'Concluído';
            case 'canceled':
                return 'Cancelado';
            default:
                return '';
        }
    };

    return (
        <Card className={`relative shadow-ultra-subtle mb-3 rounded-lg bg-white gap-0`}
            style={{
                border: '1px solid #E5E7EB',
                padding: '16px',
                borderLeft: `4px solid ${getCardBorder(consultation.status)}`,
            }}>
            <CardContent className="p-0">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div className="mb-2 flex items-center gap-3">
                                <h3 className="font-semibold text-gray-900">{consultation.patient.full_name}</h3>
                                <Badge className={`${getBadgeVariant(consultation.status)} text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>{getTranlatedStatus(consultation.status)}</Badge>
                            </div>
                            <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => onViewDetails(consultation.id)}>
                                Ver Detalhes
                            </Button>

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

                        {consultation && (
                            <div className="rounded-lg bg-gray-50 p-2">
                                <div className="flex items-start gap-2">
                                    <FileText width={16} className="text-gray-600" />
                                    <div className="space-x-1">
                                        <span className="text-sm font-semibold text-gray-900 mb-1">Observações:</span>
                                        <span className="text-sm text-gray-700">{consultation.notes ?? 'Observações em andamento para teste de exibição'}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {consultation.status === "canceled" && consultation.cancellation_reason && (
                            <div className="rounded-lg bg-red-50 p-2">
                                <div className="flex items-start gap-2">
                                    <FileText width={16} className="text-red-600" />
                                    <div className="space-x-1">
                                        <span className="text-sm font-medium text-red-900 mb-1">Motivo do Cancelamento:</span>
                                        <span className="text-sm text-red-700">{consultation.cancellation_reason}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}