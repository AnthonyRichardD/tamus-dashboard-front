import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlertStore } from "@/store/DialogAlert";

import PatientService from "../../services/patient.service";
import { Paciente } from '@/types/patient.types';

export default function PatientUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlertStore();

  const [patient, setPatient] = useState<Paciente | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatientData = async () => {
      if (!id) {
        setError("ID do paciente não fornecido.");
        showAlert("Erro de Navegação", "error", "ID do paciente não fornecido.");
        setIsFetching(false);
        return;
      }
      setIsFetching(true);
      setError(null);
      try {
       
        const response = await PatientService.getById(id);

        if (!response.is_error) { // Check for the `is_error` property to confirm success
          setPatient(response as Paciente); // Cast to Paciente type
        } else {
          setError(response.message || "Ocorreu um erro ao buscar o paciente.");
          showAlert("Erro ao Carregar", "error", response.message || "Ocorreu um erro ao buscar o paciente.");
        }
      } catch (err: any) {
        setError(err.message || "Ocorreu um erro de rede ao buscar o paciente.");
        showAlert("Erro ao Carregar", "error", err.message);
      } finally {
        setIsFetching(false);
      }
    };
    loadPatientData();
  }, [id, showAlert]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatient((prev) => {
      if (!prev) return null;

      // Handle the 'active' (boolean) status field
      if (name === 'active') { // Assuming 'status' input maps to 'active' property
        return { ...prev, active: value === 'true' };
      }

      return { ...prev, [name]: value };
    });
  }, []);


  const handleSave = useCallback(async () => {
    if (!patient || !id) {
      showAlert("Dados incompletos", "error", "Dados do paciente ou ID não encontrados para salvar.");
      return;
    }
    setIsSaving(true);
    try {
      // --- CORRECTED USAGE ---
      // Access methods through the imported default instance (PatientService.update)
      const response = await PatientService.update(id, patient);

      if (!response.is_error) {
        showAlert("Sucesso!", "success", response.message || "Paciente atualizado com sucesso!");
        navigate("/patients"); // Assuming '/patients' is the correct list route
      } else {
        showAlert("Erro ao Salvar", "error", response.message || "Falha ao atualizar paciente.");
      }
    } catch (err: any) {
      showAlert("Erro ao Salvar", "error", err.message || "Ocorreu um erro de rede ao salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  }, [id, patient, navigate, showAlert]);

  if (isFetching) return <p className="p-4 text-center">Carregando paciente...</p>;
  if (error) return <p className="p-4 text-center text-red-500">Erro: {error}</p>;
  if (!patient) return <p className="p-4 text-center">Paciente não encontrado.</p>;

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
          <Input
            id="birth_date"
            name="birth_date"
            type="date"
            // Ensure birth_date is formatted as YYYY-MM-DD for input type="date"
            value={patient.birth_date ? patient.birth_date.split("T")[0] : ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="active">Status</Label> {/* Changed htmlFor to 'active' */}
          <select
            id="active" // Changed id to 'active'
            name="active" // Changed name to 'active'
            value={patient.active ? 'true' : 'false'} // Bind to boolean `active`
            onChange={handleChange}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
        <div>
            <Label htmlFor="health_conditions">Condições de Saúde</Label>
            <Input id="health_conditions" name="health_conditions" value={patient.health_conditions || ''} onChange={handleChange} />
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