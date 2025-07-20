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
  const [, setPagination] = useState<ConsultationListResponse["pagination"] | null>(null);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [filters] = useState<{ [key: string]: string | number } | undefined>(undefined);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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


  const allFilteredConsultations = useMemo(() => {
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

  const filteredConsultations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allFilteredConsultations.slice(startIndex, endIndex)
  }, [allFilteredConsultations, currentPage, itemsPerPage])

  const totalPages = Math.ceil(allFilteredConsultations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const handlePeriodChange = (period: FilterPeriod) => {
    setActivePeriod(period)
    setCurrentPage(1)
  }

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

        <StatisticsCards consultations={allFilteredConsultations} />

        <PeriodFilter activePeriod={activePeriod} onPeriodChange={handlePeriodChange} />

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

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {startIndex + 1} a {Math.min(endIndex, allFilteredConsultations.length)} de {allFilteredConsultations.length} consultas
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="cursor-pointer"
              >
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {(() => {
                  const pages = []
                  const maxVisiblePages = 5

                  if (totalPages <= maxVisiblePages) {
                    
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(
                        <Button 
                          key={i}
                          variant={currentPage === i ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(i)}
                          className="w-8 h-8 p-0 cursor-pointer"
                        >
                          {i}
                        </Button>,
                      )
                    }
                  } else {
                   
                    if (currentPage <= 3) {
                     
                      for (let i = 1; i <= 4; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(i)}
                            className="w-8 h-8 p-0"
                          >
                            {i}
                          </Button>,
                        )
                      }
                      pages.push(
                        <span key="ellipsis1" className="px-2 text-gray-500">
                          ...
                        </span>,
                      )
                      pages.push(
                        <Button
                          key={totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-8 h-8 p-0"
                        >
                          {totalPages}
                        </Button>,
                      )
                    } else if (currentPage >= totalPages - 2) {
                     
                      pages.push(
                        <Button
                          key={1}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(1)}
                          className="w-8 h-8 p-0"
                        >
                          1
                        </Button>,
                      )
                      pages.push(
                        <span key="ellipsis2" className="px-2 text-gray-500">
                          ...
                        </span>,
                      )
                      for (let i = totalPages - 3; i <= totalPages; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(i)}
                            className="w-8 h-8 p-0"
                          >
                            {i}
                          </Button>,
                        )
                      }
                    } else {
                     
                      pages.push(
                        <Button
                          key={1}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(1)}
                          className="w-8 h-8 p-0"
                        >
                          1
                        </Button>,
                      )
                      pages.push(
                        <span key="ellipsis3" className="px-2 text-gray-500">
                          ...
                        </span>,
                      )
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(i)}
                            className="w-8 h-8 p-0"
                          >
                            {i}
                          </Button>,
                        )
                      }
                      pages.push(
                        <span key="ellipsis4" className="px-2 text-gray-500">
                          ...
                        </span>,
                      )
                      pages.push(
                        <Button
                          key={totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-8 h-8 p-0"
                        >
                          {totalPages}
                        </Button>,
                      )
                    }
                  }

                  return pages
                })()}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="cursor-pointer"
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
