import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { PersonalInfoCard } from './PersonalInfoCard';
import { AddressCard } from './AddressCard';
import { HealthConditionsCard } from './HealthConditionsCard';
import { MedicalHistoryTabs } from './MedicalHistoryTabs';
import { ArrowLeft as LuArrowLeft } from 'lucide-react';
import { getPatientById } from '../../services/patient.service';
import { Patient } from '../../types/patient.types';

export const PatientDetailsPage: React.FC = () => {
    // Pega o ID da URL. O nome do parâmetro deve corresponder à sua rota (ex: /paciente/:id)
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // ✅ NOVO: Estados para carregar dados do paciente
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ NOVO: useEffect para buscar os dados da API
    useEffect(() => {
        const fetchPatientDetails = async () => {
            if (!id) {
                setLoading(false);
                setError("ID do paciente não fornecido.");
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const patientData = await getPatientById(id);
                setPatient(patientData);
            } catch (err: any) {
                setError(err.message || 'Falha ao carregar os dados do paciente.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatientDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg text-gray-700">
                Carregando detalhes do paciente...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-lg text-red-600">
                Erro: {error}
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex justify-center items-center h-screen text-lg text-gray-700">
                Paciente não encontrado.
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
            {/* **AJUSTE DO HEADER**: Colocar nome/subtítulo à esquerda e botão "Voltar" à direita */}
            <header className="flex justify-between items-center pb-6 mb-6 border-b border-gray-100">
                {/* Lado Esquerdo: Nome do Paciente e Subtítulo */}
                <div className="flex flex-col items-start">
                    {/* Usando o nome do paciente do estado 'patient' */}
                    <h2 className="text-2xl font-bold text-gray-800">{patient.personalInfo.fullName}</h2>
                    <p className="text-sm text-gray-500 mt-1">Detalhes do paciente</p>
                </div>

                {/* Lado Direito: Botão Voltar */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')} // Ajuste para a rota de volta para a lista de pacientes ou dashboard
                    className="flex items-center text-gray-500 hover:text-gray-600 px-0 h-auto"
                >
                    <LuArrowLeft className="mr-1 h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">Voltar</span>
                </Button>
            </header>

            <main>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* ✅ CORREÇÃO: PersonalInfoCard não recebe healthConditions. */}
                    <PersonalInfoCard data={patient.personalInfo} />
                    <AddressCard data={patient.address} />
                </section>

                {/* ✅ CORREÇÃO: HealthConditionsCard é um componente separado */}
                <section className="mb-6">
                    <HealthConditionsCard data={patient.healthConditions} />
                </section>

                <MedicalHistoryTabs consultations={patient.consultations} exams={patient.exams} />
            </main>
        </div>
    );
};