import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function TableLoadingSkeleton({ columns, rows = 5 }) {
    return (
      <div>
        {/* Table Header + Body */}
        <div className="overflow-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.accessorKey}
                    className="px-4 py-2 bg-gray-200 animate-pulse"
                  />
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, rowIdx) => (
                <TableRow key={rowIdx} className="animate-pulse">
                  {columns.map((col) => (
                    <TableCell key={col.accessorKey} className="p-2">
                      {col.accessorKey === "image" ? (
                        <div className="w-12 h-12 bg-gray-200 justify-center" />
                      ) : (
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
  
        {/* Footer / Pagination Skeleton */}
        <div className="flex items-center justify-between px-4 py-2 mt-2 animate-pulse">
          {/* Left: “0 of XX row(s) selected” */}
          <div className="hidden lg:flex">
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
  
          {/* Right: rows-per-page + page info + buttons */}
          <div className="flex items-center gap-4">
            {/* Rows per page label */}
            <div className="hidden lg:block">
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
  
            {/* Select dropdown placeholder */}
            <div className="h-8 w-16 bg-gray-200 rounded" />
  
            {/* Page info placeholder */}
            <div className="h-4 bg-gray-200 rounded w-20" />
  
            {/* Nav buttons placeholders */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded" />
              <div className="h-8 w-8 bg-gray-200 rounded" />
              <div className="h-8 w-8 bg-gray-200 rounded" />
              <div className="h-8 w-8 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }