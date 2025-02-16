"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface StudentData {
  school: string;
  studentCount: number;
}

const chartConfig = {
  student: {
    label: "Students",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function StudentBarChart({ moduleId }: { moduleId: string }) {
  const [chartData, setChartData] = useState<StudentData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`/api/modules/${moduleId}/students`);
        
        if (response.data) {
          setChartData(response.data);
        } else {
          setError("Invalid data format");
        }
      } catch (err: any) {
        console.error("Error fetching student data:", err);
        setError(err.message || "An error occurred while fetching data");
      }
    };

    fetchStudentData();
  }, [moduleId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students per School</CardTitle>
        <CardDescription>Grouped by school for this module</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="school"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="studentCount" fill="var(--color-student)" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total students grouped by school for this module
        </div>
      </CardFooter>
    </Card>
  );
}