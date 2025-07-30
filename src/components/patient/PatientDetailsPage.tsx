import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { PersonalInfoCard } from './PersonalInfoCard';
import { AddressCard } from './AddressCard';
import { HealthConditionsCard } from './HealthConditionsCard';
import { MedicalHistoryTabs } from './MedicalHistoryTabs';
import { ArrowLeft as LuArrowLeft } from 'lucide-react';
import { getPatientById } from '../../services/patient.service';
import { useAlertStore } from '@/store/DialogAlert';
import { useLoadingStore } from '@/store/loadingStore';
import { GetPatientByIdResponse, Patient } from '@/types/patient.types';

export function PatientDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { showAlert } = useAlertStore();
    const { showLoading, hideLoading } = useLoadingStore();
    const [patient, setPatient] = useState<Patient | undefined>();

    const loadPatientData = async () => {
        try {
            showLoading();
            const response = await getPatientById(id) as GetPatientByIdResponse;
            console.log(response);

            if (!response.is_error) {
                setPatient(response.patient);
                return;
            }

            showAlert('Erro na listagem', 'error', response.message);
        } catch (error) {
            console.error('Erro ao listar administradores:', error);
            showAlert(
                'Erro inesperado',
                'error',
                'Ocorreu um problema ao carregar os administradores. Tente novamente mais tarde.'
            );
        } finally {
            hideLoading();
        }
    }

    useEffect(() => {
        loadPatientData();
    }, [id]);



    return (
        <div className="bg-gray-50 min-h-screen font-sans p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{patient?.full_name}</h1>
                    <p className="text-muted-foreground">Detalhes do paciente</p>
                </div>
                <Button className="w-fit text-black bg-transparent shadow-none hover:bg-transparent cursor-pointer">
                    <LuArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
            </div>
            <main>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {patient && (
                        <PersonalInfoCard data={patient} />
                    )}
                    {patient && (
                        <AddressCard data={patient?.addresses[0]} />
                    )}
                </section>

                {/* <section className="mb-6">
                    <HealthConditionsCard data={patient.healthConditions} />
                </section>

                <MedicalHistoryTabs consultations={patient.consultations} exams={patient.exams} /> */}
            </main>
        </div>
    );
};