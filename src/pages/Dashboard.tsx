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
      console.log(res.data);

      return res.data;
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
      <div className="flex items-center justify-between">
        <div className=" pl-[130px]">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to Mahidolls Admin Panel
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/nabors/new")}
            className="bg-gradient-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Nabor
          </Button>
          <Button variant="outline" onClick={() => navigate("/contacts")}>
            <Eye className="w-4 h-4 mr-2" />
            View Contacts
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pl-[130px]">
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

      <div className=" pl-[130px] w-[80%]">
        <ChartCard title="Quick Actions" description="Manage your store">
          <div className="h-full flex flex-col justify-center gap-4 p-6">
            <Button
              onClick={() => navigate("/nabors/new")}
              className="w-full h-12 bg-gradient-primary text-base"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Nabor
            </Button>
            <Button
              onClick={() => navigate("/orders")}
              variant="outline"
              className="w-full h-12 text-base"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              View All Orders
            </Button>
            <Button
              onClick={() => navigate("/contacts")}
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
