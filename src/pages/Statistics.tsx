import { useQuery } from '@tanstack/react-query';
import { Download, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { statsApi } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data
const mockYearlyData = [
  { month: 'Jan', revenue: 12000, orders: 45, customers: 32 },
  { month: 'Feb', revenue: 15000, orders: 52, customers: 38 },
  { month: 'Mar', revenue: 18000, orders: 58, customers: 45 },
  { month: 'Apr', revenue: 22000, orders: 68, customers: 52 },
  { month: 'May', revenue: 25000, orders: 75, customers: 60 },
  { month: 'Jun', revenue: 28500, orders: 82, customers: 68 },
  { month: 'Jul', revenue: 31000, orders: 90, customers: 75 },
  { month: 'Aug', revenue: 29500, orders: 85, customers: 72 },
  { month: 'Sep', revenue: 33000, orders: 95, customers: 80 },
  { month: 'Oct', revenue: 36000, orders: 102, customers: 88 },
  { month: 'Nov', revenue: 39000, orders: 110, customers: 95 },
  { month: 'Dec', revenue: 42000, orders: 120, customers: 105 },
];

const totalRevenue = mockYearlyData.reduce((sum, item) => sum + item.revenue, 0);
const totalOrders = mockYearlyData.reduce((sum, item) => sum + item.orders, 0);

export default function Statistics() {
  const { data: monthlyStats, isLoading } = useQuery({
    queryKey: ['monthly-stats'],
    queryFn: async () => {
      // In production: const response = await statsApi.getMonthly();
      // return response.data;
      return mockYearlyData;
    },
  });

  const handleExport = (format: 'csv' | 'pdf') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

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
          <h1 className="text-3xl font-bold text-foreground">Statistics & Reports</h1>
          <p className="text-muted-foreground mt-1">Comprehensive analytics for your business</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-border/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue (Year)</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                ${totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">+24% from last year</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders (Year)</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {totalOrders.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">+18% from last year</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                ${Math.round(totalRevenue / totalOrders).toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">+5% from last year</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <ChartCard 
          title="Revenue & Orders Trend" 
          description="Yearly performance comparison"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyStats}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--chart-1))" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="hsl(var(--chart-2))" 
                fillOpacity={1} 
                fill="url(#colorOrders)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Monthly Revenue" description="Detailed revenue breakdown">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats}>
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
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Customer Growth" description="New customers per month">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyStats}>
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
                  dataKey="customers" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--chart-3))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
