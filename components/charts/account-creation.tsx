"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AccountCreationChartProps {
  data: { date: string; count: number }[];
}

const chartConfig = {
  views: {
    label: "Account Creation",
  },
  created: {
    label: "Created Accounts",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AccountCreationChart({ data }: AccountCreationChartProps) {
  const total = React.useMemo(
    () => ({
      created: data.reduce((acc, curr) => acc + curr.count, 0),
    }),
    [data]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Account Creation Chart</CardTitle>
          <CardDescription>
            Showing the number of user accounts created for the last few months
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, "dataMax"]}
              interval="preserveStart"
              tickFormatter={(value) => value.toString()}
              ticks={Array.from(
                {
                  length:
                    Math.ceil(Math.max(...data.map((d) => d.count)) / 3) + 1,
                },
                (_, i) => i * 3
              )}
            />
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
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="created"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey="count"
              type="monotone"
              stroke={`var(--color-created)`}
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                return (
                  <g>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={12}
                      fill={`var(--color-created)`}
                    />
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize={10}
                      fontWeight="bold"
                    >
                      {payload.count}
                    </text>
                  </g>
                );
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
