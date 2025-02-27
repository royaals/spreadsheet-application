"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ResultDisplayProps {
  result: string | number | null
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-2 bg-blue-50">
        <CardTitle className="text-sm font-medium text-blue-700">Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-800">{result !== null ? result : "No result"}</div>
      </CardContent>
    </Card>
  )
}

