"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export const description = "A linear line chart comparing users"

const chartConfig = {
  students: {
    label: "Students",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function UserLineChart() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("students")
  const [chartDataState, setChartDataState] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const fetchData = async (date: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/user-date?date=${date}`)
      const data = await res.json()
      console.log(data)

      if (res.ok) {
        const newData = [
          { date, students: data.studentsCount, teachers: data.teachersCount },
        ]
        setChartDataState(newData)
      } else {
        setError(data.error || "Error fetching data")
      }
    } catch (err) {
      setError("Failed to fetch data!")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    fetchData(today)
  }, [])

  const total = React.useMemo(
    () => ({
      students: chartDataState.reduce((acc, curr) => acc + curr.students, 0),
    }),
    [chartDataState]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Growth</CardTitle>
        <CardDescription>
          {loading ? "Loading data..." : error || "Showing total users join for the selected date"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartDataState}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line
              type="monotone"
              dataKey={activeChart}
              stroke={chartConfig[activeChart].color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
