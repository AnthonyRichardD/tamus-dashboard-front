import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    onPageChange: (page: number) => void
    className?: string
}

export function Pagination({
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange,
    className = ""
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const maxVisiblePages = 3
    let startPage: number, endPage: number

    if (totalPages <= maxVisiblePages) {
        startPage = 1
        endPage = totalPages
    } else {
        const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2)
        const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1

        if (currentPage <= maxPagesBeforeCurrent) {
            startPage = 1
            endPage = maxVisiblePages
        } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
            startPage = totalPages - maxVisiblePages + 1
            endPage = totalPages
        } else {
            startPage = currentPage - maxPagesBeforeCurrent
            endPage = currentPage + maxPagesAfterCurrent
        }
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

    if (totalPages <= 1) return null

    return (
        <div className={`flex items-center justify-end gap-2 border-t p-2 ${className}`}>
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8"
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Página anterior</span>
            </Button>

            {startPage > 1 && (
                <>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(1)}
                        className="h-8 w-8"
                    >
                        1
                    </Button>
                    {startPage > 2 && <span className="px-2">...</span>}
                </>
            )}

            {pages.map((page) => (
                <Button
                    key={page}
                    variant={currentPage === page ? "secondary" : "outline"}
                    size="icon"
                    onClick={() => onPageChange(page)}
                    className="h-8 w-8"
                >
                    {page}
                </Button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="px-2">...</span>}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onPageChange(totalPages)}
                        className="h-8 w-8"
                    >
                        {totalPages}
                    </Button>
                </>
            )}

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8"
            >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Próxima página</span>
            </Button>
        </div>
    )
}