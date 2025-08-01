import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { CalendarDays, Clock, ClipboardList } from 'lucide-react';
import { Consultation } from '@/types/patient.types';
import moment from 'moment';

interface ConsultListItemProps {
    consultation: Consultation;
}

const getCardBorder = (status: string) => {
    switch (status) {
        case 'completed':
            return '#28A745';
        case 'scheduled':
            return '#007BFF';
        case 'canceled':
            return 'border-red-500';
        default:
            return '';
    }
};

const getBadgeVariant = (status: 'scheduled' | 'completed' | 'canceled') => {
    switch (status) {
        case 'completed':
            return 'bg-[#28A745] text-white';
        case 'scheduled':
            return 'bg-[#007BFF] text-white';
        case 'canceled':
            return 'bg-red-500 text-white';
        default:
            return '';
    }
};

const getTranlatedStatus = (status: 'scheduled' | 'completed' | 'canceled') => {
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

export const ConsultListItem: React.FC<ConsultListItemProps> = ({ consultation }) => {
    return (
        <Card className={`relative shadow-ultra-subtle mb-3 rounded-lg bg-white gap-0`}
            style={{
                border: '1px solid #E5E7EB',
                padding: '8px 16px 8px 16px',
                borderLeft: `4px solid ${getCardBorder(consultation.status)}`,
            }}>

            <h4 className="text-base font-semibold text-gray-800 leading-snug">{consultation.consultation_type.name}</h4>

            <div className='flex items-center justify-between'>
                <p className="text-sm text-gray-600 mb-0.5 leading-snug">
                    {consultation.professional.name} - {consultation.professional.specialty}
                </p>
                <Badge className={`${getBadgeVariant(consultation.status)} text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
                    {getTranlatedStatus(consultation.status)}
                </Badge>
            </div>
            <div className="flex items-center text-xs text-gray-500 gap-4 mb-0.5">
                <div className="flex items-center">
                    <CalendarDays width={16} className="mr-1 text-base text-gray-400" />
                    {moment(consultation.slot.start_time).format('DD/MM/YYYY')}
                </div>
                <div className="flex items-center">
                    <Clock width={16} className="mr-1 text-base text-gray-400" />
                    {moment(consultation.slot.start_time).format('HH:mm')} - {moment(consultation.slot.end_time).format('HH:mm')}
                </div>
            </div>

            {consultation.notes && (
                <div className="flex items-center px-3 py-1.5 rounded-lg mt-1.5 text-sm bg-gray-100">
                    <ClipboardList width={16} className="text-gray-500 text-lg mr-2 flex-shrink-0" />
                    <p className="text-gray-700 leading-snug">
                        <span className="font-semibold text-gray-700">Observações:</span> {consultation.notes}
                    </p>
                </div>
            )}
        </Card>
    );
};