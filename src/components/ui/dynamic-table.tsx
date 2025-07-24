import { useState, type ReactNode } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Pagination } from "./pagination"

export interface TableColumn<T = any> {
  label: string
  key: string
  sortable?: boolean
  slot?: boolean
  width?: string
  align?: "left" | "center" | "right"
  className?: string
  hidden?: boolean
}

export interface DynamicTableProps<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  onSort?: (key: string, direction: "ascending" | "descending") => void
  sortConfig?: {
    key: string | null
    direction: "ascending" | "descending"
  }
  renderCell?: (item: T, column: TableColumn<T>) => ReactNode
  rowClassName?: (item: T) => string
  emptyMessage?: string
  isLoading?: boolean
  loadingRows?: number
  pagination?: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    onPageChange: (page: number) => void
  }
}

export function DynamicTable<T extends Record<string, any>>({
  columns,
  data,
  onSort,
  sortConfig = { key: null, direction: "ascending" },
  renderCell,
  rowClassName,
  emptyMessage = "Nenhum registro encontrado.",
  isLoading = false,
  loadingRows = 5,
  pagination,
}: DynamicTableProps<T>) {

  const [internalSortConfig, setInternalSortConfig] = useState<{
    key: string | null
    direction: "ascending" | "descending"
  }>(sortConfig)

  const currentSortConfig = onSort ? sortConfig : internalSortConfig

  const handleSort = (key: string) => {
    const direction =
      currentSortConfig.key === key && currentSortConfig.direction === "ascending" ? "descending" : "ascending"

    if (onSort) {
      onSort(key, direction)
    } else {
      setInternalSortConfig({ key, direction })

      data = [...data].sort((a, b) => {
        const aValue = a[key]
        const bValue = b[key]

        if (aValue < bValue) {
          return direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
  }

  const renderSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable || currentSortConfig.key !== column.key) {
      return null
    }
    return currentSortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    )
  }

  const getCellContent = (item: T, column: TableColumn<T>) => {
    if (column.slot && renderCell) {
      return renderCell(item, column)
    }

    if (column.key.includes(".")) {
      const keys = column.key.split(".")
      let value: any = item
      for (const key of keys) {
        value = value?.[key]
        if (value === undefined || value === null) break
      }
      return value ?? ""
    }

    return item[column.key] ?? ""
  }

  const renderLoadingRows = () => {
    return Array.from({ length: loadingRows }).map((_, index) => (
      <TableRow key={`loading-${index}`} className="animate-pulse">
        {columns
          .filter((col) => !col.hidden)
          .map((column) => (
            <TableCell
              key={`loading-cell-${column.key}-${index}`}
              className={cn(
                "h-10",
                column.align === "center" && "text-center",
                column.align === "right" && "text-right",
              )}
              style={{ width: column.width }}
            >
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </TableCell>
          ))}
      </TableRow>
    ))
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns
              .filter((column) => !column.hidden)
              .map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    column.sortable && "cursor-pointer",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    column.className,
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {renderSortIcon(column)}
                  </div>
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            renderLoadingRows()
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.filter((col) => !col.hidden).length}
                className="text-center py-8 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={index} className={rowClassName ? rowClassName(item) : ""}>
                {columns
                  .filter((column) => !column.hidden)
                  .map((column) => (
                    <TableCell
                      key={`${index}-${column.key}`}
                      className={cn(
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                        column.className,
                      )}
                    >
                      {getCellContent(item, column)}
                    </TableCell>
                  ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={pagination.totalItems}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  )
}