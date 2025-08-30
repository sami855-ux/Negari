"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Trash } from "lucide-react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { RestoreConfirmationDialog } from "@/components/admin/RestoreConfirmation"

type BackupEntry = {
  id: string
  name: string
  size: string
  triggeredBy: "admin" | "system" | "upload"
  type: "manual" | "automatic" | "upload"
  timestamp: string
}

const initialBackupData: BackupEntry[] = [
  {
    id: "1",
    name: "backup_20231026_030000",
    size: "1.2 GB",
    triggeredBy: "system",
    type: "automatic",
    timestamp: "2023-10-26 03:00:00",
  },
  {
    id: "2",
    name: "backup_20231025_143000",
    size: "1.1 GB",
    triggeredBy: "admin",
    type: "manual",
    timestamp: "2023-10-25 14:30:00",
  },
  {
    id: "3",
    name: "backup_20231024_030000",
    size: "1.2 GB",
    triggeredBy: "system",
    type: "automatic",
    timestamp: "2023-10-24 03:00:00",
  },
  {
    id: "4",
    name: "backup_20231023_100000_uploaded",
    size: "1.0 GB",
    triggeredBy: "admin",
    type: "upload",
    timestamp: "2023-10-23 10:00:00",
  },
]

export function BackupHistoryTable() {
  const [data, setData] = useState<BackupEntry[]>(initialBackupData)
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null)

  const handleDownload = async (id: string) => {
    // Simulate download
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleRestoreClick = (id: string) => {
    setSelectedBackupId(id)
    setIsRestoreDialogOpen(true)
  }

  const handleConfirmRestore = async () => {
    if (!selectedBackupId) return

    setIsRestoreDialogOpen(false)
    try {
      // Simulate restore operation
      await new Promise((resolve) => setTimeout(resolve, 3000))
    } catch (error) {
    } finally {
      setSelectedBackupId(null)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      // Simulate delete operation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setData((prevData) => prevData.filter((backup) => backup.id !== id))
    } catch (error) {}
  }

  const columns: ColumnDef<BackupEntry>[] = [
    {
      accessorKey: "name",
      header: "Backup Name / Timestamp",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.name}
          <div className="text-sm text-muted-foreground">
            {row.original.timestamp}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "size",
      header: "Size",
    },
    {
      accessorKey: "triggeredBy",
      header: "Triggered By",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.triggeredBy}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.type}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleDownload(row.original.id)}
            aria-label={`Download backup ${row.original.name}`}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleRestoreClick(row.original.id)}
            aria-label={`Restore from backup ${row.original.name}`}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDelete(row.original.id)}
            aria-label={`Delete backup ${row.original.name}`}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No backup history found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <RestoreConfirmationDialog
        isOpen={isRestoreDialogOpen}
        onConfirm={handleConfirmRestore}
        onCancel={() => setIsRestoreDialogOpen(false)}
      />
    </div>
  )
}
