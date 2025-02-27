"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartDisplayProps {
  chartData: {
    labels: string[]
    values: number[]
  }
}

export function ChartDisplay({ chartData }: ChartDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    
    import("chart.js/auto").then((ChartModule) => {
      const Chart = ChartModule.default

      
      chartInstanceRef.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Data",
              data: chartData.values,
              backgroundColor: "rgba(37, 99, 235, 0.5)",
              borderColor: "rgb(37, 99, 235)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    })

    return () => {
      
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [chartData])

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-2 bg-blue-50">
        <CardTitle className="text-sm font-medium text-blue-700">Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  )
}

