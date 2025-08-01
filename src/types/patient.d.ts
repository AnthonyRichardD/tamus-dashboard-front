export type PatientStatus = 'Ativo' | 'Inativo';
export type ConsultationStatus = 'Concluído' | 'Agendado' | 'Cancelado';
export type ExamStatus = 'Concluído' | 'Agendado' | 'Pendente';

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

// -----------------------------------------------------------------------------
// ADJUSTMENT: Make PaginatedResponse generic to be reused for any list type.
// This allows 'data' to be an array of any specified type (e.g., Patient[], AdminListItem[]).
export interface PaginatedResponse<T> {
  data: T[]; // Array of items of type T
  total: number; // Total number of items (across all pages)
  page: number; // Current page number
  limit: number; // Items per page
  total_pages?: number; // Optional: total number of pages
  // Add other pagination metadata as your API provides
}

// If you need a specific type for Patient pagination, you can define it using the generic:
export type PaginatedPatientResponse = PaginatedResponse<Patient>;
