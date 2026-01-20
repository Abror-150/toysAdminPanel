import { useState } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Mail, Trash2, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { contactApi } from "@/services/api";
import { Contact } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export default function Contacts() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await axios.get(`${API}/contact`);
      console.log(res.data);
      return res.data;
    },
  });
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await axios.delete(`${API}/contact/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setSelectedContact(null);
    },
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Contact xabarlar
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Hammasi: {contacts?.totalContacts || 0}
          </span>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message Preview</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts?.data?.map((contact: any) => (
              <TableRow
                key={contact.id}
                className={!contact.isRead ? "bg-accent/30" : ""}
              >
                <TableCell>
                  {contact.isRead ? (
                    <Badge variant="outline" className="gap-1">
                      <Check className="w-3 h-3" />
                      Read
                    </Badge>
                  ) : (
                    <Badge className="bg-gradient-primary">New</Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {contact.email}
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {contact.message}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedContact(contact)}
                      className="bg-gradient-primary"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteContact(contact)}
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

      <Dialog
        open={!!deleteContact}
        onOpenChange={() => setDeleteContact(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              Do you really want to delete the message from{" "}
              {deleteContact?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteContact(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteContact?.id && deleteMutation.mutate(deleteContact.id);
                setDeleteContact(null);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
