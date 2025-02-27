"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import {
  Bold,
  Italic,
  Underline,
  Save,
  Upload,
  Plus,
  Trash2,
  BarChart4,
  Calculator,
  Search,
  Palette,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SpreadsheetTable } from "./spreadsheet-table"
import { ResultDisplay } from "./result-display"
import { ChartDisplay } from "./chart-display"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import * as XLSX from "xlsx"


export type CellData = {
  value: string
  style?: {
    fontWeight?: string
    fontStyle?: string
    textDecoration?: string
    color?: string
  }
}

export type SpreadsheetData = CellData[][]

export default function Spreadsheet() {
  const { toast } = useToast()
  const [data, setData] = useState<SpreadsheetData>([])
  const [selectedRange, setSelectedRange] = useState({
    col: "",
    rowStart: 0,
    rowEnd: 0,
  })
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [result, setResult] = useState<string | number | null>(null)
  const [chartData, setChartData] = useState<{ labels: string[]; values: number[] } | null>(null)
  const [findText, setFindText] = useState("")
  const [replaceText, setReplaceText] = useState("")
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [showFindReplaceDialog, setShowFindReplaceDialog] = useState(false)

  
  useEffect(() => {
    initializeSpreadsheet()
  }, [])

  const initializeSpreadsheet = () => {
    const initialData: SpreadsheetData = []
    for (let i = 0; i < 20; i++) {
      const row: CellData[] = []
      for (let j = 0; j < 10; j++) {
        row.push({ value: "" })
      }
      initialData.push(row)
    }
    setData(initialData)
  }

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...data]
    newData[rowIndex][colIndex] = {
      ...newData[rowIndex][colIndex],
      value,
    }
    setData(newData)
  }

  const handleCellSelect = (rowIndex: number, colIndex: number) => {
    setSelectedCell({ row: rowIndex, col: colIndex })
  }

  const applyFormat = (format: "bold" | "italic" | "underline") => {
    if (!selectedCell) {
      toast({
        title: "No cell selected",
        description: "Please select a cell to apply formatting",
        variant: "destructive",
      })
      return
    }

    const { row, col } = selectedCell
    const newData = [...data]
    const cell = newData[row][col]
    const style = cell.style || {}

    switch (format) {
      case "bold":
        style.fontWeight = style.fontWeight === "bold" ? "normal" : "bold"
        break
      case "italic":
        style.fontStyle = style.fontStyle === "italic" ? "normal" : "italic"
        break
      case "underline":
        style.textDecoration = style.textDecoration === "underline" ? "none" : "underline"
        break
    }

    newData[row][col] = {
      ...cell,
      style,
    }

    setData(newData)
  }

  const applyColor = (color: string) => {
    if (!selectedCell) {
      toast({
        title: "No cell selected",
        description: "Please select a cell to apply color",
        variant: "destructive",
      })
      return
    }

    const { row, col } = selectedCell
    const newData = [...data]
    const cell = newData[row][col]

    newData[row][col] = {
      ...cell,
      style: {
        ...cell.style,
        color,
      },
    }

    setData(newData)
    setSelectedColor(color)
    setColorPickerOpen(false)
  }

  const getSelectedCells = () => {
    if (!selectedRange.col || selectedRange.rowStart <= 0 || selectedRange.rowEnd <= 0) {
      toast({
        title: "Invalid selection",
        description: "Please specify a valid column and row range",
        variant: "destructive",
      })
      return []
    }

    const colIndex = selectedRange.col.toUpperCase().charCodeAt(0) - 65
    const cells: CellData[] = []

    for (let i = selectedRange.rowStart - 1; i < selectedRange.rowEnd; i++) {
      if (i >= 0 && i < data.length && colIndex >= 0 && colIndex < data[i].length) {
        cells.push(data[i][colIndex])
      }
    }

    return cells
  }

  const performMathFunction = (func: "sum" | "average" | "max" | "min" | "count") => {
    const cells = getSelectedCells()
    if (cells.length === 0) return

    const values = cells.map((cell) => Number.parseFloat(cell.value)).filter((val) => !isNaN(val))

    if (values.length === 0) {
      setResult("No numeric values found")
      return
    }

    let calculatedResult: number
    switch (func) {
      case "sum":
        calculatedResult = values.reduce((acc, val) => acc + val, 0)
        break
      case "average":
        calculatedResult = values.reduce((acc, val) => acc + val, 0) / values.length
        break
      case "max":
        calculatedResult = Math.max(...values)
        break
      case "min":
        calculatedResult = Math.min(...values)
        break
      case "count":
        calculatedResult = values.length
        break
      default:
        return
    }

    setResult(calculatedResult)
  }

  const performDataQuality = (operation: "trim" | "upper" | "lower" | "removeDuplicates") => {
    if (!selectedRange.col || selectedRange.rowStart <= 0 || selectedRange.rowEnd <= 0) {
      toast({
        title: "Invalid selection",
        description: "Please specify a valid column and row range",
        variant: "destructive",
      })
      return
    }

    const colIndex = selectedRange.col.toUpperCase().charCodeAt(0) - 65
    const newData = [...data]

    if (operation === "removeDuplicates") {
      const values = new Set<string>()
      const indices: number[] = []

      
      for (let i = selectedRange.rowStart - 1; i < selectedRange.rowEnd; i++) {
        if (i >= 0 && i < newData.length && colIndex >= 0 && colIndex < newData[i].length) {
          const value = newData[i][colIndex].value
          if (!values.has(value)) {
            values.add(value)
            indices.push(i)
          }
        }
      }

      
      for (let i = selectedRange.rowStart - 1; i < selectedRange.rowEnd; i++) {
        if (i >= 0 && i < newData.length && colIndex >= 0 && colIndex < newData[i].length) {
          if (!indices.includes(i)) {
            newData[i][colIndex] = { ...newData[i][colIndex], value: "" }
          }
        }
      }
    } else {
      for (let i = selectedRange.rowStart - 1; i < selectedRange.rowEnd; i++) {
        if (i >= 0 && i < newData.length && colIndex >= 0 && colIndex < newData[i].length) {
          const cell = newData[i][colIndex]
          let newValue = cell.value

          switch (operation) {
            case "trim":
              newValue = newValue.trim()
              break
            case "upper":
              newValue = newValue.toUpperCase()
              break
            case "lower":
              newValue = newValue.toLowerCase()
              break
          }

          newData[i][colIndex] = { ...cell, value: newValue }
        }
      }
    }

    setData(newData)
    toast({
      title: "Operation completed",
      description: `${operation} operation applied successfully`,
    })
  }

  const performFindAndReplace = () => {
    if (!findText) {
      toast({
        title: "Find text is empty",
        description: "Please enter text to find",
        variant: "destructive",
      })
      return
    }

    if (!selectedRange.col || selectedRange.rowStart <= 0 || selectedRange.rowEnd <= 0) {
      toast({
        title: "Invalid selection",
        description: "Please specify a valid column and row range",
        variant: "destructive",
      })
      return
    }

    const colIndex = selectedRange.col.toUpperCase().charCodeAt(0) - 65
    const newData = [...data]
    let replacements = 0

    for (let i = selectedRange.rowStart - 1; i < selectedRange.rowEnd; i++) {
      if (i >= 0 && i < newData.length && colIndex >= 0 && colIndex < newData[i].length) {
        const cell = newData[i][colIndex]
        if (cell.value.includes(findText)) {
          const newValue = cell.value.replace(new RegExp(findText, "g"), replaceText)
          newData[i][colIndex] = { ...cell, value: newValue }
          replacements++
        }
      }
    }

    setData(newData)
    setShowFindReplaceDialog(false)
    toast({
      title: "Find and replace completed",
      description: `${replacements} replacements made`,
    })
  }

  const generateChart = () => {
    const cells = getSelectedCells()
    if (cells.length === 0) return

    const values = cells.map((cell) => Number.parseFloat(cell.value)).filter((val) => !isNaN(val))

    if (values.length === 0) {
      toast({
        title: "No numeric values found",
        description: "Please select cells with numeric values",
        variant: "destructive",
      })
      return
    }

    const labels = Array.from({ length: values.length }, (_, i) => `Row ${selectedRange.rowStart + i}`)
    setChartData({ labels, values })
  }

  const addRow = () => {
    const newData = [...data]
    const newRow: CellData[] = Array(newData[0]?.length || 10)
      .fill(0)
      .map(() => ({ value: "" }))
    newData.push(newRow)
    setData(newData)
  }

  const deleteRow = () => {
    if (data.length <= 1) {
      toast({
        title: "Cannot delete row",
        description: "Spreadsheet must have at least one row",
        variant: "destructive",
      })
      return
    }

    const newData = [...data]
    newData.pop()
    setData(newData)
  }

  const addColumn = () => {
    if (data[0]?.length >= 26) {
      toast({
        title: "Column limit reached",
        description: "Cannot add more than 26 columns (A-Z)",
        variant: "destructive",
      })
      return
    }

    const newData = data.map((row) => {
      const newRow = [...row]
      newRow.push({ value: "" })
      return newRow
    })
    setData(newData)
  }

  const deleteColumn = () => {
    if (data[0]?.length <= 1) {
      toast({
        title: "Cannot delete column",
        description: "Spreadsheet must have at least one column",
        variant: "destructive",
      })
      return
    }

    const newData = data.map((row) => {
      const newRow = [...row]
      newRow.pop()
      return newRow
    })
    setData(newData)
  }

  const saveFile = () => {
    try {
      
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.aoa_to_sheet(data.map((row) => row.map((cell) => cell.value)))

      
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

      
      XLSX.writeFile(workbook, "spreadsheet.xlsx")

      toast({
        title: "Spreadsheet saved",
        description: "Your spreadsheet has been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error saving spreadsheet",
        description: "An error occurred while saving your spreadsheet",
        variant: "destructive",
      })
    }
  }

  const loadFile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".xlsx, .xls, .csv"

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer
          const workbook = XLSX.read(arrayBuffer, { type: "array" })

          
          const worksheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[worksheetName]

          
          const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

          
          const newData: SpreadsheetData = []

          
          let maxCols = 0
          sheetData.forEach((row) => {
            maxCols = Math.max(maxCols, row.length)
          })

          
          sheetData.forEach((row) => {
            const newRow: CellData[] = []

           
            for (let i = 0; i < maxCols; i++) {
              newRow.push({
                value: row[i] !== undefined ? String(row[i]) : "",
              })
            }

            newData.push(newRow)
          })

          
          if (newData.length === 0) {
            newData.push([{ value: "" }])
          }

          setData(newData)
          toast({
            title: "Spreadsheet loaded",
            description: "Your spreadsheet has been loaded successfully",
          })
        } catch (error) {
          toast({
            title: "Error loading spreadsheet",
            description: "The selected file is not a valid spreadsheet",
            variant: "destructive",
          })
        }
      }
      reader.readAsArrayBuffer(file)
    }

    input.click()
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4 shadow-md border-blue-200">
        <div className="flex flex-wrap gap-2 mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={saveFile} className="border-blue-300 hover:bg-blue-50">
                  <Save className="h-4 w-4 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save Spreadsheet</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={loadFile} className="border-blue-300 hover:bg-blue-50">
                  <Upload className="h-4 w-4 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Load Spreadsheet</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-8" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormat("bold")}
                  className="border-blue-300 hover:bg-blue-50"
                >
                  <Bold className="h-4 w-4 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormat("italic")}
                  className="border-blue-300 hover:bg-blue-50"
                >
                  <Italic className="h-4 w-4 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormat("underline")}
                  className="border-blue-300 hover:bg-blue-50"
                >
                  <Underline className="h-4 w-4 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Underline</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="border-blue-300 hover:bg-blue-50">
                <Palette className="h-4 w-4 text-blue-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="flex flex-col gap-2">
                <Label htmlFor="color-picker">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color-picker"
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-10 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Button onClick={() => applyColor(selectedColor)} className="bg-blue-600 hover:bg-blue-700">
                  Apply Color
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-8" />

          <Dialog open={showFindReplaceDialog} onOpenChange={setShowFindReplaceDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="border-blue-300 hover:bg-blue-50">
                <Search className="h-4 w-4 text-blue-600" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Find and Replace</DialogTitle>
                <DialogDescription>Search for text in the selected range and replace it.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="find" className="text-right">
                    Find
                  </Label>
                  <Input
                    id="find"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="replace" className="text-right">
                    Replace with
                  </Label>
                  <Input
                    id="replace"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={performFindAndReplace} className="bg-blue-600 hover:bg-blue-700">
                  Replace All
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="col-select">Column</Label>
            <Input
              id="col-select"
              placeholder="e.g. A, B, C"
              value={selectedRange.col}
              onChange={(e) => setSelectedRange({ ...selectedRange, col: e.target.value })}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="row-start">Row Start</Label>
            <Input
              id="row-start"
              type="number"
              placeholder="Start Row"
              value={selectedRange.rowStart || ""}
              onChange={(e) => setSelectedRange({ ...selectedRange, rowStart: Number.parseInt(e.target.value) || 0 })}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="row-end">Row End</Label>
            <Input
              id="row-end"
              type="number"
              placeholder="End Row"
              value={selectedRange.rowEnd || ""}
              onChange={(e) => setSelectedRange({ ...selectedRange, rowEnd: Number.parseInt(e.target.value) || 0 })}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>

        <Tabs defaultValue="math" className="w-full">
          <TabsList className="grid grid-cols-2 bg-blue-50">
            <TabsTrigger value="math" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Mathematical Functions
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Data Quality Functions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="math" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => performMathFunction("sum")}
                className="flex items-center gap-1 border-blue-300 hover:bg-blue-50"
              >
                <Calculator className="h-4 w-4 text-blue-600" />
                SUM
              </Button>
              <Button
                variant="outline"
                onClick={() => performMathFunction("average")}
                className="flex items-center gap-1 border-blue-300 hover:bg-blue-50"
              >
                <Calculator className="h-4 w-4 text-blue-600" />
                AVERAGE
              </Button>
              <Button
                variant="outline"
                onClick={() => performMathFunction("max")}
                className="flex items-center gap-1 border-blue-300 hover:bg-blue-50"
              >
                <Calculator className="h-4 w-4 text-blue-600" />
                MAX
              </Button>
              <Button
                variant="outline"
                onClick={() => performMathFunction("min")}
                className="flex items-center gap-1 border-blue-300 hover:bg-blue-50"
              >
                <Calculator className="h-4 w-4 text-blue-600" />
                MIN
              </Button>
              <Button
                variant="outline"
                onClick={() => performMathFunction("count")}
                className="flex items-center gap-1 border-blue-300 hover:bg-blue-50"
              >
                <Calculator className="h-4 w-4 text-blue-600" />
                COUNT
              </Button>
              <Button
                variant="outline"
                onClick={generateChart}
                className="flex items-center gap-1 border-blue-300 hover:bg-blue-50"
              >
                <BarChart4 className="h-4 w-4 text-blue-600" />
                Generate Chart
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="data" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => performDataQuality("trim")}
                className="border-blue-300 hover:bg-blue-50 text-blue-600"
              >
                TRIM
              </Button>
              <Button
                variant="outline"
                onClick={() => performDataQuality("upper")}
                className="border-blue-300 hover:bg-blue-50 text-blue-600"
              >
                UPPER
              </Button>
              <Button
                variant="outline"
                onClick={() => performDataQuality("lower")}
                className="border-blue-300 hover:bg-blue-50 text-blue-600"
              >
                LOWER
              </Button>
              <Button
                variant="outline"
                onClick={() => performDataQuality("removeDuplicates")}
                className="border-blue-300 hover:bg-blue-50 text-blue-600"
              >
                REMOVE DUPLICATES
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={addRow}
                className="flex items-center gap-1 border-blue-300 hover:bg-blue-50 text-blue-600"
              >
                <Plus className="h-4 w-4" />
                Add Row
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deleteRow}
                className="flex items-center gap-1 border-blue-300 hover:bg-blue-50 text-blue-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete Row
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={addColumn}
                className="flex items-center gap-1 border-blue-300 hover:bg-blue-50 text-blue-600"
              >
                <Plus className="h-4 w-4" />
                Add Column
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deleteColumn}
                className="flex items-center gap-1 border-blue-300 hover:bg-blue-50 text-blue-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete Column
              </Button>
            </div>

            <ScrollArea className="h-[400px] border rounded-md border-blue-200">
              <SpreadsheetTable data={data} onCellChange={handleCellChange} onCellSelect={handleCellSelect} />
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <ResultDisplay result={result} />
          {chartData && <ChartDisplay chartData={chartData} />}
        </div>
      </div>
    </div>
  )
}

