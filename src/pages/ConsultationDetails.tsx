import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatisticsCards } from '@/components/ui/StatisticsCards';
import { PeriodFilter } from '@/components/ui/PeriodFilter';
import { ConsultationCard } from '@/components/ui/ConsultationCard';
import consultationServices from '@/services/consultation.services';
import { useEffect } from 'react';
export type FilterPeriod = 'today' | 'this_week' | 'all_period';

import { useNavigate } from 'react-router';
import { useAlertStore } from '@/store/DialogAlert';
import { useLoadingStore } from '@/store/loadingStore';
import { ConsultationDetailsResponse } from '@/types/consultation.types';


export default function ConsultationDetails() {
  const { showAlert } = useAlertStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const navigate = useNavigate();

  const [activePeriod, setActivePeriod] = useState<FilterPeriod>('today');

  const [content, setContent] = useState<ConsultationDetailsResponse>();


  const fetchConsultations = useCallback(
    async (customFilters?: { [key: string]: string | number }) => {
      try {
        showLoading();
        const response =
          await consultationServices.listConsultations({
            page: 1,
            limit_per_page: 10,
            filters: customFilters,
            period: activePeriod,
          });

        if (!response.is_error) {
          setContent(response);
          return;
        }

        showAlert(
          'Erro na listagem de consultas',
          'error',
          response.message
        );

      } catch (error) {
        console.error('Erro ao :', error);
        showAlert(
          'Erro inesperado',
          'error',
          'Ocorreu um problema ao carregar os dados. Tente novamente mais tarde.'
        );
      } finally {
        hideLoading();
      }
    },
    [activePeriod, showLoading, hideLoading, showAlert]
  );

  useEffect(() => {
    fetchConsultations();
  }, [activePeriod, fetchConsultations]);


  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handlePeriod = (period: FilterPeriod) => {
    setActivePeriod(period);
  };

  const handleDetails = (id: number) => {
    console.log(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalhes das Consultas
            </h1>
            <p className="text-gray-600">
              Visualização detalhada de todas as consultas médicas.
            </p>
          </div>
          <Button
            variant="ghost"
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleBackToDashboard}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>

        {
          content &&
          <StatisticsCards summary={content.summary} />
        }


        <PeriodFilter
          activePeriod={activePeriod}
          onPeriodChange={handlePeriod}
        />

        <div className="space-y-4">
          {content?.data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Nenhuma consulta encontrada para o período selecionado.
              </p>
            </div>
          ) : (
            content?.data.map((consultation) => (
              <ConsultationCard
                key={consultation.id}
                consultation={consultation}
                onViewDetails={handleDetails}
              />
            ))
          )}
        </div>
        {/*
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {startIndex + 1} a{' '}
              {Math.min(endIndex, allFilteredConsultations.length)} de{' '}
              {allFilteredConsultations.length} consultas
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
                  const pages = [];
                  const maxVisiblePages = 5;

                  if (totalPages <= maxVisiblePages) {
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={currentPage === i ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(i)}
                          className="w-8 h-8 p-0 cursor-pointer"
                        >
                          {i}
                        </Button>
                      );
                    }
                  } else {
                    if (currentPage <= 3) {
                      for (let i = 1; i <= 4; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(i)}
                            className="w-8 h-8 p-0"
                          >
                            {i}
                          </Button>
                        );
                      }
                      pages.push(
                        <span key="ellipsis1" className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                      pages.push(
                        <Button
                          key={totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-8 h-8 p-0"
                        >
                          {totalPages}
                        </Button>
                      );
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
                        </Button>
                      );
                      pages.push(
                        <span key="ellipsis2" className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                      for (let i = totalPages - 3; i <= totalPages; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(i)}
                            className="w-8 h-8 p-0"
                          >
                            {i}
                          </Button>
                        );
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
                        </Button>
                      );
                      pages.push(
                        <span key="ellipsis3" className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(i)}
                            className="w-8 h-8 p-0"
                          >
                            {i}
                          </Button>
                        );
                      }
                      pages.push(
                        <span key="ellipsis4" className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                      pages.push(
                        <Button
                          key={totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-8 h-8 p-0"
                        >
                          {totalPages}
                        </Button>
                      );
                    }
                  }

                  return pages;
                })()}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="cursor-pointer"
              >
                Próxima
              </Button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
