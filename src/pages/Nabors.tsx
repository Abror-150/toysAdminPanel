import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Grid, List } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { naborApi } from "@/services/api";
import { Nabor } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { API } from "@/hooks/getEnv";

export default function Nabors() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: nabors, isLoading } = useQuery({
    queryKey: ["nabors"],
    queryFn: async () => {
      const res = await axios.get(`${API}/nabor`);
      console.log(res.data);

      return res.data?.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${API}/nabor/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nabors"] });
      toast.success("Nabor deleted successfully");
      setDeleteId(null);
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Failed to delete nabor");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nabors</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product collection
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex rounded-lg border border-border bg-card">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={() => navigate("/nabors/new")}
            className="bg-gradient-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Nabor
          </Button>
        </div>
      </div>

      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nabors?.map((nabor: any) => (
            <Card
              key={nabor.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={nabor.image}
                  alt={nabor.name_uz}
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
                  <h3 className="text-xl font-semibold text-foreground">
                    {nabor.name_uz}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {nabor.description_uz}
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
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteId(nabor.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {viewMode === "list" && (
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
              {nabors?.map((nabor: any) => (
                <TableRow key={nabor.id}>
                  <TableCell>
                    <img
                      src={nabor.image}
                      alt={nabor.name_uz}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{nabor.name_uz}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {nabor.description}
                  </TableCell>
                  <TableCell>
                    {nabor.has_manual ? (
                      <Badge className="bg-gradient-primary">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(nabor.createdAt).toLocaleDateString()}
                  </TableCell>
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
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(nabor.id)}
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
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ishongchingiz komilmi</AlertDialogTitle>
            <AlertDialogDescription>
              “Bu amalni bekor qilish mumkin emas. Bu nabor va unga tegishli
              barcha materiallar, aksessuarlar, mebellar va andozalarni doimiy
              ravishda o‘chirib tashlaydi.”
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              HA
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
