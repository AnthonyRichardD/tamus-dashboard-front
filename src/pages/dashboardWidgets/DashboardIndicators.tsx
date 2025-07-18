// src/pages/dashboard/widgets/DashboardIndicators.tsx
import { dashboardMockData } from "../mock/dashboard.mock";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, User, Users } from "lucide-react";

const kpis = [
  {
    title: "Pacientes Cadastrados",
    icon: <Users className="h-5 w-5 text-primary" />,
    value: dashboardMockData.pacientesCadastrados.total.toLocaleString(),
    sub: dashboardMockData.pacientesCadastrados.tendencia,
  },
  {
    title: "Agendamentos Hoje",
    icon: <Calendar className="h-5 w-5 text-primary" />,
    value: dashboardMockData.agendamentosHoje.total,
    sub: dashboardMockData.agendamentosHoje.tendencia,
  },
  {
    title: "Taxa de Comparecimento",
    icon: <User className="h-5 w-5 text-primary" />,
    value: `${dashboardMockData.taxaComparecimento.percentual}%`,
    sub: dashboardMockData.taxaComparecimento.tendencia,
  },
  {
    title: "Slots Disponíveis",
    icon: <Clock className="h-5 w-5 text-primary" />,
    value: dashboardMockData.slotsDisponiveis.total,
    sub: dashboardMockData.slotsDisponiveis.tendencia,
  },
];

export function DashboardIndicators() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{kpi.title}</span>
              {kpi.icon}
            </div>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="text-xs text-green-600">{kpi.sub}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
