import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { PersonalInfoCard } from './PersonalInfoCard';
import { AddressCard } from './AddressCard';
import { MedicalHistoryTabs } from './MedicalHistoryTabs';
import { ArrowLeft as LuArrowLeft } from 'lucide-react';
import { useAlertStore } from '@/store/DialogAlert';
import { useLoadingStore } from '@/store/loadingStore';
import { GetPatientByIdResponse, Patient, PatientConsultationResponse } from '@/types/patient.types';
import patientService from '@/services/patient.service';

export function PatientDetailsPage() {
    const { showAlert } = useAlertStore();
    const { showLoading, hideLoading } = useLoadingStore();
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = useState<Patient | undefined>();
    const [consultations, setConsultations] = useState<PatientConsultationResponse>();

    const loadPatientData = async () => {
        try {
            showLoading();
            const response = await patientService.getPatientById(id) as GetPatientByIdResponse;

            if (!response.is_error) {
                setPatient(response.patient);
                return;
            }

            showAlert('Erro na listagem', 'error', response.message);
        } catch (error) {
            console.error('Erro ao carregar os dados do paciente:', error);
            showAlert(
                'Erro inesperado',
                'error',
                'Ocorreu um problema ao carregar os dados do paciente. Tente novamente mais tarde.'
            );
        } finally {
            hideLoading();
        }
    }

    const loadPatientConsultations = async () => {
        try {
            showLoading();
            const response = await patientService.getConsultationsByPatient(id) as PatientConsultationResponse;

            if (!response.is_error) {
                setConsultations(response);
                return;
            }

            showAlert('Erro ao carregar os dados do paciente', 'error', response.message);
        } catch (error) {
            console.error('Erro ao :', error);
            showAlert(
                'Erro inesperado',
                'error',
                'Ocorreu um problema ao carregar os dados do paciente. Tente novamente mais tarde.'
            );
        } finally {
            hideLoading();
        }
    }

    useEffect(() => {
        loadPatientData();
        loadPatientConsultations();
    }, [id]);



    return (
        <div className="bg-gray-50 min-h-screen font-sans p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{patient?.full_name}</h1>
                    <p className="text-muted-foreground">Detalhes do paciente</p>
                </div>
                <Button onClick={() => navigate(-1)} className="w-fit text-black bg-transparent shadow-none hover:bg-transparent cursor-pointer">
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
                <MedicalHistoryTabs consultations={consultations?.data} />

            </main>
        </div>
    );
};