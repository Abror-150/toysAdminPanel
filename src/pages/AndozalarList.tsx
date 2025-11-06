// AndozalarList.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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

export default function AndozalarList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: andozalar, isLoading } = useQuery({
    queryKey: ["andozalar"],
    queryFn: async () => {
      const res = await axios.get(`${API}/andozalar`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API}/andozalar/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["andozalar"] });
      toast.success("Andoza deleted successfully");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete andoza"),
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-bold text-foreground">Andozalar</h1>{" "}
          <p className="text-muted-foreground mt-1">
            Manage templates across all nabors
          </p>{" "}
        </div>
        <Button
          onClick={() => navigate("/andozalar/new")}
          className="bg-gradient-primary"
        >
          {" "}
          <Plus className="w-4 h-4 mr-2" />
          Add Andoza{" "}
        </Button>{" "}
      </div>
      ```
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
            {andozalar?.map((andoza: any) => (
              <TableRow key={andoza.id}>
                <TableCell>{andoza.name_uz}</TableCell>
                <TableCell>{andoza.name_ru}</TableCell>
                <TableCell>{andoza.name_en}</TableCell>
                <TableCell>{andoza.naborName}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/andozalar/${andoza.id}`)}
                      className="bg-gradient-primary"
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(andoza.id)}
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
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              andoza.
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
