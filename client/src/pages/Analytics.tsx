import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, DoughnutChart } from "@/components/ui/chart";
import { Calendar } from "lucide-react";

const Analytics: React.FC = () => {
  // Get current date info for defaults
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  const [month, setMonth] = useState(currentMonth.toString());
  const [year, setYear] = useState(currentYear.toString());
  
  // Get spending stats by category
  const { data: categoryBreakdown } = useQuery<any[]>({
    queryKey: [`/api/stats/${year}/${month}/breakdown`],
  });
  
  // Get monthly spending for the selected year
  const { data: monthlySpending } = useQuery<{month: number, total: string}[]>({
    queryKey: [`/api/stats/${year}/monthly`],
  });
  
  // Prepare data for charts
  // Category Breakdown (Doughnut Chart)
  const categoryData = {
    labels: categoryBreakdown?.map(item => item.category.name) || [],
    datasets: [
      {
        data: categoryBreakdown?.map(item => item.percentage) || [],
        backgroundColor: categoryBreakdown?.map(item => item.category.color) || [],
        borderWidth: 1,
        borderColor: "transparent",
      },
    ],
  };
  
  // Monthly Spending (Bar Chart)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthlyData = {
    labels: monthlySpending?.map(m => monthNames[m.month - 1]) || [],
    datasets: [
      {
        label: 'Monthly Spending',
        data: monthlySpending?.map(m => parseFloat(m.total)) || [],
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        borderWidth: 1,
      }
    ],
  };
  
  // Category Spending by Month (Line Chart)
  const categoryColors = categoryBreakdown?.map(item => item.category.color) || [];
  const categoryNames = categoryBreakdown?.map(item => item.category.name) || [];
  
  // This would normally fetch detailed month-by-month data per category
  // For demo, we'll generate random data
  const generateRandomData = (months: number, seed: number) => {
    return Array.from({ length: months }, (_, i) => 100 + Math.sin(i * seed) * 50 + Math.random() * 50);
  };
  
  const categoryTrendData = {
    labels: monthNames,
    datasets: categoryNames.map((name, index) => ({
      label: name,
      data: generateRandomData(12, index + 1),
      borderColor: categoryColors[index],
      backgroundColor: 'transparent',
      tension: 0.4,
    })),
  };

  return (
    <main className="flex-grow">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-dark">Spending Analytics</h2>
            <p className="text-sm text-gray-500 mt-1">Detailed analysis of your purchase patterns</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="w-32">
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((name, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-24">
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <BarChart data={monthlyData} options={{
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
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              return ' $' + context.raw.toFixed(2);
                            }
                          }
                        }
                      },
                    }} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <DoughnutChart data={categoryData} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '70%',
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              return ` ${context.label}: ${context.raw}%`;
                            }
                          }
                        }
                      },
                    }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {categoryBreakdown?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.category.color }}></div>
                        <span className="text-xs">{item.category.name}: {item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryBreakdown?.map((item, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-2" style={{ backgroundColor: item.category.color }}></div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{item.category.name}</h3>
                          <span className="text-sm font-bold">${parseFloat(item.amount).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{item.percentage}% of total spending</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <LineChart data={categoryTrendData} options={{
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
                      tooltip: {
                        callbacks: {
                          label: function(context: any) {
                            return ` ${context.dataset.label}: $${context.raw.toFixed(2)}`;
                          }
                        }
                      }
                    },
                  }} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Analytics;
