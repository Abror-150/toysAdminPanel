import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { MaterialType } from "@/types";
import axios from "axios";
import { API } from "@/hooks/getEnv";

export default function MaterialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [form, setForm] = useState({
    naborId: "",
    type: "TRIKOTAJ" as MaterialType,
    description_uz: "",
    description_ru: "",
    description_en: "",
  });

  const { data: material, isLoading } = useQuery({
    queryKey: ["material", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axios.get(`${API}/materials/${id}`);
      return res.data;
    },
    enabled: isEdit,
  });

  const { data: nabors } = useQuery({
    queryKey: ["nabors"],
    queryFn: async () => {
      const res = await axios.get(`${API}/nabor`);
      return res.data?.data;
    },
  });

  useEffect(() => {
    if (material) {
      setForm({
        naborId: material.naborId,
        type: material.type,
        description_uz: material.description_uz || "",
        description_ru: material.description_ru || "",
        description_en: material.description_en || "",
      });
    }
  }, [material]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEdit) {
        return axios.patch(`${API}/materials/${id}`, data);
      } else {
        return axios.post(`${API}/materials`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success(
        isEdit
          ? "Material updated successfully"
          : "Material created successfully"
      );
      navigate("/materials");
    },
    onError: () => {
      toast.error("Failed to save material");
    },
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.naborId || !form.description_uz.trim()) {
      toast.error("All fields are required");
      return;
    }

    saveMutation.mutate(form);
  };

  if (isEdit && isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/materials")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? "Edit Material" : "Add Material"}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nabor">Nabor *</Label>
            <Select
              value={form.naborId}
              onValueChange={(v) => handleChange("naborId", v)}
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

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              value={form.type}
              onValueChange={(v) => handleChange("type", v)}
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

          {/* Description multilingual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["uz", "ru", "en"].map((lang) => (
              <div key={lang}>
                <Label>Description ({lang.toUpperCase()}) *</Label>
                <Textarea
                  value={form[`description_${lang}`]}
                  onChange={(e) =>
                    handleChange(`description_${lang}`, e.target.value)
                  }
                  placeholder={`Description in ${lang.toUpperCase()}`}
                  rows={3}
                  required
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/materials")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary"
              disabled={saveMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? "Saving..." : "Save Material"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
