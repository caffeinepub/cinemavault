import { Skeleton } from "@/components/ui/skeleton";
import type { Movie } from "../backend.d";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  emptyMessage?: string;
}

function SkeletonCard() {
  return (
    <div className="block">
      <div className="poster-aspect w-full animate-pulse rounded-sm bg-muted" />
      <div className="bg-card px-2 py-2">
        <Skeleton className="mb-1 h-3 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
    </div>
  );
}

const SKELETON_KEYS = Array.from({ length: 10 }, (_, i) => `skeleton-${i}`);

export default function MovieGrid({
  movies,
  loading,
  emptyMessage,
}: MovieGridProps) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        data-ocid="movies.loading_state"
      >
        {SKELETON_KEYS.map((k) => (
          <SkeletonCard key={k} />
        ))}
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div
        className="flex h-48 flex-col items-center justify-center gap-2 text-center"
        data-ocid="movies.empty_state"
      >
        <p className="text-lg font-semibold text-muted-foreground">
          {emptyMessage ?? "No films found"}
        </p>
        <p className="text-sm text-muted-foreground/60">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie, i) => (
        <MovieCard key={movie.id.toString()} movie={movie} index={i} />
      ))}
    </div>
  );
}
