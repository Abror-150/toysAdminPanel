import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MaterialType } from '@/types';

export default function MaterialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [type, setType] = useState<MaterialType>('TRIKOTAJ');
  const [description, setDescription] = useState('');
  const [naborId, setNaborId] = useState('');

  const { data: material, isLoading } = useQuery({
    queryKey: ['material', id],
    queryFn: async () => {
      if (!id) return null;
      return {
        id,
        type: 'TRIKOTAJ' as MaterialType,
        description: 'Sample material',
        naborId: '1',
      };
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
    if (material) {
      setType(material.type);
      setDescription(material.description);
      setNaborId(material.naborId);
    }
  }, [material]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      // In production: await api.post/put
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success(isEdit ? 'Material updated successfully' : 'Material created successfully');
      navigate('/materials');
    },
    onError: () => {
      toast.error('Failed to save material');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!naborId || !description.trim()) {
      toast.error('All fields are required');
      return;
    }

    saveMutation.mutate({ type, description, naborId });
  };

  if (isEdit && isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/materials')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? 'Edit Material' : 'Add Material'}
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
            <Label htmlFor="type">Type *</Label>
            <Select value={type} onValueChange={(v) => setType(v as MaterialType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TRIKOTAJ">TRIKOTAJ</SelectItem>
                <SelectItem value="ASTARLIK">ASTARLIK</SelectItem>
                <SelectItem value="PAXTALIK">PAXTALIK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter material description"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => navigate('/materials')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary" disabled={saveMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? 'Saving...' : 'Save Material'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
