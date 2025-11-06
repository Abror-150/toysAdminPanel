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
import axios from "axios";
import { API } from "@/hooks/getEnv";

export default function AccessoriesList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Get all accessories
  const {
    data: accessories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["accessories"],
    queryFn: async () => {
      const res = await axios.get(`${API}/accessories`);
      return res.data?.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API}/accessories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessories"] });
      toast.success("Accessory deleted successfully");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete accessory");
    },
  });

  const handleDelete = (id: string) => deleteMutation.mutate(id);

  if (isLoading) return <Skeleton className="h-96 rounded-xl p-6" />;
  if (isError)
    return <div className="p-6 text-red-500">Error loading accessories</div>;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Accessories</h1>
        <Button
          onClick={() => navigate("/accessories/new")}
          className="bg-gradient-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Accessory
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name (UZ)</TableHead>
              <TableHead>Name (RU)</TableHead>
              <TableHead>Name (EN)</TableHead>
              <TableHead>Nabor</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessories?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.name_uz}</TableCell>
                <TableCell>{item.name_ru}</TableCell>
                <TableCell>{item.name_en}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.nabor?.name_uz || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/accessories/${item.id}`)}
                      className="bg-gradient-primary"
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(item.id)}
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
              accessory.
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
