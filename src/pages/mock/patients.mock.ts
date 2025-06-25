import { Paciente } from '@/types/patient.types'; // ✅ 1. Importe a interface central

export const mockPatients: Paciente[] = [
  {
    id: 1,
    full_name: 'Ana Silva',
    cpf: '123.456.789-01',
    email: 'ana.silva@example.com',
    phone: '(81) 99999-1111',
    birth_date: '1990-05-15T00:00:00.000Z',
    status: 'active', // ✅ O TypeScript vai garantir que este valor seja 'active' ou 'inactive'
    registration_date: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 2,
    full_name: 'Bruno Costa',
    cpf: '234.567.890-12',
    email: 'bruno.costa@example.com',
    phone: '(81) 98888-2222',
    birth_date: '1985-11-20T00:00:00.000Z',
    status: 'inactive', // ✅ Corretamente tipado
    registration_date: '2024-02-20T00:00:00.000Z',
  },
];
