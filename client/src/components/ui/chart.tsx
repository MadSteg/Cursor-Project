import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import { BarChart as RechartsBarChart, Bar as RechartsBar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

// Simple Bar Chart component using Recharts
export function SimpleBarChart({
  data,
  dataKey,
  xAxisKey,
  colors = ["#3B82F6"],
  className,
  height = 300,
}: {
  data: any[];
  dataKey: string;
  xAxisKey: string;
  colors?: string[];
  className?: string;
  height?: number;
}) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <RechartsTooltip />
          <RechartsBar dataKey={dataKey} fill={colors[0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Bar Chart component using Chart.js
export function BarChart({
  data,
  options,
  className,
}: {
  data: any;
  options?: any;
  className?: string;
}) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: options
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]);

  return (
    <div className={className}>
      <canvas ref={chartRef} />
    </div>
  );
}

// Line Chart component using Chart.js
export function LineChart({
  data,
  options,
  className,
}: {
  data: any;
  options?: any;
  className?: string;
}) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: data,
          options: options
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]);

  return (
    <div className={className}>
      <canvas ref={chartRef} />
    </div>
  );
}

// Pie Chart component using Chart.js
export function PieChart({
  data,
  options,
  className,
}: {
  data: any;
  options?: any;
  className?: string;
}) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'pie',
          data: data,
          options: options
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]);

  return (
    <div className={className}>
      <canvas ref={chartRef} />
    </div>
  );
}

// Doughnut Chart component using Chart.js
export function DoughnutChart({
  data,
  options,
  className,
}: {
  data: any;
  options?: any;
  className?: string;
}) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: data,
          options: options
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]);

  return (
    <div className={className}>
      <canvas ref={chartRef} />
    </div>
  );
}