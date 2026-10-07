import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BrandMark from "@/components/BrandMark";

export default function DashboardShell({ nav, title, children }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const initials = (user?.name || "U").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr] bg-background">
      <aside className="hidden lg:flex flex-col border-r border-border bg-card">
        <Link to="/" className="flex items-center gap-2 p-6 border-b border-border" data-testid="dash-logo">
          <BrandMark size="sm" />
        </Link>

        <nav className="flex-1 p-4 space-y-1" aria-label="Dashboard">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              data-testid={`sidenav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors border-l-2 ${
                  isActive
                    ? "bg-secondary text-foreground border-accent font-medium"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/60"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

      </aside>

      <div className="flex flex-col min-w-0">
        <header className="glass-header sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-10 gap-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
              <h1 className="font-display text-base sm:text-xl leading-none mt-1 truncate">{title}</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={toggle}
                data-testid="dash-theme-toggle"
                aria-label="Toggle theme"
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <Button asChild variant="outline" size="sm" className="pill-btn hidden sm:inline-flex" data-testid="dash-home-btn">
                <Link to="/">Marketing Site</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="h-9 w-9 rounded-full overflow-hidden ring-1 ring-border hover:ring-accent transition-colors"
                    data-testid="dash-account-btn"
                    aria-label="Account menu"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground font-normal capitalize">{user?.role}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/">Marketing Site</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={async () => { await logout(); navigate("/"); }} data-testid="dash-logout-btn">
                    <LogOut size={14} className="mr-2" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Phone / tablet navigation: the left sidebar is hidden below lg,
              so without this bar the Users and Payment links sections
              could not be reached on small screens. */}
          <nav
            className="lg:hidden flex gap-2 overflow-x-auto px-4 sm:px-6 pb-3 pt-1 border-t border-border/60 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Dashboard sections"
            data-testid="dash-mobile-nav"
          >
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                data-testid={`mobilenav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `shrink-0 inline-flex items-center gap-2 min-h-[40px] px-4 rounded-full text-sm whitespace-nowrap border transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary font-medium"
                      : "bg-card text-muted-foreground border-border"
                  }`
                }
              >
                <item.icon size={15} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="p-4 sm:p-6 lg:p-10 flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
