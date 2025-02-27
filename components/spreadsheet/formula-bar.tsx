"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface FormulaBarProps {
  onFormulaSubmit: (formula: string) => void
  initialValue?: string
}

export function FormulaBar({ onFormulaSubmit, initialValue = "" }: FormulaBarProps) {
  const [formula, setFormula] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFormulaSubmit(formula)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
      <div className="flex-shrink-0 font-medium text-sm">fx</div>
      <Input
        type="text"
        placeholder="Enter formula or function"
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon" variant="ghost">
        <Check className="h-4 w-4" />
        <span className="sr-only">Apply formula</span>
      </Button>
    </form>
  )
}

