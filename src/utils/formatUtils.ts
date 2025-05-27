export const formatCPF = (cpf: string | number): string => {
  const cleaned = cpf.toString().replace(/\D/g, '');

  if (cleaned.length !== 11) return cpf.toString();

  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const isValidCPFFormat = (cpf: string | number): boolean => {
  const cleaned = cpf.toString().replace(/\D/g, '');
  return cleaned.length === 11;
};
