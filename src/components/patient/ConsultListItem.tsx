import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { CalendarDays, Clock, ClipboardList } from 'lucide-react';
import { Consultation, ConsultationStatus } from '../../types/patient';

interface ConsultListItemProps {
    consultation: Consultation;
}

const getConsultaBorderColor = (tipoConsulta: string) => {
    if (tipoConsulta.includes("Retorno")) return "#4A90E2";
    if (tipoConsulta.includes("Inicial")) return "#D0021B";
    return "gray-300";
};

const getBadgeVariant = (status: ConsultationStatus) => {
    switch (status) {
        case 'Concluído':
            return 'bg-[#28A745] text-white';
        case 'Agendado':
            return 'bg-[#007BFF] text-white';
        case 'Cancelado':
            return 'bg-red-500 text-white';
        default:
            return '';
    }
};

export const ConsultListItem: React.FC<ConsultListItemProps> = ({ consultation }) => {
    const formattedDate = new Date(consultation.date + 'T00:00:00').toLocaleDateString('pt-BR');
    const borderLeftColor = getConsultaBorderColor(consultation.type);

    return (
        <Card className={`relative shadow-ultra-subtle mb-3 rounded-lg bg-white`}
            style={{
                border: '1px solid #E5E7EB',
                borderLeft: `3px solid ${borderLeftColor}`,
                padding: '8px 16px 8px 16px',
            }}>
            <div className="flex justify-between items-center mb-0.5">
                <h4 className="text-base font-semibold text-gray-800 leading-snug">{consultation.type}</h4> {/* leading-snug aqui */}
                <Badge className={`${getBadgeVariant(consultation.status)} text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
                    {consultation.status}
                </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-0.5 leading-snug">
                Dr(a). {consultation.doctorName} - {consultation.specialty}
            </p>

            <div className="flex items-center text-xs text-gray-500 gap-4 mb-0.5">
                <div className="flex items-center">
                    <CalendarDays className="mr-1 text-base text-gray-400" />
                    {formattedDate}
                </div>
                <div className="flex items-center">
                    <Clock className="mr-1 text-base text-gray-400" />
                    {consultation.time}
                </div>
            </div>

            {consultation.observacoes && (
                <div className="flex items-start border-l-[3px] border-[#CCCCCC] px-3 py-1.5 rounded mt-1.5 text-sm">
                    <ClipboardList className="text-gray-500 text-lg mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 leading-snug">
                        <span className="font-semibold text-gray-700">Observações:</span> {consultation.observacoes}
                    </p>
                </div>
            )}
        </Card>
    );
};