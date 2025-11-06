import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  description?: string;
}

export function ChartCard({ title, children, description }: ChartCardProps) {
  return (
    <Card className="p-6 border-border/50">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="h-80">{children}</div>
      </div>
    </Card>
  );
}
