"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const description = "An interactive line chart for users";

// Define the data structure for chart data
type ChartData = {
  date: string;
  students?: number;
  teachers?: number;
};

const chartConfig = {
  students: {
    label: "Students",
    color: "hsl(var(--chart-1))",
  },
  teachers: {
    label: "Teachers",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type ApiResponse =
  | { error: string }
  | { date: string; role: "students" | "teachers"; count: number }[];

export default function BigLineChart() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("students");
  const [chartDataState, setChartDataState] = React.useState<ChartData[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user-date`);
      const data: ApiResponse = await res.json();

      console.log("API Response:", data); // Debugging the API response

      if (res.ok) {
        if (Array.isArray(data)) {
          // Transforming the API response into the desired format
          const transformedData: ChartData[] = data.reduce((acc: ChartData[], curr) => {
            let existingDate = acc.find((item) => item.date === curr.date);
            if (!existingDate) {
              existingDate = { date: curr.date };
              acc.push(existingDate);
            }

            // Set the count for the correct role (students or teachers)
            existingDate[curr.role] = curr.count;

            return acc;
          }, []);

          setChartDataState(transformedData);
        } else {
          setError("Unexpected response structure");
        }
      } else {
        if ("error" in data) {
          setError(data.error);
        } else {
          setError("Error fetching data");
        }
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const total = React.useMemo(
    () => ({
      students: chartDataState.reduce((acc, curr) => acc + (curr.students || 0), 0),
      teachers: chartDataState.reduce((acc, curr) => acc + (curr.teachers || 0), 0),
    }),
    [chartDataState]
  );

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>User Timeframe:</CardTitle>
          <CardDescription>
            {loading ? "Loading data..." : error || "Showing total users joined by date and role"}
          </CardDescription>
        </div>
        <div className="flex">
          {["students", "teachers"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[chart].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
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
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[150px]" nameKey="views" />}
            />
            <Line
              type="monotone"
              dataKey={activeChart}
              stroke={chartConfig[activeChart].color}
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}