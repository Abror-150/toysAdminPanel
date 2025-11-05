import { Card } from '@/components/ui/card';
import { Layers } from 'lucide-react';

export default function Materials() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Materials</h1>
          <p className="text-muted-foreground mt-1">Manage materials for your nabors</p>
        </div>
      </div>

      <Card className="p-12 text-center">
        <Layers className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Materials Management</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Materials are managed within each Nabor. Edit a Nabor to add, modify, or remove materials.
        </p>
      </Card>
    </div>
  );
}
