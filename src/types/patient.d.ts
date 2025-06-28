export type PatientStatus = 'Ativo' | 'Inativo';
export type ConsultationStatus = 'Concluído' | 'Agendado' | 'Cancelado';
export type ExamStatus = 'Concluído' | 'Agendado' | 'Pendente'; // Mantendo Pendente caso vá usar

export interface PersonalInfo {
    fullName: string;
    email: string;
    birthDate: string;
    cpf: string;
    phone: string;
    status: PatientStatus;
}

export interface Address {
    zipCode: string;
    street: string;
    neighborhood: string;
    city: string;
}

export interface HealthCondition {
    id: string;
    description: string;
}

export interface Consultation {
    id: string;
    date: string;
    time: string;
    doctorName: string;
    specialty: string;
    status: ConsultationStatus;
    observacoes?: string; 
    type: string; 
}

export interface Exam {
    id: string;
    name: string; 
    requestedBy: string;
    date: string;
    time: string;
    location: string;
    status: ExamStatus;
}

export interface Patient {
    id: string;
    personalInfo: PersonalInfo;
    address: Address;
    healthConditions: HealthCondition[];
    consultations: Consultation[];
    exams: Exam[];
}