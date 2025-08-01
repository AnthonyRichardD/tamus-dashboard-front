export type ExamStatusList = "completed" | "scheduled" | "canceled";

export interface ExamDetails {
    id: number;
    exam_type: string;
    duration_minutes: number;
    available_locations: string[];
}

export interface RequestingDoctor {
    id: number;
    name: string;
    specialty: string;
    registration_number: string;
    active: boolean;
    color_code: string;
}

export interface ExamAppointment {
    id: number;
    patient_id: number;
    exam_slot_id: number;
    requesting_doctor_id: number;
    status: ExamStatusList;
    created_at: string; 
    exam: ExamDetails;
    requesting_doctor: RequestingDoctor;
    start_time: string; 
    end_time: string;   
    location: string;
}

export interface ExamSummary {
    total: number;
    completed: number;
    scheduled: number;
    canceled: number;
}