import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useState } from "react";
import type { Movie } from "../backend.d";

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link
      to="/movie/$id"
      params={{ id: movie.id.toString() }}
      className="group block"
      data-ocid={`movies.item.${index + 1}`}
    >
      <div className="relative overflow-hidden rounded-sm shadow-card">
        {/* Poster */}
        <div className="poster-aspect relative bg-muted">
          {/* Skeleton */}
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-card" />
          )}
          <img
            src={movie.thumbnailUrl}
            alt={movie.title}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/60 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 shadow-lg">
              <Play className="h-5 w-5 fill-primary-foreground text-primary-foreground" />
            </div>
          </div>

          {/* Year badge */}
          <div className="absolute right-1.5 top-1.5 rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            {movie.year.toString()}
          </div>
        </div>

        {/* Caption */}
        <div className="bg-card px-2 py-2">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-foreground">
            {movie.title}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {movie.genre} · {movie.year.toString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
