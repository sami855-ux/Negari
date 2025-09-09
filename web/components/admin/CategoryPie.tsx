"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PieChart as PieChartIcon } from "lucide-react"

// Custom color palette
const COLORS = [
  "#0088FE", // blue
  "#00C49F", // teal
  "#FFBB28", // amber
  "#FF8042", // orange
  "#8884D8", // purple
  "#A4DE6C", // lime
  "#D0ED57", // yellow-green
  "#FF6B6B", // coral
]

const categoryData = [
  { name: "Infrastructure", value: 35 },
  { name: "Public Safety", value: 25 },
  { name: "Environmental", value: 20 },
  { name: "Noise Complaints", value: 12 },
  { name: "Other", value: 8 },
]

export function CategoryPieChart() {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-blue-600" />
          <span className="text-lg font-semibold text-gray-800">
            Report Categories
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ percent }) => (
                <text
                  x={0}
                  y={0}
                  dy={8}
                  textAnchor="middle"
                  fill="#374151"
                  fontSize={12}
                  fontWeight={500}
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              )}
              labelLine={false}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <p className="font-medium text-gray-900">
                        {payload[0].name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {payload[0].value} reports (
                        {((payload[0].payload.percent || 0) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: "16px",
              }}
              formatter={(value) => (
                <span className="text-xs text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
