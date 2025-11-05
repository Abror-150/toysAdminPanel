import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  BarChart3, 
  ShoppingCart,
  Layers,
  Sparkles,
  Sofa,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { title: 'Nabors', icon: Package, path: '/nabors' },
  { title: 'Materials', icon: Layers, path: '/materials' },
  { title: 'Accessories', icon: Sparkles, path: '/accessories' },
  { title: 'Furnitures', icon: Sofa, path: '/furnitures' },
  { title: 'Andozalar', icon: FileText, path: '/andozalar' },
  { title: 'Contacts', icon: MessageSquare, path: '/contacts' },
  { title: 'Orders', icon: ShoppingCart, path: '/orders' },
  { title: 'Statistics', icon: BarChart3, path: '/statistics' },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <aside className={cn(
      "h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
      open ? "w-64" : "w-20"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          {open ? (
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Mahidolls
            </h1>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                !open && "justify-center"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {open && <span className="text-sm">{item.title}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn(
            "text-xs text-sidebar-foreground/60",
            !open && "text-center"
          )}>
            {open ? '© 2025 Mahidolls' : 'v1.0'}
          </div>
        </div>
      </div>
    </aside>
  );
}
