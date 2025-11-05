import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AndozaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [name, setName] = useState('');
  const [naborId, setNaborId] = useState('');

  const { data: andoza, isLoading } = useQuery({
    queryKey: ['andoza', id],
    queryFn: async () => {
      if (!id) return null;
      return { id, name: 'Sample Andoza', naborId: '1' };
    },
    enabled: isEdit,
  });

  const { data: nabors } = useQuery({
    queryKey: ['nabors'],
    queryFn: async () => {
      return [
        { id: '1', name: 'Classic Mahidoll' },
        { id: '2', name: 'Premium Collection' },
      ];
    },
  });

  useEffect(() => {
    if (andoza) {
      setName(andoza.name);
      setNaborId(andoza.naborId);
    }
  }, [andoza]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['andozalar'] });
      toast.success(isEdit ? 'Andoza updated successfully' : 'Andoza created successfully');
      navigate('/andozalar');
    },
    onError: () => {
      toast.error('Failed to save andoza');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!naborId || !name.trim()) {
      toast.error('All fields are required');
      return;
    }

    saveMutation.mutate({ name, naborId });
  };

  if (isEdit && isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/andozalar')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? 'Edit Andoza' : 'Add Andoza'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nabor">Nabor *</Label>
            <Select value={naborId} onValueChange={setNaborId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a nabor" />
              </SelectTrigger>
              <SelectContent>
                {nabors?.map((nabor) => (
                  <SelectItem key={nabor.id} value={nabor.id}>
                    {nabor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter andoza name"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => navigate('/andozalar')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary" disabled={saveMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? 'Saving...' : 'Save Andoza'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
