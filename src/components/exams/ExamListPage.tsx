import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft as LuArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ExamSummaryCards } from './ExamSummaryCards';
import { ExamListItem } from './ExamListItem';
import { mockExamAppointments, filterExamsByPeriod, getExamSummary } from '../../lib/mockExams';
import { ExamAppointment, ExamSummary } from '../../types/exam';

type FilterPeriod = 'today' | 'this_week' | 'all';

export const ExamListPage: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<FilterPeriod>('all');
    const [filteredExams, setFilteredExams] = useState<ExamAppointment[]>([]);
    const [summary, setSummary] = useState<ExamSummary>({ total: 0, completed: 0, scheduled: 0, canceled: 0 });

    useEffect(() => {
        const examsToDisplay = filterExamsByPeriod(mockExamAppointments, filter);
        setFilteredExams(examsToDisplay);
        setSummary(getExamSummary(examsToDisplay));
    }, [filter]);

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
            <header className="flex justify-between items-center pb-6 mb-6 border-b border-gray-100">
                <div className="flex flex-col items-start">
                    <h1 className="text-2xl font-bold text-gray-800">Detalhes dos Exames</h1>
                    <p className="text-sm text-gray-500 mt-1">Visualização detalhada de todos os exames agendados e realizados.</p>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-gray-500 hover:text-gray-600 px-0 h-auto"
                >
                    <LuArrowLeft className="mr-1 h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Voltar ao Dashboard</span>
                </Button>
            </header>

            <main>
                <ExamSummaryCards summary={summary} />
                <div className="flex justify-start mb-6">
                    <Tabs defaultValue="all" onValueChange={(value: string) => setFilter(value as FilterPeriod)}>
                        <TabsList className="bg-gray-100 rounded-md">
                            <TabsTrigger value="today" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 data-[state=active]:font-medium text-gray-600 rounded-md text-sm px-4 py-2">Hoje</TabsTrigger>
                            <TabsTrigger value="this_week" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 data-[state=active]:font-medium text-gray-600 rounded-md text-sm px-4 py-2">Esta Semana</TabsTrigger>
                            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 data-[state=active]:font-medium text-gray-600 rounded-md text-sm px-4 py-2">Todos</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <section>
                    {filteredExams.length > 0 ? (
                        filteredExams.map(exam => (
                            <ExamListItem key={exam.id} exam={exam} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-8">Nenhum exame encontrado para o período selecionado.</p>
                    )}
                </section>
            </main>
        </div>
    );
};