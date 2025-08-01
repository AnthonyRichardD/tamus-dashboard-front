import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ConsultListItem } from './ConsultListItem';
import { ExamListItem } from './ExamListItem';
import { Consultation, Exam } from '@/types/patient.types';

interface MedicalHistoryTabsProps { consultations: Consultation[], exams: Exam[] }

export const MedicalHistoryTabs: React.FC<MedicalHistoryTabsProps> = ({ consultations, exams }) => {
    return (
        <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Histórico Médico</h2>
            <p className="text-gray-500 mb-6 text-sm">Consultas e exames realizados e agendados</p>

            <Tabs defaultValue="consultas" className="w-full">
                <TabsList className="flex justify-center items-center w-full h-12 p-2 bg-gray-100 rounded-md">
                    <TabsTrigger
                        value="consultas"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:text-gray-900
                                   data-[state=active]:font-medium data-[state=active]:border-gray-200 data-[state=active]:border
                                   relative -mb-px hover:bg-gray-50 transition-colors
                                   text-gray-600 rounded-md text-sm font-medium h-8 cursor-pointer"
                    >
                        Consultas
                    </TabsTrigger>
                    <TabsTrigger
                        value="exames"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:text-gray-900
                                   data-[state=active]:font-medium data-[state=active]:border-gray-200 data-[state=active]:border
                                   relative -mb-px hover:bg-gray-50 transition-colors
                                   text-gray-600 rounded-md text-sm font-medium h-8 cursor-pointer"
                    >
                        Exames
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="consultas" className="mt-0">

                    {consultations && consultations.length > 0 ? (

                        consultations.map(consultation => (
                            <ConsultListItem key={consultation.id} consultation={
                                consultation
                            } />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-8">Nenhuma consulta encontrada.</p>
                    )}
                </TabsContent>
                <TabsContent value="exames" className="mt-0">
                    {exams && exams.length > 0 ? (
                        exams.map(exam => (
                            <ExamListItem key={exam.id} exam={exam} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-8">Nenhum exame encontrado.</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};