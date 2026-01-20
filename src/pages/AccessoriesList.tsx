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
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Accessories
        </h1>
        <Button
          onClick={() => navigate("/accessories/new")}
          className="bg-gradient-primary w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Accessory
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap text-sm">
                Name (UZ)
              </TableHead>
              <TableHead className="whitespace-nowrap text-sm">
                Name (RU)
              </TableHead>
              <TableHead className="whitespace-nowrap text-sm">
                Name (EN)
              </TableHead>
              <TableHead className="whitespace-nowrap text-sm">Nabor</TableHead>
              <TableHead className="whitespace-nowrap text-right text-sm">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessories?.map((item: any) => (
              <TableRow key={item.id} className="align-top">
                <TableCell className="truncate max-w-[120px] text-sm">
                  {item.name_uz}
                </TableCell>
                <TableCell className="truncate max-w-[120px] text-sm">
                  {item.name_ru}
                </TableCell>
                <TableCell className="truncate max-w-[120px] text-sm">
                  {item.name_en}
                </TableCell>
                <TableCell className="truncate max-w-[100px] text-muted-foreground text-sm">
                  {item.nabor?.name_uz || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap sm:flex-row justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/accessories/${item.id}`)}
                      className="bg-gradient-primary w-full sm:w-auto text-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(item.id)}
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
