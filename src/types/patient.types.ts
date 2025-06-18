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