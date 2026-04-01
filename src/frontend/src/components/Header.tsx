import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { Film, Menu, Search, Settings, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "HOME", to: "/" },
  { label: "MOVIES", to: "/" },
  { label: "ACTION", to: "/?genre=Action" },
  { label: "COMEDY", to: "/?genre=Comedy" },
  { label: "DOCUMENTARY", to: "/?genre=Documentary" },
  { label: "SILENT ERA", to: "/?genre=Silent+Era" },
];

interface HeaderProps {
  onSearch?: (q: string) => void;
  searchValue?: string;
}

export default function Header({ onSearch, searchValue = "" }: HeaderProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearch = () => {
    if (localSearch.trim()) {
      navigate({ to: "/", search: { q: localSearch.trim() } });
    }
    if (onSearch) onSearch(localSearch);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md"
      style={{ minHeight: 72 }}
    >
      <div className="mx-auto flex h-[72px] max-w-screen-2xl items-center gap-4 px-4 md:px-8">
        {/* Brand */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-1"
          data-ocid="nav.link"
        >
          <Film className="h-7 w-7 text-primary" />
          <span className="font-display text-2xl tracking-widest text-foreground">
            CINEMA
          </span>
          <span className="font-display text-2xl tracking-widest text-primary">
            VAULT
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="flex w-full max-w-xs items-center gap-0 overflow-hidden rounded-sm border border-border sm:max-w-sm">
          <Input
            placeholder="Search films..."
            className="h-9 rounded-none border-0 bg-input text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            data-ocid="nav.search_input"
          />
          <Button
            size="sm"
            className="h-9 rounded-none bg-primary px-3 text-primary-foreground hover:bg-primary/90"
            onClick={handleSearch}
            data-ocid="nav.button"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-1 text-muted-foreground lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          data-ocid="nav.toggle"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <nav className="border-t border-border bg-card px-4 py-3 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="block py-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-border pt-2">
            <Link
              to="/admin"
              className="flex items-center gap-2 py-2 text-[12px] font-semibold uppercase tracking-wider text-amber-400 transition-colors hover:text-amber-300"
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.admin_link"
            >
              <Settings className="h-3.5 w-3.5" />
              Admin Panel
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
