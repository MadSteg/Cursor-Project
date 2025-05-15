import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: "default" | "primary" | "secondary" | "muted";
};

/**
 * Simple loading spinner component
 */
export function Spinner({ 
  size = "md", 
  className = "",
  color = "default" 
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };
  
  const colorClasses = {
    default: "border-t-foreground",
    primary: "border-t-primary",
    secondary: "border-t-secondary",
    muted: "border-t-muted-foreground",
  };
  
  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-t-transparent", 
        sizeClasses[size],
        colorClasses[color],
        className
      )} 
      aria-label="Loading"
    />
  );
}