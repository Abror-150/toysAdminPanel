import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Nabors from "./pages/Nabors";
import Contacts from "./pages/Contacts";
import Statistics from "./pages/Statistics";
import Orders from "./pages/Orders";
import Materials from "./pages/Materials";
import Accessories from "./pages/Accessories";
import Furnitures from "./pages/Furnitures";
import Andozalar from "./pages/Andozalar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1 bg-background">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/nabors" element={<Nabors />} />
                  <Route path="/materials" element={<Materials />} />
                  <Route path="/accessories" element={<Accessories />} />
                  <Route path="/furnitures" element={<Furnitures />} />
                  <Route path="/andozalar" element={<Andozalar />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
