import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, DollarSign, MessageSquare, Plus, Eye } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from '@/components/ui/button';
import { statsApi } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data for demo purposes
const mockDashboardStats = {
  totalNabors: 24,
  totalOrders: 142,
  monthlyRevenue: 28500,
  totalMessages: 18,
};

const mockMonthlyData = [
  { month: 'Jan', revenue: 12000, orders: 45 },
  { month: 'Feb', revenue: 15000, orders: 52 },
  { month: 'Mar', revenue: 18000, orders: 58 },
  { month: 'Apr', revenue: 22000, orders: 68 },
  { month: 'May', revenue: 25000, orders: 75 },
  { month: 'Jun', revenue: 28500, orders: 82 },
];

const mockTopNabors = [
  { name: 'Nabor Classic', value: 45, color: 'hsl(var(--chart-1))' },
  { name: 'Nabor Premium', value: 30, color: 'hsl(var(--chart-2))' },
  { name: 'Nabor Deluxe', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'Others', value: 10, color: 'hsl(var(--chart-4))' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // In production, use: const response = await statsApi.getDashboard();
      // return response.data;
      return mockDashboardStats;
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to Mahidolls Admin Panel</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/nabors/new')} className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Nabor
          </Button>
          <Button variant="outline" onClick={() => navigate('/contacts')}>
            <Eye className="w-4 h-4 mr-2" />
            View Contacts
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Nabors"
          value={stats?.totalNabors || 0}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingCart}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${stats?.monthlyRevenue.toLocaleString() || 0}`}
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Messages"
          value={stats?.totalMessages || 0}
          icon={MessageSquare}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Revenue" description="Revenue trend over the last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-1))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders per Month" description="Order count trend">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="orders" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Selling Nabors" description="Distribution of sales by product">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockTopNabors}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="hsl(var(--chart-1))"
                dataKey="value"
              >
                {mockTopNabors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Quick Actions" description="Manage your store">
          <div className="h-full flex flex-col justify-center gap-4 p-6">
            <Button 
              onClick={() => navigate('/nabors/new')}
              className="w-full h-12 bg-gradient-primary text-base"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Nabor
            </Button>
            <Button 
              onClick={() => navigate('/orders')}
              variant="outline"
              className="w-full h-12 text-base"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              View All Orders
            </Button>
            <Button 
              onClick={() => navigate('/contacts')}
              variant="outline"
              className="w-full h-12 text-base"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Check Messages
            </Button>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
