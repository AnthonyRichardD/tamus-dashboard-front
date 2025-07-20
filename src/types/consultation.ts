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
  health_conditions?: string | null;
  registration_date: string;
  active: boolean;
  reset_token_expira?: string | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
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

export interface Consultation {
  id: number;
  patient_id: number;
  professional_id: number;
  consultation_type_id: number;
  status: 'completed' | 'scheduled' | 'canceled' | 'no_show';
  notes?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  slot_id: number;
  slot: Slot;
  patient: Patient;
  professional: Professional;
  consultation_type: ConsultationType;
}

export interface ConsultationListResponse {
  data: Consultation[];
  pagination: Pagination;
}

export type FilterPeriod = 'today' | 'this_week' | 'all';
