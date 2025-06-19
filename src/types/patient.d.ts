// types/patient.d.ts

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
    doctorName: string; // <-- CORRIGIDO: de 'doctor' para 'doctorName'
    specialty: string;
    status: ConsultationStatus;
    observacoes?: string; // <-- CORRIGIDO: de 'notes' para 'observacoes'. Definido como opcional
    type: string; // <-- CORRIGIDO: Este 'type' deve ser o nome completo da consulta (Ex: "Consulta de Retorno", "Consulta Inicial")
}

export interface Exam {
    id: string;
    // Removendo 'type' aqui se ele não é usado ou se 'name' já é suficiente.
    // Na sua mock data atual, 'name' já tem o nome do exame ("Hemograma Completo").
    // Se 'type' em Exam for para uma categorização maior (e diferente de 'name'), pode manter.
    // Mas se é apenas o nome do exame, 'name' é suficiente.
    // Vou manter apenas 'name' por enquanto, para simplificar.
    name: string; // Ex: "Hemograma Completo", "Ultrassom Abdominal"
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