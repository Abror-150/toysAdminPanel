import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { naborApi, materialApi, accessoryApi, furnitureApi, andozaApi } from '@/services/api';
import { toast } from 'sonner';
import { Material, Accessory, Furniture, Andoza, MaterialType } from '@/types';

export default function NaborForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [hasManual, setHasManual] = useState(false);
  
  const [materials, setMaterials] = useState<Partial<Material>[]>([]);
  const [accessories, setAccessories] = useState<Partial<Accessory>[]>([]);
  const [furnitures, setFurnitures] = useState<Partial<Furniture>[]>([]);
  const [andozalar, setAndozalar] = useState<Partial<Andoza>[]>([]);

  const { data: nabor, isLoading } = useQuery({
    queryKey: ['nabor', id],
    queryFn: async () => {
      if (!id) return null;
      // const response = await naborApi.getById(id);
      // return response.data;
      return {
        id,
        name: 'Sample Nabor',
        description: 'Sample description',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        has_manual: true,
        createdAt: '2024-01-15',
        materials: [],
        accessories: [],
        furnitures: [],
        andozalar: [],
      };
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (nabor) {
      setName(nabor.name);
      setDescription(nabor.description);
      setImage(nabor.image);
      setHasManual(nabor.has_manual);
      setMaterials(nabor.materials);
      setAccessories(nabor.accessories);
      setFurnitures(nabor.furnitures);
      setAndozalar(nabor.andozalar);
    }
  }, [nabor]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEdit) {
        return await naborApi.update(id, data);
      } else {
        return await naborApi.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nabors'] });
      toast.success(isEdit ? 'Nabor updated successfully' : 'Nabor created successfully');
      navigate('/nabors');
    },
    onError: () => {
      toast.error('Failed to save nabor');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    saveMutation.mutate({
      name,
      description,
      image,
      has_manual: hasManual,
      materials,
      accessories,
      furnitures,
      andozalar,
    });
  };

  const addMaterial = () => {
    setMaterials([...materials, { type: 'TRIKOTAJ', description: '' }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    setMaterials(updated);
  };

  const addAccessory = () => {
    setAccessories([...accessories, { name: '' }]);
  };

  const removeAccessory = (index: number) => {
    setAccessories(accessories.filter((_, i) => i !== index));
  };

  const updateAccessory = (index: number, name: string) => {
    const updated = [...accessories];
    updated[index] = { ...updated[index], name };
    setAccessories(updated);
  };

  const addFurniture = () => {
    setFurnitures([...furnitures, { name: '' }]);
  };

  const removeFurniture = (index: number) => {
    setFurnitures(furnitures.filter((_, i) => i !== index));
  };

  const updateFurniture = (index: number, name: string) => {
    const updated = [...furnitures];
    updated[index] = { ...updated[index], name };
    setFurnitures(updated);
  };

  const addAndoza = () => {
    setAndozalar([...andozalar, { name: '' }]);
  };

  const removeAndoza = (index: number) => {
    setAndozalar(andozalar.filter((_, i) => i !== index));
  };

  const updateAndoza = (index: number, name: string) => {
    const updated = [...andozalar];
    updated[index] = { ...updated[index], name };
    setAndozalar(updated);
  };

  if (isEdit && isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/nabors')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? 'Edit Nabor' : 'Create Nabor'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEdit ? 'Update nabor details and related items' : 'Add a new nabor to your collection'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
              <TabsTrigger value="furnitures">Furnitures</TabsTrigger>
              <TabsTrigger value="andozalar">Andozalar</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter nabor name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter nabor description"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {image && (
                    <img src={image} alt="Preview" className="w-48 h-48 object-cover rounded-lg mt-2" />
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="manual"
                    checked={hasManual}
                    onCheckedChange={setHasManual}
                  />
                  <Label htmlFor="manual">Has Manual</Label>
                </div>
              </div>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Materials</h3>
                <Button type="button" onClick={addMaterial} size="sm" className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Material
                </Button>
              </div>
              
              {materials.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No materials added yet</p>
              ) : (
                <div className="space-y-4">
                  {materials.map((material, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                              value={material.type}
                              onValueChange={(value) => updateMaterial(index, 'type', value as MaterialType)}
                            >
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
                            <Label>Description</Label>
                            <Textarea
                              value={material.description}
                              onChange={(e) => updateMaterial(index, 'description', e.target.value)}
                              placeholder="Enter material description"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeMaterial(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Accessories Tab */}
            <TabsContent value="accessories" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Accessories</h3>
                <Button type="button" onClick={addAccessory} size="sm" className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Accessory
                </Button>
              </div>
              
              {accessories.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No accessories added yet</p>
              ) : (
                <div className="space-y-4">
                  {accessories.map((accessory, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input
                            value={accessory.name}
                            onChange={(e) => updateAccessory(index, e.target.value)}
                            placeholder="Accessory name"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeAccessory(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Furnitures Tab */}
            <TabsContent value="furnitures" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Furnitures</h3>
                <Button type="button" onClick={addFurniture} size="sm" className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Furniture
                </Button>
              </div>
              
              {furnitures.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No furnitures added yet</p>
              ) : (
                <div className="space-y-4">
                  {furnitures.map((furniture, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input
                            value={furniture.name}
                            onChange={(e) => updateFurniture(index, e.target.value)}
                            placeholder="Furniture name"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeFurniture(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Andozalar Tab */}
            <TabsContent value="andozalar" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Andozalar</h3>
                <Button type="button" onClick={addAndoza} size="sm" className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Andoza
                </Button>
              </div>
              
              {andozalar.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No andozalar added yet</p>
              ) : (
                <div className="space-y-4">
                  {andozalar.map((andoza, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input
                            value={andoza.name}
                            onChange={(e) => updateAndoza(index, e.target.value)}
                            placeholder="Andoza name"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeAndoza(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={() => navigate('/nabors')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary" disabled={saveMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? 'Saving...' : 'Save Nabor'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
