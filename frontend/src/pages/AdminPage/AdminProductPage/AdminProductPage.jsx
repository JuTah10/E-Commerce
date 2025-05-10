import React, { useState, useMemo, useRef } from 'react'
import axios from "../../../lib/axios.js"

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ErrorAlert } from './TableComponents/error-alert.jsx'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
  } from "@tanstack/react-table"
  import { Label } from "@/components/ui/label"
  import { ArrowUpDown, ChevronDown, MoreHorizontal, ArrowUp, ArrowDown, ListFilter, Funnel,        CheckCircle2Icon,
    CheckCircleIcon,
    AlertCircle,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ColumnsIcon,
    GripVerticalIcon,
    LoaderIcon,
    MoreVerticalIcon,
    PlusIcon,
    TrendingUpIcon} from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { Checkbox } from "@/components/ui/checkbox"
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Input } from "@/components/ui/input"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { generateUniqueValues, optimizedData } from '@/pages/Utils/filterHelper'
  

// Custom Component
import CategoryHeaderWithFilter from "./TableComponents/TableHeaderWithMutiSelectFilter"
import TableLoadingSkeleton from "../AdminProductPage/TableComponents/TableLoadingSkeleton"

const fetchProductsData = async () => {
  console.log("React Query ran")
  const response = await axios.get("/product")
  return response.data
}

let page = 0

export default function DataTableDemo() {
  const queryClient = useQueryClient();

  const productQuery = useQuery({ queryKey: ['products'], queryFn: fetchProductsData })


  const [sorting, setSorting] = React.useState([])
  const [pagination, setPagination] = useState({
    pageIndex: page, //initial page index
    pageSize: 10, //default page size
  });
  const [columnFilters, setColumnFilters] = useState([
    {id:"categories", value:[]}, 
    {id:"displayed_product", value: []}
  ])
  const toggleProductVisibilityMutation = useMutation({
    mutationFn: (id) => axios.patch(`/product/displayProduct/${id}`),
    onSuccess: () => {
      // 3) when it succeeds, invalidate the 'products' query so it refetches
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      // optional: show a toast or console.error
      console.error('Failed to toggle display status', error)
    },
  })

  const columns = [

    {
      accessorKey: "name", 
      header: "Product Name",
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        const isSorted = column.getIsSorted(); // 'asc' | 'desc' | false
    
        return (
          <Button
            variant="ghost"
            onClick={column.getToggleSortingHandler()}
          >
            Price
  
            {isSorted === false && <ArrowUpDown className="text-gray-400"/>}
            {isSorted === 'asc' && <ArrowDown className=""/>}
            {isSorted === 'desc' && <ArrowUp className=""/>}
          </Button>
        );
      },
      enableSorting: true,
      enableSortingRemoval: true,
    },
  
    {
      accessorKey: "image",
      header: "Image", 
      cell: (props) => (
        <div className='w-full flex justify-center'>
          <img width={48} height={48} src={props.getValue()}/> 
        </div>
    ) //props.getValue() to get value, wrapped in <p> tag for the style
    },
    {
      accessorKey: "stock_quantity",
      header: ({column}) => {
        const isSorted = column.getIsSorted();
        return (
          <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
            Quantity
            {isSorted === false && <ArrowUpDown className="text-gray-400"/>}
            {isSorted === 'asc' && <ArrowDown className=""/>}
            {isSorted === 'desc' && <ArrowUp className=""/>}
          </Button>
        )
  
      }, 
      enableSorting: true, 
      enableSortingRemoval: true
    },
    {
      accessorKey: "categories",
      //TODO: Implement useMemo and allow selecting mutiple categories before apply filters
      header: ({column}) => <CategoryHeaderWithFilter column={column} availableFilterValues={generateUniqueValues(optimizedProductData, "categories")}/>, 
      filterFn: (row, columnId, filterValues) => {
        if (!filterValues?.length) return true;
        return filterValues.includes(row.getValue(columnId));
      }
    },
    {
      accessorKey: "displayed_product",
      header: ({ column }) => {
        const filterValues = column.getFilterValue() ?? []
        // grab the single boolean, if any
        const current = filterValues[0]
    
        return (
          <div className="flex justify-center items-center">
            <span className="mr-2">Display Status</span>
            <DropdownMenu>
              <DropdownMenuTrigger>
              <div className="flex items-center relative">
                <Funnel variant="" className={`w-4 mt-1 ${filterValues.length >= 1 ? "text-black":"text-gray-400" }`}/>
                {filterValues.length > 0 && (
                  <span className="absolute left-[10px] bottom-3 bg-black text-white text-xs rounded-full w-3 h-3 text-xs  flex items-center justify-center">
                    {filterValues.length}
                  </span>
                )}
              </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2">
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
    
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  checked={current === true}
                  onCheckedChange={(checked) =>
                    column.setFilterValue(checked ? [true] : [])
                  }
                >
                  Display
                </DropdownMenuCheckboxItem>
    
                <DropdownMenuCheckboxItem
                className="cursor-pointer"
                  checked={current === false}
                  onCheckedChange={(checked) =>
                    column.setFilterValue(checked ? [false] : [])
                  }
                >
                  Not Display
                </DropdownMenuCheckboxItem>
    
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex justify-center font-bold cursor-pointer"
                  onSelect={() => column.setFilterValue([])}
                >
                  Clear All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      cell: ({ getValue, row, table, column }) => (
        <Checkbox
          checked={getValue()}
          onCheckedChange={(val) =>
            
            {
              toggleProductVisibilityMutation.mutate(row.original.id)
            }
          }
        />
      ),
      filterFn: (row, columnId, filterValues) => {
        if (!filterValues.length) return true
        return filterValues[0] === row.getValue(columnId)
      },
    }
  ]

  const optimizedProductData = useMemo(() => optimizedData(
    productQuery.data ? productQuery.data.data  : []),
    [productQuery.data]
  )
  
  const table = useReactTable({
    data: optimizedProductData,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters
    },
    onColumnFiltersChange: (updater) => {
      // 1. figure out the next filters array
      const next = typeof updater === 'function'
        ? updater(columnFilters)
        : updater
    
      // 2. update filters …
      setColumnFilters(next)
    
      // 3. … and reset pageIndex
      setPagination(prev => ({ ...prev, pageIndex: 0 }))
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    meta: {toggleProductVisibilityMutation}
  })



  //Loading
  if (productQuery.isLoading ) {
    return (
      <div className="p-2">
        <div className="border rounded-sm">
          <TableLoadingSkeleton columns={columns} rows={9} />
        </div>
      </div>
    );
  }

  //Error
  if (productQuery.isError) {
    return (
      <div className="flex h-[75vh] items-center justify-center p-4">
        <ErrorAlert
          title="Failed to load products"
          message={
            error?.message ||
            "We couldn't retrieve the product data. Please try again or contact support if the problem persists."
          }
          onRetry={() => {queryClient.invalidateQueries({ queryKey: ["products"] })}
          }
        />
      </div>
    )
  }



  return (
    <div className="p-2">
      {/* Table */}
      <div className="border rounded-sm">
        <div className="w-full">
          <Table className="w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id} 
                      className="py-1 z-10 text-center text-black text-sm"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          </Table>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-auto w-full max-h-[75vh]">
          <Table className="">
            <TableBody className="">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id} 
                        className="text-center"
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Table Pagination Buttons */}
      <div className="flex items-center justify-between px-4 mt-2">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
    </div>
  )
}