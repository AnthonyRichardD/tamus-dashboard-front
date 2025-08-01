import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { CalendarDays, Clock, Building } from 'lucide-react';
import { Exam } from '@/types/patient.types';
import moment from 'moment';

interface ExamListItemProps {
    exam: Exam;
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

export const ExamListItem: React.FC<ExamListItemProps> = ({ exam }) => {

    return (
        <Card className={`relative shadow-ultra-subtle mb-3 rounded-lg bg-white gap-2`}
            style={{
                border: '1px solid #E5E7EB',
                borderLeft: `3px solid ${getCardBorder(exam.status)}`,
                padding: '8px 16px 8px 16px',
            }}>
            <h4 className="text-base font-semibold text-gray-800 leading-snug">{exam.exam_slot.exam.exam_type}</h4>
            <div className='flex items-center justify-between'>
                <p className="text-sm text-gray-600 mb-0.5 leading-snug">
                    Solicitado por: {exam.requesting_doctor.name} - {exam.requesting_doctor.specialty}
                </p>
                <Badge className={`${getBadgeVariant(exam.status)} text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
                    {getTranlatedStatus(exam.status)}
                </Badge>
            </div>
            <div className="flex items-center text-xs text-gray-500 gap-4 mb-0">
                <div className="flex items-center">
                    <CalendarDays width={16} className="mr-1 text-base text-gray-400" />
                    {moment(exam.exam_slot.start_time).format('DD/MM/YYYY')}
                </div>
                <div className="flex items-center">
                    <Clock width={16} className="mr-1 text-base text-gray-400" />
                    {moment(exam.exam_slot.start_time).format('HH:mm')} - {moment(exam.exam_slot.end_time).format('HH:mm')}
                </div>
                <div className="flex items-center">
                    <Building width={16} className="mr-1 text-base text-gray-400" />
                    {exam.exam_slot.location}
                </div>
            </div>
        </Card>
    );
};