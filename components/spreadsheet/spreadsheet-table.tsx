"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { SpreadsheetData } from "./spreadsheet"

interface SpreadsheetTableProps {
  data: SpreadsheetData
  onCellChange: (rowIndex: number, colIndex: number, value: string) => void
  onCellSelect: (rowIndex: number, colIndex: number) => void
}

export function SpreadsheetTable({ data, onCellChange, onCellSelect }: SpreadsheetTableProps) {
  const getColumnLabel = (index: number) => {
    return String.fromCharCode(65 + index) // A, B, C, ...
  }

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    onCellChange(rowIndex, colIndex, value)
  }

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    onCellSelect(rowIndex, colIndex)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 bg-blue-600 text-white">#</TableHead>
          {data[0]?.map((_, colIndex) => (
            <TableHead key={colIndex} className="min-w-[100px] bg-blue-600 text-white">
              {getColumnLabel(colIndex)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex} className="h-10 hover:bg-blue-50">
            <TableCell className="font-medium bg-blue-100 text-center">{rowIndex + 1}</TableCell>
            {row.map((cell, colIndex) => (
              <TableCell
                key={colIndex}
                contentEditable
                suppressContentEditableWarning
                className="p-0 h-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset"
                style={{
                  fontWeight: cell.style?.fontWeight || "normal",
                  fontStyle: cell.style?.fontStyle || "normal",
                  textDecoration: cell.style?.textDecoration || "none",
                  color: cell.style?.color || "inherit",
                }}
                onInput={(e) => handleCellChange(rowIndex, colIndex, e.currentTarget.textContent || "")}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                dangerouslySetInnerHTML={{ __html: cell.value }}
              />
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

