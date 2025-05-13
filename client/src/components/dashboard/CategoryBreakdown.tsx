import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DoughnutChart } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";

interface Category {
  category: {
    name: string;
    color: string;
    icon: string;
  };
  amount: string;
  percentage: number;
}

interface CategoryBreakdownProps {
  month: number;
  year: number;
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ month, year }) => {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: [`/api/stats/${year}/${month}/breakdown`],
  });

  // Prepare data for chart
  const chartData = {
    labels: categories?.map(item => item.category.name) || [],
    datasets: [
      {
        data: categories?.map(item => item.percentage) || [],
        backgroundColor: categories?.map(item => item.category.color) || [],
        borderWidth: 1,
        borderColor: "transparent",
      },
    ],
  };

  const chartOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return ` ${context.label}: ${context.raw}%`;
          }
        }
      }
    },
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-base font-medium text-dark mb-6">Category Breakdown</h3>
      
      {isLoading ? (
        <div className="w-full h-48 flex items-center justify-center">
          <span className="text-gray-400">Loading...</span>
        </div>
      ) : (
        <>
          <div className="w-full h-48 flex items-center justify-center mb-6">
            <DoughnutChart data={chartData} options={chartOptions} />
          </div>
          
          <div className="space-y-3">
            {categories?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.category.color }}></div>
                  <span className="text-sm text-gray-700">{item.category.name}</span>
                </div>
                <div className="text-sm font-medium">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default CategoryBreakdown;
