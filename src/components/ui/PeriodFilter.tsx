import { Button } from "@/components/ui/button"
import { FilterPeriod } from "@/types/consultation"

export function PeriodFilter({ activePeriod, onPeriodChange }: {
    activePeriod: FilterPeriod
    onPeriodChange: (period: FilterPeriod) => void
}) {
    const periods = [
        { key: "today" as FilterPeriod, label: "Hoje" },
        { key: "this_week" as FilterPeriod, label: "Esta Semana" },
        { key: "all_period" as FilterPeriod, label: "Todas" },
    ]

    return (
        <div className="mb-6 flex gap-1 bg-gray-100 p-1 rounded-md w-fit">
            {periods.map((period) => (
                <Button
                    key={period.key}
                    variant={activePeriod === period.key ? "outline" : "ghost"}
                    size="sm"
                    className={activePeriod === period.key ? "bg-white text-black cursor-pointer hover:bg-white" : "text-gray-600 cursor-pointer"}
                    onClick={() => onPeriodChange(period.key)}
                >
                    {period.label}
                </Button>
            ))}
        </div>
    )
}