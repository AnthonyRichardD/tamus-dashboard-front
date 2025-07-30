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
  status: 'active' | 'inactive'; // Tipo específico
  registration_date: string;
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
