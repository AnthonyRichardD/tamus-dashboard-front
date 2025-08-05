/**
 * Define a estrutura de dados central para um Paciente.
 */
export interface Paciente {
  id: number;
  full_name: string;
  cpf: string;
  email: string;
  phone: string;
  birth_date: string;
  status: 'active' | 'inactive';
  registration_date: string;
  health_conditions: string;
}

/**
 * Define a estrutura da resposta da API para uma lista paginada.
 */
export interface PaginatedResponse {
  data: Paciente[];
  pagination: {
    total: number;
    page: number;
    limit_per_page: number;
  };
}

export interface GetPatientByIdResponse {
  is_error: false;
  message: string;
  patient?: Patient;
}

export interface Patient {
  id: number;
  cpf: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  health_conditions: string;
  registration_date: string;
  active: boolean;
  addresses: PatientAddress[];
}
export interface PatientAddress {
  id: number;
  patient_id: number;
  zip_code: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  active: boolean;
  registration_date: string;
}

// BEGIN: PatientConsultationResponse
export interface PatientConsultationResponse {
  is_error: boolean;
  message: string;
  data: Consultation[];
  pagination: Pagination;
}

export interface Consultation {
  id: number;
  patient_id: number;
  professional_id: number;
  consultation_type_id: number;
  slot_id: number;
  status: 'scheduled' | 'completed' | 'canceled';
  notes: string;
  created_at: string;
  updated_at: string;
  cancellation_reason: string;
  slot: Slot;
  professional: Professional;
  consultation_type: ConsultationType;
}

export interface Slot {
  id: number;
  professional_id: number;
  consultation_type_id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

export interface Professional {
  id: number;
  name: string;
  specialty: string;
  registration_number: string;
  active: boolean;
  color_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationType {
  id: number;
  name: string;
  duration_minutes: number;
  active: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// BEGIN: PatientExamsResponse

export interface PatientExamsResponse {
  is_error: boolean;
  message: string;
  data: Exam[];
  pagination: Pagination;
}

export interface Exam {
  id: number;
  status: 'scheduled' | 'completed' | 'canceled';
  created_at: string;
  exam_slot: ExamSlot;
  requesting_doctor: RequestingDoctor;
}

export interface RequestingDoctor {
  name: string;
  specialty: string;
}

export interface ExamSlot {
  slot_date: string;
  start_time: string;
  end_time: string;
  location: string;
  exam: Exam;
}

export interface Exam {
  exam_type: string;
  duration_minutes: number;
  available_locations: string[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
