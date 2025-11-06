import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { API } from "@/hooks/getEnv";

export default function Orders() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get(`${API}/order`);
      return res.data;
    },
  });

  const { data: orderDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ["orderDetail", selectedOrderId],
    queryFn: async () => {
      const res = await axios.get(`${API}/order/${selectedOrderId}`);
      return res.data;
    },
    enabled: !!selectedOrderId,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const {
    totalOrders,
    statusCounts,
    data: orders,
  } = ordersData || {
    totalOrders: 0,
    statusCounts: {},
    data: [],
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header va Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer orders and track status
          </p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders table */}
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
            {orders?.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.id}</TableCell>
                <TableCell className="font-medium">{order.fullName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {order.phoneNumber}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.orderItems.map((item: any) => (
                      <div key={item.id} className="text-sm">
                        {item.nabor.name_uz} x{item.quantity}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  ${order.totalPrice.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge className={statusCounts[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    className="bg-gradient-primary"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6 border-border/50">
          <p className="text-sm font-medium text-muted-foreground">
            Total Orders
          </p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {totalOrders}
          </p>
        </Card>
        <Card className="p-6 border-border/50">
          <p className="text-sm font-medium text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {statusCounts.pending || 0}
          </p>
        </Card>
        <Card className="p-6 border-border/50">
          <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {statusCounts.confirmed || 0}
          </p>
        </Card>
        <Card className="p-6 border-border/50">
          <p className="text-sm font-medium text-muted-foreground">Shipped</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {statusCounts.shipped || 0}
          </p>
        </Card>
        <Card className="p-6 border-border/50">
          <p className="text-sm font-medium text-muted-foreground">Delivered</p>
          <p className="text-2xl font-bold text-foreground mt-2">
            {statusCounts.delivered || 0}
          </p>
        </Card>
      </div>

      {/* Modal */}
      <Dialog
        open={!!selectedOrderId}
        onOpenChange={() => setSelectedOrderId(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            {isDetailLoading ? (
              <Skeleton className="h-20 rounded-lg mt-2" />
            ) : (
              <DialogDescription className="space-y-2 mt-2">
                <p>
                  <strong>Customer:</strong> {orderDetail?.fullName}
                </p>
                <p>
                  <strong>Phone:</strong> {orderDetail?.phoneNumber}
                </p>
                <p>
                  <strong>Status:</strong> {orderDetail?.status}
                </p>
                <p>
                  <strong>Total:</strong> ${orderDetail?.totalPrice.toFixed(2)}
                </p>
                <div>
                  <strong>Items:</strong>
                  <ul className="list-disc list-inside">
                    {orderDetail?.orderItems.map((item: any) => (
                      <li key={item.id}>
                        {item.nabor.name_uz} x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setSelectedOrderId(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
