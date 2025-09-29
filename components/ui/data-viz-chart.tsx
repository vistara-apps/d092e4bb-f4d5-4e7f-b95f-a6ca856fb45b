'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { ChartDataPoint } from '@/lib/types';

interface DataVizChartProps {
  data: ChartDataPoint[];
  variant?: 'line' | 'bar' | 'area' | 'heatmap';
  title?: string;
  className?: string;
  height?: number;
  colors?: string[];
}

const defaultColors = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#06b6d4', // cyan
];

export function DataVizChart({
  data,
  variant = 'line',
  title,
  className,
  height = 300,
  colors = defaultColors
}: DataVizChartProps) {
  const chartData = useMemo(() => {
    return data.map((point, index) => ({
      ...point,
      formattedTimestamp: point.timestamp.toLocaleDateString(),
      color: colors[index % colors.length]
    }));
  }, [data, colors]);

  const renderChart = () => {
    switch (variant) {
      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="formattedTimestamp"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="formattedTimestamp"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Bar
              dataKey="value"
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'heatmap':
        // For heatmap, we'll use a simplified grid representation
        return (
          <div className="grid grid-cols-7 gap-1">
            {chartData.slice(0, 28).map((point, index) => (
              <div
                key={index}
                className={cn(
                  'aspect-square rounded-sm flex items-center justify-center text-xs font-medium',
                  point.value > 75 ? 'bg-red-500 text-white' :
                  point.value > 50 ? 'bg-orange-500 text-white' :
                  point.value > 25 ? 'bg-yellow-500 text-black' :
                  'bg-green-500 text-white'
                )}
                title={`${point.label || point.formattedTimestamp}: ${point.value}`}
              >
                {point.value}
              </div>
            ))}
          </div>
        );

      default: // line
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="formattedTimestamp"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Specialized component for flood risk visualization
interface FloodRiskChartProps {
  riskData: Array<{
    timestamp: Date;
    riskLevel: string;
    probability: number;
  }>;
  className?: string;
}

export function FloodRiskChart({ riskData, className }: FloodRiskChartProps) {
  const chartData = useMemo(() => {
    return riskData.map(point => ({
      timestamp: point.timestamp.toLocaleDateString(),
      risk: point.probability,
      level: point.riskLevel
    }));
  }, [riskData]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'extreme': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#2563eb';
      case 'none': return '#16a34a';
      default: return '#6b7280';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <h3 className="text-lg font-semibold mb-4">Flood Risk Over Time</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="timestamp"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Risk %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value}%`,
                `Risk Level: ${props.payload.level}`
              ]}
            />
            <Area
              type="monotone"
              dataKey="risk"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

