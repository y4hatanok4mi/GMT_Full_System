"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart with text"

export default function VisitorChart() {
  const [studentCount, setStudentCount] = React.useState<number | null>(null)
  const [teacherCount, setTeacherCount] = React.useState<number | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchUserCountByRole = async (role: string) => {
      try {
        const response = await fetch(`/api/user?role=${role}`)  // Pass role in the query params
  
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${role}: ${response.statusText}`)
        }
  
        const data = await response.json()
  
        if (data && data.count !== undefined) {
          console.log(`${role} count received:`, data.count)
          if (role === "student") {
            setStudentCount(data.count)
          }
        } else {
          setError('Invalid data format')
        }
      } catch (err: any) {
        console.error(`Error fetching user count for ${role}:`, err)
        setError(err.message || 'An error occurred while fetching data')
      }
    }
  
    // Fetch for both roles
    fetchUserCountByRole('student')
  }, [])

  const chartConfig = {
    student: {
      label: "Student",
      color: "hsl(var(--chart-1))",
    },
    teacher: {
      label: "Teacher",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig

  const chartData = React.useMemo(() => {
    if (studentCount !== null) {
      const totalUsers = studentCount
      return [
        { browser: "student", visitors: studentCount, fill: "var(--color-student)" },
      ]
    }

    return [
      { browser: "student", visitors: 0, fill: "var(--color-student)" },
    ]
  }, [studentCount])

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [chartData])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-start pb-0">
        <CardTitle>Users</CardTitle>
        <CardDescription>Number of users of the system</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Users
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
      </CardFooter>
    </Card>
  )
}