// FurnitureForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { API } from "@/hooks/getEnv";

export default function FurnitureForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [form, setForm] = useState({
    naborId: "",
    name_uz: "",
    name_ru: "",
    name_en: "",
  });

  const { data: furniture, isLoading } = useQuery({
    queryKey: ["furniture", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axios.get(`${API}/furnitures/${id}`);
      return res.data;
    },
    enabled: isEdit,
  });

  const { data: nabors } = useQuery({
    queryKey: ["nabors"],
    queryFn: async () => {
      const res = await axios.get(`${API}/nabors`);
      return res.data?.data;
    },
  });

  useEffect(() => {
    if (furniture) {
      setForm({
        naborId: furniture.naborId,
        name_uz: furniture.name_uz || "",
        name_ru: furniture.name_ru || "",
        name_en: furniture.name_en || "",
      });
    }
  }, [furniture]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEdit) {
        await axios.patch(`${API}/furnitures/${id}`, data);
      } else {
        await axios.post(`${API}/furnitures`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["furnitures"] });
      toast.success(
        isEdit
          ? "Furniture updated successfully"
          : "Furniture created successfully"
      );
      navigate("/furnitures");
    },
    onError: () => toast.error("Failed to save furniture"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.naborId ||
      !form.name_uz.trim() ||
      !form.name_ru.trim() ||
      !form.name_en.trim()
    ) {
      toast.error("All fields are required");
      return;
    }
    saveMutation.mutate(form);
  };

  if (isEdit && isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {" "}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/furnitures")}
        >
          {" "}
          <ArrowLeft className="w-5 h-5" />{" "}
        </Button>{" "}
        <h1 className="text-3xl font-bold text-foreground">
          {isEdit ? "Edit Furniture" : "Add Furniture"}
        </h1>{" "}
      </div>
      ```
      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Nabor *</Label>
            <Select
              value={form.naborId}
              onValueChange={(v) => setForm({ ...form, naborId: v })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a nabor" />
              </SelectTrigger>
              <SelectContent>
                {nabors?.map((nabor: any) => (
                  <SelectItem key={nabor.id} value={nabor.id}>
                    {nabor.name_uz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {["uz", "ru", "en"].map((lang) => (
            <div className="space-y-2" key={lang}>
              <Label>Name ({lang.toUpperCase()}) *</Label>
              <Input
                value={form[`name_${lang}`]}
                onChange={(e) =>
                  setForm({ ...form, [`name_${lang}`]: e.target.value })
                }
                placeholder={`Name in ${lang.toUpperCase()}`}
                required
              />
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/furnitures")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary"
              disabled={saveMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? "Saving..." : "Save Furniture"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
