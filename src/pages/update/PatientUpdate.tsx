import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlertStore } from "@/store/DialogAlert";
import { mockPatients } from "../mock/patients.mock";
import { getPatientById, updatePatient } from "../../services/patient.service";

import { Paciente } from "@/types/patient.types";

export default function PatientUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlertStore();

  const [patient, setPatient] = useState<Paciente | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const USE_MOCK = true;

  useEffect(() => {
    const loadPatientData = async () => {
      if (!id) return;
      setIsFetching(true);
      setError(null);
      try {
        let data: Paciente;
        if (USE_MOCK) {
          // Agora o mockPatients e o estado 'patient' são do mesmo tipo 'Paciente', sem conflitos.
          const found = mockPatients.find((p) => p.id === Number(id));
          if (!found) throw new Error("Paciente não encontrado no mock.");
          data = found;
        } else {
          // A função getPatientById também retorna o tipo 'Paciente' correto.
          data = await getPatientById(id);
        }
        setPatient(data);
      } catch (err: any) {
        setError(err.message || "Ocorreu um erro ao buscar o paciente.");
        showAlert("Erro ao Carregar", "error", err.message);
      } finally {
        setIsFetching(false);
      }
    };
    loadPatientData();
  }, [id, showAlert, USE_MOCK]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatient((prev) => (prev ? { ...prev, [name]: value } : null));
  }, []);

  const handleSave = useCallback(async () => {
    if (!patient || !id) return;
    setIsSaving(true);
    try {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // Agora o 'patient' que você envia tem o tipo exato que 'updatePatient' espera.
        await updatePatient(id, patient);
      }
      showAlert("Sucesso!", "success", "Paciente atualizado com sucesso!");
      navigate("/lista-de-paciente");
    } catch (err: any) {
      showAlert("Erro ao Salvar", "error", err.message);
    } finally {
      setIsSaving(false);
    }
  }, [id, patient, navigate, showAlert, USE_MOCK]);

  // --- O restante do seu componente (JSX) permanece o mesmo ---
  if (isFetching) {
    return <p className="p-4 text-center">Carregando paciente...</p>;
  }

  if (error) {
    return <p className="p-4 text-center text-red-500">Erro: {error}</p>;
  }

  if (!patient) {
    return <p className="p-4 text-center">Paciente não encontrado.</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Editar Paciente</h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name">Nome Completo</Label>
          <Input id="full_name" name="full_name" value={patient.full_name} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={patient.email} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" name="phone" value={patient.phone} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" name="cpf" value={patient.cpf} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="birth_date">Data de Nascimento</Label>
          <Input id="birth_date" name="birth_date" type="date" value={patient.birth_date.split('T')[0]} onChange={handleChange} />
        </div>
        {/* Adicionamos um seletor para o status, para garantir que o valor seja sempre válido */}
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            value={patient.status}
            onChange={(e) => handleChange(e as any)} // Cast para simplificar, idealmente teria um handler de select
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => navigate(-1)} disabled={isSaving}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}