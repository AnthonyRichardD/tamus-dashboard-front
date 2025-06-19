import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { CalendarDays, Clock, Building } from 'lucide-react';
import { Exam, ExamStatus } from '../../types/patient';

interface ExamListItemProps {
    exam: Exam;
}

const getExamBorderColor = () => {
    return "#9B59B6";
};

const getBadgeVariant = (status: ExamStatus) => {
    switch (status) {
        case 'Concluído':
            return 'bg-[#28A745] text-white';
        case 'Agendado':
            return 'bg-[#007BFF] text-white';
        case 'Pendente':
            return 'bg-yellow-500 text-white';
        default:
            return '';
    }
};

export const ExamListItem: React.FC<ExamListItemProps> = ({ exam }) => {
    const formattedDate = new Date(exam.date + 'T00:00:00').toLocaleDateString('pt-BR');
    const borderLeftColor = getExamBorderColor();

    return (
        <Card className={`relative shadow-ultra-subtle mb-3 rounded-lg bg-white`}
            style={{
                border: '1px solid #E5E7EB',
                borderLeft: `3px solid ${borderLeftColor}`,
                padding: '8px 16px 8px 16px',
            }}>
            <div className="flex justify-between items-center mb-0.5">
                <h4 className="text-base font-semibold text-gray-800 leading-snug">{exam.name}</h4>
                <Badge className={`${getBadgeVariant(exam.status)} text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
                    {exam.status}
                </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-0.5 leading-snug">
                Solicitado por: {exam.requestedBy}
            </p>
            <div className="flex items-center text-xs text-gray-500 gap-4 mb-0">
                <div className="flex items-center">
                    <CalendarDays className="mr-1 text-base text-gray-400" />
                    {formattedDate}
                </div>
                <div className="flex items-center">
                    <Clock className="mr-1 text-base text-gray-400" />
                    {exam.time}
                </div>
                <div className="flex items-center">
                    <Building className="mr-1 text-base text-gray-400" />
                    {exam.location}
                </div>
            </div>
        </Card>
    );
};