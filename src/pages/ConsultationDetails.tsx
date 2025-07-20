"use client"

import { useState, useMemo, useCallback } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isToday, isThisWeek } from "@/utils/dateUtils"
import { StatisticsCards } from "@/components/ui/StatisticsCards"
import { PeriodFilter } from "@/components/ui/PeriodFilter"
import { ConsultationCard } from "@/components/ui/ConsultationCard"
import { useNavigate } from "react-router-dom"
import consultationServices from "@/services/consultation.services"
import { useEffect } from "react"
import { Consultation, ConsultationListResponse } from "@/types/consultation"

export type FilterPeriod = "today" | "this_week" | "all"

export default function ConsultationDetails() {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<FilterPeriod>("today");
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [,setPagination] = useState<ConsultationListResponse["pagination"] | null>(null);
  const [,setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [filters] = useState<{ [key: string]: string | number } | undefined>(undefined);

  const fetchConsultations = useCallback(
    async (customFilters?: { [key: string]: string | number }) => {
      try {
        setLoading(true);
        setError(null);

        const response: ConsultationListResponse = await consultationServices.listConsultations({
          page: 1,
          limit_per_page: 10,
          filters: customFilters || filters,
        });

        setConsultations(response.data);
        setPagination(response.pagination);
      } catch (error: any) {
        console.error("Erro ao buscar consultas:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setError(error.message || "Não foi possível carregar as consultas. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [filters] 
  );

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]); 


  const filteredConsultations = useMemo(() => {
    return consultations.filter((consultation) => {
      switch (activePeriod) {
        case "today":
          return isToday(consultation.slot.start_time)
        case "this_week":
          return isThisWeek(consultation.slot.start_time)
        case "all":
          return true
        default:
          return true
      }
    })
  }, [consultations, activePeriod])

    const handleViewDetails = (consultationId: number) => {
        alert(`Navegando para detalhes da consulta ${consultationId}`)
    }

    const handleBackToDashboard = () => {
        navigate("/dashboard");
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Detalhes das Consultas</h1>
                        <p className="text-gray-600">Visualização detalhada de todas as consultas médicas.</p>
                    </div>
                    <Button variant="ghost" className="flex items-center gap-2 cursor-pointer" onClick={handleBackToDashboard}>
                        <ArrowLeft className="h-4 w-4" />
                        Voltar ao Dashboard
                    </Button>
                </div>

                <StatisticsCards consultations={filteredConsultations} />

                <PeriodFilter activePeriod={activePeriod} onPeriodChange={setActivePeriod} />

                <div className="space-y-4">
                    {filteredConsultations.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Nenhuma consulta encontrada para o período selecionado.</p>
                        </div>
                    ) : (
                        filteredConsultations.map((consultation) => (
                            <ConsultationCard key={consultation.id} consultation={consultation} onViewDetails={handleViewDetails} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
