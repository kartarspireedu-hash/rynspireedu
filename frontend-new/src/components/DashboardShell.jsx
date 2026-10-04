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
          <div className="flex items-center justify-between h-16 px-6 lg:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
              <h1 className="font-display text-xl leading-none mt-1">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
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
        </header>
        <main className="p-6 lg:p-10 flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
