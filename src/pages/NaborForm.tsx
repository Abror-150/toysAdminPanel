import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { naborApi } from "@/services/api";

export default function NaborForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;
  const formatNumber = (value: number | string) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const [form, setForm] = useState({
    name_uz: "",
    name_ru: "",
    name_en: "",
    price: null,
    description_uz: "",
    description_ru: "",
    description_en: "",
    image: "",
    has_manual: false,
  });

  const { data: nabor, isLoading } = useQuery({
    queryKey: ["nabor", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await naborApi.getById(id);
      return res.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (nabor) {
      setForm({
        name_uz: nabor.name_uz || "",
        name_ru: nabor.name_ru || "",
        name_en: nabor.name_en || "",
        price: nabor.price,
        description_uz: nabor.description_uz || "",
        description_ru: nabor.description_ru || "",
        description_en: nabor.description_en || "",
        image: nabor.image || "",
        has_manual: nabor.has_manual || false,
      });
    }
  }, [nabor]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEdit) return await naborApi.update(id, data);
      return await naborApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nabors"] });
      toast.success(
        isEdit ? "Nabor updated successfully" : "Nabor created successfully"
      );
      navigate("/nabors");
    },
    onError: () => {
      toast.error("Failed to save nabor");
    },
  });
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    setForm((prev) => ({ ...prev, price: formatted }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    saveMutation.mutate({
      ...form,
      price: Number(form.price?.toString().replace(/\s/g, "") || 0),
    });
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await naborApi.uploadImage(formData);
      console.log(res.data, "asdgasd");
      setForm((prev) => ({ ...prev, image: res.data?.compressed }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  if (isEdit && isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/nabors")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Nabor" : "Create Nabor"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? "Update nabor info"
              : "Add new nabor with multilingual fields"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <Tabs defaultValue="basic">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["uz", "ru", "en"].map((lang) => (
                  <div key={lang}>
                    <Label>Name ({lang.toUpperCase()})</Label>
                    <Input
                      value={form[`name_${lang}`]}
                      onChange={(e) =>
                        handleChange(`name_${lang}`, e.target.value)
                      }
                      placeholder={`Name in ${lang.toUpperCase()}`}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["uz", "ru", "en"].map((lang) => (
                  <div key={lang}>
                    <Label>Description ({lang.toUpperCase()})</Label>
                    <Textarea
                      value={form[`description_${lang}`]}
                      onChange={(e) =>
                        handleChange(`description_${lang}`, e.target.value)
                      }
                      placeholder={`Description in ${lang.toUpperCase()}`}
                      rows={3}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="text"
                  value={form.price ?? ""}
                  onChange={handlePriceChange}
                  placeholder="Enter price"
                />
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                />
                {form.image && (
                  <img
                    src={form.image}
                    alt="preview"
                    className="w-40 h-40 object-cover rounded-lg mt-2"
                  />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={form.has_manual}
                  onCheckedChange={(v) => handleChange("has_manual", v)}
                />
                <Label>Has Manual</Label>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/nabors")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="bg-gradient-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveMutation.isPending ? "Saving..." : "Save Nabor"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
