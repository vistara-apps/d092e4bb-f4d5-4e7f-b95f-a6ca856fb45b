'use client';

import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { cn } from '@/lib/utils';
import { DataVizChartVariant } from '@/lib/types';

interface DataVizChartProps {
  variant?: DataVizChartVariant;
  data: any[];
  title?: string;
  height?: number;
  className?: string;
}

export function DataVizChart({
  variant = 'line',
  data,
  title,
  height = 300,
  className
}: DataVizChartProps) {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (variant) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
              className="text-xs fill-muted-foreground"
            />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
              className="text-xs fill-muted-foreground"
            />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Bar
              dataKey="value"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'heatmap':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
              className="text-xs fill-muted-foreground"
            />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--accent))"
              fill="hsl(var(--accent))"
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-lg border bg-card p-4 shadow-card',
        className
      )}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {data.length === 0 && (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium">No data available</p>
            <p className="text-sm">Data will appear here once collected</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

