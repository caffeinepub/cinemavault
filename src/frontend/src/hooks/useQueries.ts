import { useQuery } from "@tanstack/react-query";
import type { Movie } from "../backend.d";
import { sampleMovies } from "../data/sampleMovies";
import { useActor } from "./useActor";

export function useAllMovies() {
  const { actor, isFetching } = useActor();
  return useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: async () => {
      if (!actor) return sampleMovies;
      try {
        const result = await actor.getAllMovies();
        return result.length > 0 ? result : sampleMovies;
      } catch {
        return sampleMovies;
      }
    },
    enabled: !isFetching,
    placeholderData: sampleMovies,
  });
}

export function useFeaturedMovies() {
  const { actor, isFetching } = useActor();
  return useQuery<Movie[]>({
    queryKey: ["movies", "featured"],
    queryFn: async () => {
      if (!actor) return sampleMovies.filter((m) => m.featured);
      try {
        const result = await actor.getFeaturedMovies();
        return result.length > 0
          ? result
          : sampleMovies.filter((m) => m.featured);
      } catch {
        return sampleMovies.filter((m) => m.featured);
      }
    },
    enabled: !isFetching,
    placeholderData: sampleMovies.filter((m) => m.featured),
  });
}

export function useRecentMovies(limit = 6) {
  const { actor, isFetching } = useActor();
  return useQuery<Movie[]>({
    queryKey: ["movies", "recent", limit],
    queryFn: async () => {
      if (!actor) return sampleMovies.slice(0, limit);
      try {
        const result = await actor.getRecentMovies(BigInt(limit));
        return result.length > 0 ? result : sampleMovies.slice(0, limit);
      } catch {
        return sampleMovies.slice(0, limit);
      }
    },
    enabled: !isFetching,
    placeholderData: sampleMovies.slice(0, limit),
  });
}

export function useMovieById(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Movie | null>({
    queryKey: ["movie", id.toString()],
    queryFn: async () => {
      if (!actor) return sampleMovies.find((m) => m.id === id) ?? null;
      try {
        return await actor.getMovieById(id);
      } catch {
        return sampleMovies.find((m) => m.id === id) ?? null;
      }
    },
    enabled: !isFetching,
    placeholderData: sampleMovies.find((m) => m.id === id) ?? null,
  });
}

export function useSearchMovies(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Movie[]>({
    queryKey: ["movies", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      if (!actor) {
        const q = query.toLowerCase();
        return sampleMovies.filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.genre.toLowerCase().includes(q) ||
            m.synopsis.toLowerCase().includes(q),
        );
      }
      try {
        return await actor.searchMovies(query);
      } catch {
        const q = query.toLowerCase();
        return sampleMovies.filter((m) => m.title.toLowerCase().includes(q));
      }
    },
    enabled: !!query.trim() && !isFetching,
    placeholderData: [],
  });
}
