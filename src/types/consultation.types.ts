// BEGIN: ConsultationDetailsResponse

export interface ConsultationDetailsResponse {
  data: Consultation[];
  pagination: Pagination;
  summary: Summary;
  is_error: boolean;
  message: string;
}

export interface Consultation {
  id: number;
  patient_id: number;
  professional_id: number;
  consultation_type_id: number;
  slot_id: number;
  status: ConsultationStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  cancellation_reason: string;
  slot: Slot;
  patient: Patient;
  professional: Professional;
  consultation_type: ConsultationType;
}

export type ConsultationStatus =
  | 'scheduled'
  | 'completed'
  | 'canceled'
  | 'no_show';

export interface Slot {
  id: number;
  professional_id: number;
  consultation_type_id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

export interface Patient {
  id: number;
  cpf: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  health_conditions?: string;
  registration_date: string;
  active: boolean;
  reset_token_expira: string;
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

export interface Summary {
  completed: number;
  scheduled: number;
  canceled: number;
  no_show: number;
  total: number;
}
