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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

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
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300",
          // Mobile
          "w-64 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          // Desktop width
          open ? "md:w-64" : "md:w-20"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
          {open ? (
            <h1 className="text-xl font-bold">Mahidolls</h1>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              M
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  "hover:bg-sidebar-accent",
                  isActive && "bg-sidebar-accent font-medium",
                  !open && "md:justify-center"
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {open && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4 text-xs text-muted-foreground">
          {open ? "© 2025 Mahidolls" : "v1.0"}
        </div>
      </aside>
    </>
  );
}
