// components/quick-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PagingSize } from "@/types/enum";
import type { ReactNode } from "react";

export interface ColumnDef<TData> {
  // Key dari properti data atau identifier unik untuk kolom
  accessorKey: keyof TData | string;
  // Label yang akan ditampilkan di header tabel
  header: string | ReactNode;
  // Opsional: Fungsi untuk merender sel (cell)
  // Menerima nilai sel dan seluruh objek baris
  cell?: (value: any, row: TData) => ReactNode;
}

interface QuickTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  emptyMessage?: string;
  page: number;
}

export function QuickTable<TData>({
  data,
  columns,
  emptyMessage = "Tidak ada data yang ditemukan.",
  page = 1,
}: QuickTableProps<TData>) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        {/* Table Header */}
        <TableHeader>
          <TableRow className="border [&>*]:border">
            <TableHead className="p-2 text-center">No</TableHead>
            {columns.map((column, index) => (
              <TableHead
                key={(column.accessorKey as string) || index}
                className="p-2 text-center"
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="border [&>*]:border">
                <TableCell className="p-2 text-center">
                  {(page - 1) * PagingSize + (rowIndex + 1)}
                </TableCell>
                {columns.map((column, colIndex) => {
                  const cellValue = (row as any)[column.accessorKey];

                  return (
                    <TableCell
                      key={(column.accessorKey as string) || colIndex}
                      className="p-2"
                    >
                      {/* Jika ada fungsi cell custom, gunakan itu. Jika tidak, tampilkan nilai langsung. */}
                      {column.cell ? column.cell(cellValue, row) : cellValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
