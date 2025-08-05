import { z } from 'zod';

export const dateTimeConfirmationSchema = z.object({
  selectedDate: z.string().min(1, 'Data é obrigatória'),
  selectedTime: z.string().min(1, 'Horário é obrigatório'),
  observations: z.string().optional(),
});

export type DateTimeConfirmationFormData = z.infer<
  typeof dateTimeConfirmationSchema
>;
