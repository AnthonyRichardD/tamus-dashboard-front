import { Card, CardContent } from "@/components/ui/card"
import { Consultation } from "@/types/consultation"

export function StatisticsCards({ consultations }: { consultations: Consultation[] }) {
  const stats = {
    total: consultations.length,
    completed: consultations.filter((c) => c.status === "completed").length,
    scheduled: consultations.filter((c) => c.status === "scheduled").length,
    canceled: consultations.filter((c) => c.status === "canceled").length,
    no_show: consultations.filter((c) => c.status === "no_show").length,
  }

  return (
    <div className="mb-6 grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Concluídas</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          <div className="text-sm text-gray-600">Agendadas</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
          <div className="text-sm text-gray-600">Canceladas</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.no_show}</div>
          <div className="text-sm text-gray-600">Faltas</div>
        </CardContent>
      </Card>
    </div>
  )
}