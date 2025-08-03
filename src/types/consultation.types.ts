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
  status: ConsultationStatus;
  notes: string;
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
  slot_date: string;
  start_time: string;
  end_time: string;
}

export interface Patient {
  full_name: string;
}

export interface Professional {
  name: string;
  specialty: string;
}

export interface ConsultationType {
  name: string;
  duration_minutes: number;
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
