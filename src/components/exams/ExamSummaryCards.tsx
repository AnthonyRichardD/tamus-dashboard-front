import React from 'react';
import { Card, CardContent } from '../ui/card';
import { ExamSummary } from '../../types/exam';

interface ExamSummaryCardsProps {
    summary: ExamSummary;
}

export const ExamSummaryCards: React.FC<ExamSummaryCardsProps> = ({ summary }) => {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="shadow-ultra-subtle bg-white">
                <CardContent className="p-4 flex flex-col items-start">
                    <span className="text-3xl font-bold text-gray-800">{summary.total}</span>
                    <span className="text-sm text-gray-600">Total</span>
                </CardContent>
            </Card>
            <Card className="shadow-ultra-subtle bg-white">
                <CardContent className="p-4 flex flex-col items-start">
                    <span className="text-3xl font-bold text-green-600">{summary.completed}</span>
                    <span className="text-sm text-gray-600">Concluídos</span>
                </CardContent>
            </Card>
            <Card className="shadow-ultra-subtle bg-white">
                <CardContent className="p-4 flex flex-col items-start">
                    <span className="text-3xl font-bold text-blue-600">{summary.scheduled}</span>
                    <span className="text-sm text-gray-600">Agendados</span>
                </CardContent>
            </Card>
            <Card className="shadow-ultra-subtle bg-white">
                <CardContent className="p-4 flex flex-col items-start">
                    <span className="text-3xl font-bold text-red-600">{summary.canceled}</span>
                    <span className="text-sm text-gray-600">Cancelados</span>
                </CardContent>
            </Card>
        </section>
    );
};