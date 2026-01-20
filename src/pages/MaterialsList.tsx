import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
import { materialsApi } from "@/services/materialApi";

const materialTypeColors = {
  TRIKOTAJ: "bg-blue-500",
  ASTARLIK: "bg-green-500",
  PAXTALIK: "bg-purple-500",
};

export default function MaterialsList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: materials,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["materials"],
    queryFn: materialsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: materialsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material deleted successfully");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete material");
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

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Error loading materials. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Materials
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage materials across all nabors
          </p>
        </div>

        {/* Add button */}
        <Button
          onClick={() => navigate("/materials/new")}
          className="bg-gradient-primary w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap text-sm">Type</TableHead>
              <TableHead className="whitespace-nowrap text-sm">
                Description (UZ)
              </TableHead>
              <TableHead className="whitespace-nowrap text-sm">Nabor</TableHead>
              <TableHead className="text-right whitespace-nowrap text-sm">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials?.map((material: any) => (
              <TableRow key={material.id} className="align-top">
                <TableCell className="truncate max-w-[80px] text-sm">
                  {material.type}
                </TableCell>
                <TableCell className="truncate max-w-[150px] text-sm">
                  {material.description_uz || material.description_en}
                </TableCell>
                <TableCell className="truncate max-w-[120px] text-sm">
                  {material.nabor?.name_uz || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap sm:flex-row justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/materials/${material.id}`)}
                      className="bg-gradient-primary w-full sm:w-auto text-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(material.id)}
                      className="w-full sm:w-auto text-sm"
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
              This action cannot be undone. This will permanently delete the
              material.
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
