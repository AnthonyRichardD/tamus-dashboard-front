import React from 'react';
import { ExamAppointment, ExamStatusList } from '../../types/exam';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CalendarDays, Clock, MapPin, User as LuUser } from 'lucide-react';
import { useNavigate } from 'react-router';
import moment from 'moment';

interface ExamListItemProps {
    exam: ExamAppointment;
}

const getStatusBadgeVariant = (status: ExamStatusList) => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-700 border border-green-200';
        case 'scheduled':
            return 'bg-blue-100 text-blue-700 border border-blue-200';
        case 'canceled':
            return 'bg-red-100 text-red-700 border border-red-200';
        default:
            return '';
    }
};

const getExamBorderColor = () => {
    return "#9B59B6";
};

export const ExamListItem: React.FC<ExamListItemProps> = ({ exam }) => {
    const navigate = useNavigate();

    const formattedDate = moment(exam.start_time).format('DD/MM/YYYY');
    const formattedTime = `${moment(exam.start_time).format('HH:mm')} - ${moment(exam.end_time).format('HH:mm')}`;

    const borderLeftColor = getExamBorderColor();

    return (
        <Card className={`relative shadow-ultra-subtle mb-4 rounded-lg bg-white`}
            style={{
                border: '1px solid #E5E7EB',
                borderLeft: `3px solid ${borderLeftColor}`,
                padding: '16px',
            }}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                        Paciente #{exam.patient_id} <Badge className={`${getStatusBadgeVariant(exam.status)} text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ml-2`}>{exam.status === 'completed' ? 'Concluído' : exam.status === 'scheduled' ? 'Agendado' : 'Cancelado'}</Badge>
                    </h3>
                    <p className="text-sm text-gray-700 leading-tight">
                        {exam.exam.exam_type} • {exam.exam.duration_minutes} minutos
                    </p>
                </div>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 px-2 py-1"
                    onClick={() => navigate(`/paciente/${exam.patient_id}`)}>
                    Ver Detalhes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1.5fr] items-center gap-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                    <LuUser className="mr-2 text-base text-gray-500" />
                    Dr(a). {exam.requesting_doctor.name} - {exam.requesting_doctor.specialty}
                </div>

                <div className="flex items-center">
                    <CalendarDays className="mr-2 text-base text-gray-500" />
                    {formattedDate}
                </div>

                <div className="flex items-center">
                    <Clock className="mr-2 text-base text-gray-500" />
                    {formattedTime}
                </div>

                <div className="flex items-center">
                    <MapPin className="mr-2 text-base text-gray-500" />
                    {exam.location}
                </div>
            </div>

            <div className="bg-[#F8F5FB] border-l-4 border-[#C8A2C8] p-3 rounded text-sm flex items-start">
                <p className="text-gray-700 leading-snug">
                    <span className="font-semibold">Solicitado por:</span> Dr(a). {exam.requesting_doctor.name} ({exam.requesting_doctor.specialty})
                </p>
            </div>
        </Card>
    );
};