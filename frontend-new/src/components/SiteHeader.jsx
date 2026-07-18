import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import BrandMark from "@/components/BrandMark";
import CurrencySwitcher from "@/components/CurrencySwitcher";

const nav = [
  { to: "/", label: "Home" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact Us" },
];

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardPath =
    user?.role === "student" || user?.role === "parent" ? "/app/student"
    : user?.role === "tutor" ? "/app/tutor"
    : user?.role === "admin" || user?.role === "owner" ? "/app/admin"
    : "/app/student";

  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="container-x flex items-center justify-between h-16">
        <Link to="/" data-testid="site-logo"><BrandMark size="md" /></Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-foreground/70 hover:text-primary"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><CurrencySwitcher /></div>
          <button
            onClick={toggle}
            data-testid="theme-toggle"
            aria-label="Toggle theme"
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Button
            asChild
            size="sm"
            className="pill-btn hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
            data-testid="header-demo-btn"
          >
            <Link to="/book-demo">Book Free Demo</Link>
          </Button>

          {user && (
            <Button asChild variant="outline" size="sm" className="pill-btn hidden md:inline-flex" data-testid="header-dashboard-btn">
              <Link to={dashboardPath}>Dashboard</Link>
            </Button>
          )}
          {user && (
            <Button variant="ghost" size="sm" className="pill-btn hidden md:inline-flex" onClick={async () => { await logout(); navigate("/"); }} data-testid="header-logout-btn">
              Logout
            </Button>
          )}

          <button
            className="lg:hidden h-9 w-9 grid place-items-center rounded-full hover:bg-secondary"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Menu"
            data-testid="mobile-menu-btn"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background" data-testid="mobile-menu">
          <div className="container-x py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                onClick={() => setMobileOpen(false)}
                className="text-base py-1.5 font-medium"
              >
                {n.label}
              </NavLink>
            ))}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <CurrencySwitcher compact />
            </div>
            <Button asChild size="sm" className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground w-full" onClick={() => setMobileOpen(false)}>
              <Link to="/book-demo">Book Free 25-min Demo</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
