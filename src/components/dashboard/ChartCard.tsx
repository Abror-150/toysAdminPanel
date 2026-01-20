import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  description?: string;
}

export function ChartCard({ title, children, description }: ChartCardProps) {
  return (
    <Card className="p-4 sm:p-6 border-border/50">
      <div className="space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="h-56 sm:h-80 w-full overflow-x-auto">{children}</div>
      </div>
    </Card>
  );
}
