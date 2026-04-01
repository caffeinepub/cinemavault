import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Download, Film, Globe, Tag } from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import MovieGrid from "../components/MovieGrid";
import { useMovieById, useRecentMovies } from "../hooks/useQueries";

function isEmbedUrl(url: string) {
  return (
    url.includes("archive.org") ||
    url.includes("youtube") ||
    url.includes("vimeo")
  );
}

export default function MoviePage() {
  const { id } = useParams({ from: "/movie/$id" });
  const movieId = BigInt(id);

  const { data: movie, isLoading } = useMovieById(movieId);
  const { data: relatedMovies = [] } = useRecentMovies(5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-screen-xl px-4 py-8 md:px-8">
          <Skeleton className="mb-6 h-8 w-48" />
          <Skeleton className="mb-6 aspect-video w-full rounded-sm" />
          <Skeleton className="mb-4 h-10 w-64" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div
          className="flex flex-col items-center justify-center py-32 text-center"
          data-ocid="movie.error_state"
        >
          <Film className="mb-4 h-16 w-16 text-muted-foreground/40" />
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            Film Not Found
          </h2>
          <p className="mb-6 text-muted-foreground">
            This film doesn't exist in our archive.
          </p>
          <Link to="/">
            <Button
              className="bg-primary text-primary-foreground"
              data-ocid="movie.button"
            >
              Browse Archive
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-screen-xl px-4 py-8 md:px-8">
        {/* Back */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          data-ocid="movie.link"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Archive
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Video Player */}
          <div
            className="relative mb-6 w-full overflow-hidden rounded-sm bg-black shadow-[0_8px_40px_rgba(0,0,0,0.7)]"
            style={{ paddingTop: "56.25%" }}
            data-ocid="movie.canvas_target"
          >
            {isEmbedUrl(movie.videoUrl) ? (
              <iframe
                src={movie.videoUrl}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                title={movie.title}
              />
            ) : (
              // biome-ignore lint/a11y/useMediaCaption: public domain silent films have no caption tracks
              <video
                src={movie.videoUrl}
                className="absolute inset-0 h-full w-full"
                controls
                preload="metadata"
              />
            )}
          </div>

          {/* Title + meta */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mb-2 font-display text-3xl tracking-wider text-foreground sm:text-4xl">
                {movie.title.toUpperCase()}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {movie.year.toString()}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  {movie.language}
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-primary hover:bg-primary/30"
                  >
                    {movie.genre}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Public Domain badge */}
            <div className="shrink-0 rounded-sm border border-primary/30 bg-primary/10 px-3 py-2 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                Public Domain
              </p>
              <p className="text-[10px] text-muted-foreground">
                Free to Watch &amp; Download
              </p>
            </div>
          </div>

          {/* Download Buttons */}
          {movie.downloadUrls && movie.downloadUrls.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Download Options
              </h2>
              <div className="flex flex-wrap gap-3">
                {movie.downloadUrls.map((dl, i) => (
                  <a
                    key={dl.quality}
                    href={dl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Button
                      className="gap-2 border border-primary/50 bg-primary/10 font-semibold text-primary hover:bg-primary/20"
                      data-ocid={`movie.download_button.${i + 1}`}
                    >
                      <Download className="h-4 w-4" />
                      {dl.quality}
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Synopsis */}
          <div className="mb-10 rounded-sm border border-border bg-card p-5">
            <h2 className="mb-3 font-display text-base tracking-widest text-foreground">
              SYNOPSIS
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {movie.synopsis}
            </p>
          </div>
        </motion.div>

        {/* Related Films */}
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-4 w-1 bg-primary" />
            <h2 className="font-display text-lg tracking-widest text-foreground">
              MORE FROM ARCHIVE
            </h2>
          </div>
          <MovieGrid movies={relatedMovies.filter((m) => m.id !== movieId)} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
