import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/useTheme";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="
        sticky top-0 z-30
        h-14 sm:h-16
        border-b border-border
        bg-card/70 backdrop-blur
      "
    >
      <div
        className="
          flex h-full items-center justify-between
          px-3 sm:px-6
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SidebarTrigger />

          {/* Desktop only title */}
          <h2 className="hidden sm:block text-lg font-semibold">Admin Panel</h2>
        </div>

        {/* RIGHT */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
