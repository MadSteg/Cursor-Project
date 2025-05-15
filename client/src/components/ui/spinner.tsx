import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full",
        className
      )}
      aria-label="Loading"
    />
  );
}