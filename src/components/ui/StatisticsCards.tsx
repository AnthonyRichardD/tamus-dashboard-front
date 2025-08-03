import { Card, CardContent } from "@/components/ui/card"
import { Summary } from "@/types/consultation.types"

export function StatisticsCards({ summary }: { summary: Summary }) {
  return (
    <div className="mb-6 grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Card className="h-[100px]">
        <CardContent className="">
          <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </CardContent>
      </Card>

      <Card className="h-[100px]">
        <CardContent className="">
          <div className="text-2xl font-bold text-green-600">{summary.completed}</div>
          <div className="text-sm text-gray-600">Concluídas</div>
        </CardContent>
      </Card>

      <Card className="h-[100px]">
        <CardContent className="">
          <div className="text-2xl font-bold text-blue-600">{summary.scheduled}</div>
          <div className="text-sm text-gray-600">Agendadas</div>
        </CardContent>
      </Card>

      <Card className="h-[100px]">
        <CardContent className="">
          <div className="text-2xl font-bold text-red-600">{summary.canceled}</div>
          <div className="text-sm text-gray-600">Canceladas</div>
        </CardContent>
      </Card>

      <Card className="h-[100px]">
        <CardContent className="">
          <div className="text-2xl font-bold text-orange-600">{summary.no_show}</div>
          <div className="text-sm text-gray-600">Faltas</div>
        </CardContent>
      </Card>
    </div>
  )
}