import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function Andozalar() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Andozalar</h1>
          <p className="text-muted-foreground mt-1">Manage andozalar for your nabors</p>
        </div>
      </div>

      <Card className="p-12 text-center">
        <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Andozalar Management</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Andozalar are managed within each Nabor. Edit a Nabor to add, modify, or remove andozalar.
        </p>
      </Card>
    </div>
  );
}
