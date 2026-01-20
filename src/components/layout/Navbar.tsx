import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/useTheme";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile sidebar toggle */}
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Admin Panel
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="w-4 sm:w-5 h-4 sm:h-5" />
            ) : (
              <Moon className="w-4 sm:w-5 h-4 sm:h-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
