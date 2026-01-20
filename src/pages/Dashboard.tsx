import { useQuery } from "@tanstack/react-query";
import {
  Package,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  Plus,
  Eye,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { statsApi } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
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
} from "recharts";
import axios from "axios";
import { API } from "@/hooks/getEnv";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await axios.get(`${API}/nabor`);
      return res.data;
    },
  });

  const { data: lists } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get(`${API}/order`);
      return res.data;
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await axios.get(`${API}/contact`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Xush kelibsiz Mahidolls Admin Panel ga
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button
            onClick={() => navigate("/nabors/new")}
            className="bg-gradient-primary flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4 mr-2" />
             Nabor yaratish
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/contacts")}
            className="flex-1 sm:flex-none"
          >
            <Eye className="w-4 h-4 mr-2" />
             Contactlarni korish
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Nabors"
          value={stats?.totalNabor || 0}
          icon={Package}
        />
        <StatsCard
          title="Total Orders"
          value={lists?.totalOrders || 0}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Messages"
          value={messages?.totalContacts || 0}
          icon={MessageSquare}
        />
      </div>

      {/* Quick Actions */}
      <ChartCard title="Quick Actions" description="Manage your store">
        <div className="flex flex-col sm:flex-row sm:justify-start gap-3">
          <Button
            onClick={() => navigate("/nabors/new")}
            className="w-full sm:w-auto h-12 bg-gradient-primary text-base flex-1"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Nabor
          </Button>
          <Button
            onClick={() => navigate("/orders")}
            variant="outline"
            className="w-full sm:w-auto h-12 text-base flex-1"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Barcha orderlarni korish
          </Button>
          <Button
            onClick={() => navigate("/contacts")}
            variant="outline"
            className="w-full sm:w-auto h-12 text-base flex-1"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Xabarlarni tekshirish
          </Button>
        </div>
      </ChartCard>
    </div>
  );
}
