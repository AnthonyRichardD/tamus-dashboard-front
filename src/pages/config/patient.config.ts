import { ColumnDef } from "@tanstack/react-table";
import { Paciente } from "../../types/patient.types";

export const columns: ColumnDef<Paciente>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "cpf",
    header: "CPF",
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
];
