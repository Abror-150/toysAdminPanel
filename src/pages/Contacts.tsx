import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Trash2, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { contactApi } from '@/services/api';
import { Contact } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    message: 'I am interested in the Premium Collection. Can you provide more details about the materials used?',
    createdAt: '2024-06-15T10:30:00Z',
    isRead: false,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    message: 'When will the Deluxe Edition be back in stock? I have been waiting for a while.',
    createdAt: '2024-06-14T15:20:00Z',
    isRead: true,
  },
  {
    id: '3',
    name: 'Emma Williams',
    email: 'emma.w@example.com',
    message: 'I received my order yesterday. Everything looks great! Thank you for the excellent packaging.',
    createdAt: '2024-06-13T09:15:00Z',
    isRead: true,
  },
];

export default function Contacts() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      // In production: const response = await contactApi.getAll();
      // return response.data;
      return mockContacts;
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-muted-foreground mt-1">
            {contacts?.filter(c => !c.isRead).length || 0} unread messages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Total: {contacts?.length || 0}
          </span>
        </div>
      </div>

      {/* Messages Table */}
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
            {contacts?.map((contact) => (
              <TableRow 
                key={contact.id}
                className={!contact.isRead ? 'bg-accent/30' : ''}
              >
                <TableCell>
                  {contact.isRead ? (
                    <Badge variant="outline" className="gap-1">
                      <Check className="w-3 h-3" />
                      Read
                    </Badge>
                  ) : (
                    <Badge className="bg-gradient-primary">
                      New
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell className="text-muted-foreground">{contact.email}</TableCell>
                <TableCell className="max-w-md truncate">{contact.message}</TableCell>
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
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message from {selectedContact?.name}</DialogTitle>
            <DialogDescription>
              {selectedContact?.email} • {selectedContact && new Date(selectedContact.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-foreground whitespace-pre-wrap">{selectedContact?.message}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {!selectedContact?.isRead && (
              <Button className="bg-gradient-primary">
                <Check className="w-4 h-4 mr-2" />
                Mark as Read
              </Button>
            )}
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
