import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";

const GENRES = ["All", "Action", "Comedy", "Documentary", "Silent Era"];
const LANGUAGES = [
  "All",
  "Silent",
  "English",
  "Telugu",
  "French",
  "German",
  "Russian",
];
const YEARS = [
  "All",
  ...Array.from({ length: 30 }, (_, i) => String(1895 + i * 3)),
];

export interface Filters {
  genre: string;
  language: string;
  year: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const hasActive =
    filters.genre !== "All" ||
    filters.language !== "All" ||
    filters.year !== "All";

  const clear = () => onChange({ genre: "All", language: "All", year: "All" });

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      data-ocid="filters.panel"
    >
      <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Filter:
      </span>

      <Select
        value={filters.genre}
        onValueChange={(v) => onChange({ ...filters, genre: v })}
      >
        <SelectTrigger
          className="h-8 w-36 border-border bg-input text-xs"
          data-ocid="filters.select"
        >
          <SelectValue placeholder="Genre" />
        </SelectTrigger>
        <SelectContent className="bg-card">
          {GENRES.map((g) => (
            <SelectItem key={g} value={g} className="text-xs">
              {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.year}
        onValueChange={(v) => onChange({ ...filters, year: v })}
      >
        <SelectTrigger
          className="h-8 w-28 border-border bg-input text-xs"
          data-ocid="filters.select"
        >
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="bg-card">
          {YEARS.map((y) => (
            <SelectItem key={y} value={y} className="text-xs">
              {y === "All" ? "All Years" : `~${y}s`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.language}
        onValueChange={(v) => onChange({ ...filters, language: v })}
      >
        <SelectTrigger
          className="h-8 w-32 border-border bg-input text-xs"
          data-ocid="filters.select"
        >
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent className="bg-card">
          {LANGUAGES.map((l) => (
            <SelectItem key={l} value={l} className="text-xs">
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
          onClick={clear}
          data-ocid="filters.button"
        >
          <X className="h-3 w-3" /> Clear
        </Button>
      )}
    </div>
  );
}
