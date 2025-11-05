import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data
const mockMaterials = [
  { id: '1', type: 'TRIKOTAJ', description: 'High quality cotton blend fabric', naborId: '1', naborName: 'Classic Mahidoll' },
  { id: '2', type: 'ASTARLIK', description: 'Soft lining material for comfort', naborId: '1', naborName: 'Classic Mahidoll' },
  { id: '3', type: 'PAXTALIK', description: 'Premium cotton padding', naborId: '2', naborName: 'Premium Collection' },
];

const materialTypeColors = {
  TRIKOTAJ: 'bg-blue-500',
  ASTARLIK: 'bg-green-500',
  PAXTALIK: 'bg-purple-500',
};

export default function MaterialsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: materials, isLoading } = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      // In production: const response = await api.get('/materials');
      // return response.data;
      return mockMaterials;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // In production: await api.delete(`/materials/${id}`);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success('Material deleted successfully');
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Failed to delete material');
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Materials</h1>
          <p className="text-muted-foreground mt-1">Manage materials across all nabors</p>
        </div>
        <Button onClick={() => navigate('/materials/new')} className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </Button>
      </div>

      {/* Materials Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Nabor</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials?.map((material) => (
              <TableRow key={material.id}>
                <TableCell>
                  <Badge className={materialTypeColors[material.type as keyof typeof materialTypeColors]}>
                    {material.type}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md">{material.description}</TableCell>
                <TableCell className="text-muted-foreground">{material.naborName}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/materials/${material.id}`)}
                      className="bg-gradient-primary"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(material.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the material.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
