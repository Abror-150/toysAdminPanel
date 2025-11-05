import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function Accessories() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Accessories</h1>
          <p className="text-muted-foreground mt-1">Manage accessories for your nabors</p>
        </div>
      </div>

      <Card className="p-12 text-center">
        <Sparkles className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Accessories Management</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Accessories are managed within each Nabor. Edit a Nabor to add, modify, or remove accessories.
        </p>
      </Card>
    </div>
  );
}
