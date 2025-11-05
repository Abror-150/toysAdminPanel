import { useQuery } from '@tanstack/react-query';
import { Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { orderApi } from '@/services/api';
import { Order } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    phone: '+1 234 567 8900',
    totalPrice: 299.99,
    status: 'completed',
    createdAt: '2024-06-15T10:30:00Z',
    items: [
      { id: '1', naborName: 'Classic Mahidoll', quantity: 1, price: 299.99 }
    ],
  },
  {
    id: '2',
    customerName: 'Michael Chen',
    phone: '+1 234 567 8901',
    totalPrice: 599.98,
    status: 'processing',
    createdAt: '2024-06-14T15:20:00Z',
    items: [
      { id: '2', naborName: 'Premium Collection', quantity: 2, price: 299.99 }
    ],
  },
  {
    id: '3',
    customerName: 'Emma Williams',
    phone: '+1 234 567 8902',
    totalPrice: 449.99,
    status: 'pending',
    createdAt: '2024-06-13T09:15:00Z',
    items: [
      { id: '3', naborName: 'Deluxe Edition', quantity: 1, price: 449.99 }
    ],
  },
];

const statusColors = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export default function Orders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      // In production: const response = await orderApi.getAll();
      // return response.data;
      return mockOrders;
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
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders and track status</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">#{order.id}</TableCell>
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell className="text-muted-foreground">{order.phone}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.items.map(item => (
                      <div key={item.id} className="text-sm">
                        {item.naborName} x{item.quantity}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  ${order.totalPrice.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" className="bg-gradient-primary">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-border/50">
          <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold text-foreground mt-2">{orders?.length || 0}</p>
        </Card>
        <Card className="p-6 border-border/50">
          <p className="text-sm font-medium text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {orders?.filter(o => o.status === 'pending').length || 0}
          </p>
        </Card>
        <Card className="p-6 border-border/50">
          <p className="text-sm font-medium text-muted-foreground">Processing</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {orders?.filter(o => o.status === 'processing').length || 0}
          </p>
        </Card>
        <Card className="p-6 border-border/50">
          <p className="text-sm font-medium text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {orders?.filter(o => o.status === 'completed').length || 0}
          </p>
        </Card>
      </div>
    </div>
  );
}
