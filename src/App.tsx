import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import NaborForm from "./pages/NaborForm";
import Nabors from "./pages/Nabors";
import Contacts from "./pages/Contacts";
import Statistics from "./pages/Statistics";
import Orders from "./pages/Orders";
import MaterialsList from "./pages/MaterialsList";
import MaterialForm from "./pages/MaterialForm";
import AccessoriesList from "./pages/AccessoriesList";
import AccessoryForm from "./pages/AccessoryForm";
import FurnituresList from "./pages/FurnituresList";
import FurnitureForm from "./pages/FurnitureForm";
import AndozalarList from "./pages/AndozalarList";
import AndozaForm from "./pages/AndozaForm";
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
                  <Route path="/nabors/new" element={<NaborForm />} />
                  <Route path="/nabors/:id" element={<NaborForm />} />
                  <Route path="/materials" element={<MaterialsList />} />
                  <Route path="/materials/new" element={<MaterialForm />} />
                  <Route path="/materials/:id" element={<MaterialForm />} />
                  <Route path="/accessories" element={<AccessoriesList />} />
                  <Route path="/accessories/new" element={<AccessoryForm />} />
                  <Route path="/accessories/:id" element={<AccessoryForm />} />
                  <Route path="/furnitures" element={<FurnituresList />} />
                  <Route path="/furnitures/new" element={<FurnitureForm />} />
                  <Route path="/furnitures/:id" element={<FurnitureForm />} />
                  <Route path="/andozalar" element={<AndozalarList />} />
                  <Route path="/andozalar/new" element={<AndozaForm />} />
                  <Route path="/andozalar/:id" element={<AndozaForm />} />
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
