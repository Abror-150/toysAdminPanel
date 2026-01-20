import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  ShoppingCart,
  Layers,
  Sparkles,
  Sofa,
  FileText,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Nabors", icon: Package, path: "/nabors" },
  { title: "Materials", icon: Layers, path: "/materials" },
  { title: "Accessories", icon: Sparkles, path: "/accessories" },
  { title: "Furnitures", icon: Sofa, path: "/furnitures" },
  { title: "Andozalar", icon: FileText, path: "/andozalar" },
  { title: "Contacts", icon: MessageSquare, path: "/contacts" },
  { title: "Orders", icon: ShoppingCart, path: "/orders" },
];

export function AppSidebar() {
  const { open, setOpen } = useSidebar();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "h-screen bg-sidebar border-r border-sidebar-border transition-transform duration-300 fixed md:relative z-20",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-4 sm:px-6 border-b border-sidebar-border justify-between">
            {open ? (
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Mahidolls
              </h1>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
            )}

            {/* Mobile close */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 py-4 space-y-1 px-2 sm:px-3 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)} // close sidebar on mobile
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-2 sm:px-3 py-2 rounded-lg transition-all duration-200",
                    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                    !open && "justify-center"
                  )
                }
              >
                <item.icon className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                {open && <span className="text-sm">{item.title}</span>}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/60 text-center">
            {open ? "© 2025 Mahidolls" : "v1.0"}
          </div>
        </div>
      </aside>
    </>
  );
}
