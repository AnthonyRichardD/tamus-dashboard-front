
import { mockProfessionals } from "@/data/mock-professionals"
import { mockConsultationTypes } from "@/data/mock-consultation-type"
import { mockExamTypes } from "@/data/mock-exam-type"
import type { AppointmentType } from "@/types/patient"

interface Step2ServiceSelectionProps {
  appointmentType: AppointmentType
  selectedProfessional: string
  selectedConsultationType: string
  selectedExamType: string
  onProfessionalChange: (professional: string) => void
  onConsultationTypeChange: (type: string) => void
  onExamTypeChange: (type: string) => void
}

export default function Step2ServiceSelection({
  appointmentType,
  selectedProfessional,
  selectedConsultationType,
  selectedExamType,
  onProfessionalChange,
  onConsultationTypeChange,
  onExamTypeChange,
}: Step2ServiceSelectionProps) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Seleção de Profissional/Serviço</h2>
        <p className="text-gray-600 text-sm">Escolha o profissional ou tipo de exame</p>
      </div>

      <div className="space-y-6">
        {appointmentType === "consulta" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Profissional</label>
              <select
                value={selectedProfessional}
                onChange={(e) => onProfessionalChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base"
              >
                <option value="">Selecione um profissional</option>
                {mockProfessionals.map((professional) => (
                  <option key={professional.id} value={professional.id}>
                    {professional.name} - {professional.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Tipo de Consulta</label>
              <select
                value={selectedConsultationType}
                onChange={(e) => onConsultationTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base"
              >
                <option value="">Selecione o tipo de consulta</option>
                {mockConsultationTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {appointmentType === "exame" && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Tipo de Exame</label>
            <select
              value={selectedExamType}
              onChange={(e) => onExamTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Selecione o tipo de exame</option>
              {mockExamTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </>
  )
}
