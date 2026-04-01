import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Film, Play } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-[240px] items-center justify-center overflow-hidden sm:min-h-[280px]"
      style={{
        background:
          "linear-gradient(135deg, #0a0c0e 0%, #111416 40%, #161b1e 100%)",
      }}
    >
      {/* Background film collage */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('/assets/generated/cinema-hero-collage.dim_1600x480.jpg')",
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Archive
            </span>
          </div>
          <h1 className="mb-3 font-display text-4xl tracking-widest text-foreground sm:text-5xl">
            PUBLIC DOMAIN &amp;{" "}
            <span className="text-primary">CREATIVE COMMONS</span> CINEMA
          </h1>
          <p className="mb-6 text-sm text-muted-foreground sm:text-base">
            Thousands of free, legally streamable films — silent classics, early
            talkies, documentaries, and more. Watch online or download in HD.
          </p>
          <Link to="/">
            <Button
              size="lg"
              className="gap-2 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
              data-ocid="hero.primary_button"
            >
              <Play className="h-4 w-4 fill-current" />
              Browse Archive
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
