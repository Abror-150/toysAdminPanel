import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { naborApi } from '@/services/api';
import { Nabor } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data
const mockNabors: Nabor[] = [
  {
    id: '1',
    name: 'Classic Mahidoll',
    description: 'Traditional design with premium materials',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    has_manual: true,
    createdAt: '2024-01-15',
    materials: [],
    accessories: [],
    furnitures: [],
    andozalar: [],
  },
  {
    id: '2',
    name: 'Premium Collection',
    description: 'Luxury edition with exclusive accessories',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
    has_manual: false,
    createdAt: '2024-02-20',
    materials: [],
    accessories: [],
    furnitures: [],
    andozalar: [],
  },
  {
    id: '3',
    name: 'Deluxe Edition',
    description: 'Complete set with all furniture and accessories',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400',
    has_manual: true,
    createdAt: '2024-03-10',
    materials: [],
    accessories: [],
    furnitures: [],
    andozalar: [],
  },
];

export default function Nabors() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: nabors, isLoading } = useQuery({
    queryKey: ['nabors'],
    queryFn: async () => {
      // In production: const response = await naborApi.getAll();
      // return response.data;
      return mockNabors;
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nabors</h1>
          <p className="text-muted-foreground mt-1">Manage your product collection</p>
        </div>
        <div className="flex gap-3">
          <div className="flex rounded-lg border border-border bg-card">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={() => navigate('/nabors/new')} className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Nabor
          </Button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nabors?.map((nabor) => (
            <Card key={nabor.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={nabor.image}
                  alt={nabor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {nabor.has_manual && (
                  <Badge className="absolute top-3 right-3 bg-gradient-primary">
                    Has Manual
                  </Badge>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{nabor.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {nabor.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/nabors/${nabor.id}`)}
                    className="flex-1 bg-gradient-primary"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Manual</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nabors?.map((nabor) => (
                <TableRow key={nabor.id}>
                  <TableCell>
                    <img
                      src={nabor.image}
                      alt={nabor.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{nabor.name}</TableCell>
                  <TableCell className="max-w-md truncate">{nabor.description}</TableCell>
                  <TableCell>
                    {nabor.has_manual ? (
                      <Badge className="bg-gradient-primary">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(nabor.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/nabors/${nabor.id}`)}
                        className="bg-gradient-primary"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
