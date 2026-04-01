import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import type { Movie } from "../backend.d";
import FilterBar, { type Filters } from "../components/FilterBar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import MovieGrid from "../components/MovieGrid";
import { sampleMovies } from "../data/sampleMovies";
import { useAllMovies, useRecentMovies } from "../hooks/useQueries";

const PAGE_SIZE = 10;

const defaultFilters: Filters = { genre: "All", language: "All", year: "All" };

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [page, setPage] = useState(1);

  const { data: allMovies = sampleMovies, isLoading } = useAllMovies();
  const { data: recentMovies = [] } = useRecentMovies(6);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setPage(1);
  }, []);

  const handleFilter = useCallback((f: Filters) => {
    setFilters(f);
    setPage(1);
  }, []);

  const filteredMovies = useMemo(() => {
    let movies: Movie[] = allMovies;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      movies = movies.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.genre.toLowerCase().includes(q) ||
          m.synopsis.toLowerCase().includes(q),
      );
    }

    if (filters.genre !== "All") {
      movies = movies.filter((m) => m.genre === filters.genre);
    }
    if (filters.language !== "All") {
      movies = movies.filter((m) => m.language === filters.language);
    }
    if (filters.year !== "All") {
      const startYear = Number.parseInt(filters.year);
      movies = movies.filter(
        (m) => Number(m.year) >= startYear && Number(m.year) < startYear + 3,
      );
    }

    return movies;
  }, [allMovies, searchQuery, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / PAGE_SIZE));
  const pagedMovies = filteredMovies.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const featuredMovies = useMemo(
    () => allMovies.filter((m) => m.featured).slice(0, 5),
    [allMovies],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} searchValue={searchQuery} />
      <Hero />

      <main className="mx-auto max-w-screen-2xl px-4 py-8 md:px-8">
        {/* Filter bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <h2 className="font-display text-xl tracking-widest text-foreground">
            BROWSE ARCHIVE
          </h2>
          <FilterBar filters={filters} onChange={handleFilter} />
        </div>

        {/* Main Grid */}
        <motion.div
          key={`${searchQuery}-${filters.genre}-${filters.language}-${filters.year}-${page}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MovieGrid
            movies={pagedMovies}
            loading={isLoading}
            emptyMessage="No films match your search or filters"
          />
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="mt-8 flex items-center justify-center gap-2"
            data-ocid="pagination.panel"
          >
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="border-border bg-card"
              data-ocid="pagination.pagination_prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className={`border-border ${
                    page === pageNum
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`pagination.item.${pageNum}`}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="border-border bg-card"
              data-ocid="pagination.pagination_next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Recently Added */}
        {recentMovies.length > 0 && !searchQuery && (
          <section className="mt-14">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-4 w-1 bg-primary" />
              <h2 className="font-display text-lg tracking-widest text-foreground">
                RECENTLY ADDED
              </h2>
            </div>
            <MovieGrid movies={recentMovies} />
          </section>
        )}

        {/* Trending / Featured */}
        {featuredMovies.length > 0 && !searchQuery && (
          <section className="mt-14">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-4 w-1 bg-primary" />
              <h2 className="font-display text-lg tracking-widest text-foreground">
                TRENDING NOW
              </h2>
            </div>
            <MovieGrid movies={featuredMovies} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
