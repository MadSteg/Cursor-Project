import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  changeValue?: number;
  changeText?: string;
  isPositiveChange?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  changeValue,
  changeText,
  isPositiveChange = true,
}) => {
  return (
    <Card className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className={`w-8 h-8 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-dark">{value}</p>
      {changeValue !== undefined && changeText && (
        <div className={`flex items-center mt-2 text-xs ${isPositiveChange ? 'text-success' : 'text-error'}`}>
          {isPositiveChange ? (
            <ArrowUp className="mr-1 h-3 w-3" />
          ) : (
            <ArrowDown className="mr-1 h-3 w-3" />
          )}
          <span>{changeValue}% {changeText}</span>
        </div>
      )}
    </Card>
  );
};

export default StatsCard;
