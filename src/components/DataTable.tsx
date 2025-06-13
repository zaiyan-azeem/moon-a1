import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { SortingState, ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../components/ui/table";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { PokemonStat } from "../hooks/usePokemonStats";

interface DataTableProps {
  data: PokemonStat[];
  onRemove: (name: string) => void;
}

export function DataTable({ data, onRemove }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<PokemonStat, any>[]>(
    () => [
      {
        header: "Sprite",
        accessorKey: "sprite",
        cell: ({ getValue }) => <img src={getValue()} alt="" className="w-6 h-6" />,
      },
      {
        header: "Types",
        accessorKey: "types",
        cell: ({ getValue }) => (
          <div className="flex gap-1">
            {(getValue() as string[]).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs capitalize"
              >
                {t}
              </span>
            ))}
          </div>
        ),
      },
      { header: "ID", accessorKey: "id" },
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ getValue }) => (
          <span className="capitalize">{getValue()}</span>
        ),
      },
      {
        header: "HP",
        accessorKey: "hp",
      },
      {
        header: "Attack",
        accessorKey: "attack",
      },
      {
        header: "Defense",
        accessorKey: "defense",
      },
      {
        header: "Speed",
        accessorKey: "speed",
      },
      {
        header: "XP",
        accessorKey: "xp",
      },
      {
        header: "Height (m)",
        accessorKey: "height",
        cell: ({ getValue }) => `${getValue()} m`,
      },
      {
        header: "Weight (kg)",
        accessorKey: "weight",
        cell: ({ getValue }) => `${getValue()} kg`,
      },
      {
        id: "remove",
        header: "", 
        cell: ({ row }) => (
          <button
            onClick={() => onRemove(row.original.name)}
            className="text-red-600 hover:text-red-800"
            aria-label={`Remove ${row.original.name}`}
          >
            ×
          </button>
        ),
      },
    ],
    [onRemove]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table>
      <TableCaption>{data.length === 0 ? "No data" : undefined}</TableCaption>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={
                  header.column.getCanSort()
                    ? header.column.getToggleSortingHandler()
                    : undefined
                }
                className={header.column.getCanSort() ? "cursor-pointer" : ""}
              >
                <div className="flex items-center gap-1">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" && <ArrowUp className="h-3 w-3" />}
                  {header.column.getIsSorted() === "desc" && (
                    <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-gray-400">
              No data
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
