export interface Patient {
  id: number;
  name: string;
  email: string;
  cpf: string;
  age: number;
  phone: string;
  hasConditions: boolean;
  conditions: string[];
}

export interface Professional {
  id: number
  name: string
  specialty: string
}

export interface ConsultationType {
  id: number
  name: string
}

export interface ExamType {
  id: number
  name: string
}

export type AppointmentType = "consulta" | "exame" | null