import { z } from 'zod';

export const serviceSelectionSchema = z.discriminatedUnion('appointmentType', [
  z.object({
    appointmentType: z.literal('consulta'),
    selectedConsultationType: z
      .string()
      .min(1, 'Tipo de consulta é obrigatório'),
    selectedProfessional: z.string().min(1, 'Profissional é obrigatório'),
    selectedExamType: z.string().optional(),
  }),
  z.object({
    appointmentType: z.literal('exame'),
    selectedExamType: z.string().min(1, 'Tipo de exame é obrigatório'),
    selectedConsultationType: z.string().optional(),
    selectedProfessional: z.string().optional(),
  }),
]);

export type ServiceSelectionFormData = z.infer<typeof serviceSelectionSchema>;
