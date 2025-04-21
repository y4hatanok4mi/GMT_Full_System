'use client';

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import { useRouter } from "next/navigation"; // ✅ Added for navigation
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // ✅ Import Button component
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";

export const description = "A donut chart displaying module counts";

export default function ModuleChart() {
  const [moduleCount, setModuleCount] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter(); // ✅ For navigation

  React.useEffect(() => {
    const fetchModuleCount = async () => {
      try {
        const response = await fetch(`/api/modules/count`);

        if (!response.ok) {
          throw new Error(`Failed to fetch module data: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.totalPublishedModules !== undefined) {
          console.log(`Module count received:`, data.totalPublishedModules);
          setModuleCount(data.totalPublishedModules);
        } else {
          setError("Invalid data format");
        }
      } catch (err: any) {
        console.error(`Error fetching module count:`, err);
        setError(err.message || "An error occurred while fetching data");
      }
    };

    fetchModuleCount();
  }, []);

  const chartConfig = {
    module: {
      label: "Module",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  const chartData = React.useMemo(() => {
    if (moduleCount === null) return [];
    return [
      {
        name: "Modules",
        count: moduleCount,
        fill: "var(--color-module)",
      },
    ];
  }, [moduleCount]);

  const totalModules = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Modules</CardTitle>
        <CardDescription>Number of modules available in the system</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {moduleCount === null ? (
          <div className="flex justify-center items-center h-[250px]">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
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
                dataKey="count"
                nameKey="name"
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
                            {totalModules.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Modules
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
{/*       <CardFooter className="flex justify-end text-sm">

        <Link href={'/admin/modules-data'}>
          <Button
            className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md"
          >
            View Analytics
          </Button>
        </Link>
      </CardFooter> */}
    </Card>
  );
}