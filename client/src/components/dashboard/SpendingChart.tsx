import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";

interface SpendingStatsByCategory {
  category: {
    name: string;
    color: string;
  };
  amount: string;
  percentage: number;
}

interface SpendingChartProps {
  month: number;
  year: number;
}

const SpendingChart: React.FC<SpendingChartProps> = ({ month, year }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  
  const { data: categories, isLoading } = useQuery<SpendingStatsByCategory[]>({
    queryKey: [`/api/stats/${year}/${month}/breakdown`],
  });

  // Prepare data for the chart
  const labels = categories?.map(c => c.category.name) || [];
  const values = categories?.map(c => parseFloat(c.amount)) || [];
  const backgroundColors = categories?.map(c => c.category.color) || [];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Spending by Category',
        data: values,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value;
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return ' $' + context.raw.toFixed(2);
          }
        }
      }
    },
  };

  return (
    <Card className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-medium text-dark">Monthly Spending by Category</h3>
        <div className="flex items-center space-x-2 text-xs">
          <span 
            className={`px-2 py-1 rounded-md ${timeframe === 'week' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'} cursor-pointer`}
            onClick={() => setTimeframe('week')}
          >
            Week
          </span>
          <span 
            className={`px-2 py-1 rounded-md ${timeframe === 'month' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'} cursor-pointer`}
            onClick={() => setTimeframe('month')}
          >
            Month
          </span>
          <span 
            className={`px-2 py-1 rounded-md ${timeframe === 'year' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'} cursor-pointer`}
            onClick={() => setTimeframe('year')}
          >
            Year
          </span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <span className="text-gray-400">Loading...</span>
        </div>
      ) : (
        <>
          <div className="w-full h-64">
            <BarChart data={chartData} options={chartOptions} />
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-3">
            {categories?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.category.color }}></div>
                <span className="text-xs text-gray-500">{item.category.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default SpendingChart;
