import { Button } from "@/components/ui/button"
import { FilterPeriod } from "@/types/consultation"

export function PeriodFilter({ activePeriod, onPeriodChange }: {
    activePeriod: FilterPeriod
    onPeriodChange: (period: FilterPeriod) => void
}) {
    const periods = [
        { key: "today" as FilterPeriod, label: "Hoje" },
        { key: "this_week" as FilterPeriod, label: "Esta Semana" },
        { key: "all" as FilterPeriod, label: "Todas" },
    ]

    return (
        <div className="mb-6 flex gap-1">
            {periods.map((period) => (
                <Button
                    key={period.key}
                    variant={activePeriod === period.key ? "outline" : "ghost"}
                    size="sm"
                    className={activePeriod === period.key ? "bg-gray-900 text-white cursor-pointer" : "text-gray-600 cursor-pointer"}
                    onClick={() => onPeriodChange(period.key)}
                >
                    {period.label}
                </Button>
            ))}
        </div>
    )
}