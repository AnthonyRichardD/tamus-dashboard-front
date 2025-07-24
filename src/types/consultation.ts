export interface Professional {
  id: number;
  name: string;
  specialty: string;
  registration_number: string;
  active: boolean;
  color_code: string;
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
  professional: Professional;
  consultation_type: ConsultationType;
  start_time: string;
  end_time: string;
}

export type FilterPeriod = 'today' | 'this_week' | 'all';
