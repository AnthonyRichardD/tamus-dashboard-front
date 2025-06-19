import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { PersonalInfoCard } from './PersonalInfoCard';
import { AddressCard } from './AddressCard';
import { MedicalHistoryTabs } from './MedicalHistoryTabs';
import { ArrowLeft as LuArrowLeft } from 'lucide-react';
import { Patient } from '../../types/patient';

const patientDataTemplate: Patient = {
    id: 'default-mock-id',
    personalInfo: {
        fullName: 'Maria Silva Santos',
        email: 'maria.silva@email.com',
        birthDate: '1985-03-15',
        cpf: '123.456.789-01',
        phone: '(11) 98765-4321',
        status: 'Ativo',
    },
    address: {
        zipCode: '01234-567',
        street: 'Rua das Flores, 123',
        neighborhood: 'Vila Madalena',
        city: 'São Paulo - SP',
    },
    healthConditions: [
        { id: '1', description: 'Hipertensão arterial sistêmica, Diabetes mellitus tipo 2 controlado com medicação' },
    ],
    consultations: [
        {
            id: '1',
            date: '2023-11-01',
            time: '09:00 - 09:30',
            doctorName: 'Dr. João Cardiologista',
            specialty: 'Cardiologia',
            status: 'Concluído',
            observacoes: 'Paciente apresentou melhora nos níveis de glicose. Manter medicação atual.',
            type: 'Consulta de Retorno',
        },
        {
            id: '2',
            date: '2023-12-15',
            time: '14:00 - 15:00',
            doctorName: 'Dra. Ana Endocrinologista',
            specialty: 'Endocrinologia',
            status: 'Agendado',
            observacoes: '',
            type: 'Consulta Inicial',
        },
    ],
    exams: [
        {
            id: 'e1',
            name: 'Hemograma Completo',
            requestedBy: 'Dr(a). Dr. João Cardiologista',
            date: '2023-10-20',
            time: '08:00 - 08:15',
            location: 'Laboratório Central',
            status: 'Concluído',
        },
        {
            id: 'e2',
            name: 'Ultrassom Abdominal',
            requestedBy: 'Dr(a). Dra. Ana Endocrinologista',
            date: '2023-12-10',
            time: '10:00 - 10:30',
            location: 'Unidade Central',
            status: 'Agendado',
        },
    ],
};

export const PatientDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const patient: Patient = { ...patientDataTemplate, id: id || patientDataTemplate.id };

    const loading = false;
    const error = null;

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg text-gray-700">Carregando detalhes do paciente...</div>;
    }
    if (error) {
        return <div className="flex justify-center items-center h-screen text-lg text-red-600">Erro: {error}</div>;
    }
    if (!patient) {
        return <div className="flex justify-center items-center h-screen text-lg text-gray-700">Paciente não encontrado.</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
            <header className="flex justify-between items-center pb-6 mb-6 border-b border-gray-100">
                <div className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold text-gray-800">{patient.personalInfo.fullName}</h2>
                    <p className="text-sm text-gray-500 mt-1">Detalhes do paciente</p>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 hover:text-gray-600 px-0 h-auto"
                >
                    <LuArrowLeft className="mr-1 h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Voltar</span>
                </Button>
            </header>
            <main>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <PersonalInfoCard data={patient.personalInfo} healthConditions={patient.healthConditions} /> {/* Manter como você forneceu, mesmo que PersonalInfoCard não espere healthConditions */}
                    <AddressCard data={patient.address} />
                </section>
                <MedicalHistoryTabs consultations={patient.consultations} exams={patient.exams} />
            </main>
        </div>
    );
};