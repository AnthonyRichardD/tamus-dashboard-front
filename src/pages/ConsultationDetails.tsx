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
import { Pagination } from '@/components/ui/pagination';


export default function ConsultationDetails() {
  const { showAlert } = useAlertStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const navigate = useNavigate();

  const [activePeriod, setActivePeriod] = useState<FilterPeriod>('today');
  const [content, setContent] = useState<ConsultationDetailsResponse>();
  const [pagination, setPagination] = useState({
    page: 1,
    limit_per_page: 5,
    total: 0
  })


  const fetchConsultations = useCallback(
    async (page = 1) => {
      try {
        showLoading();
        const response =
          await consultationServices.listConsultations({
            page: page,
            limit_per_page: 5,
            period: activePeriod,
          });

        if (!response.is_error) {
          setContent(response);
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            page
          }));
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

  const handlePageChange = (newPage: number) => {
    fetchConsultations(newPage);
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

        {pagination && (
          <Pagination
            currentPage={pagination.page}
            itemsPerPage={pagination.limit_per_page}
            totalItems={pagination.total}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
