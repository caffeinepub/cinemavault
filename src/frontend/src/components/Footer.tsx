import { Film } from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-screen-2xl px-6 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Brand + links */}
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <div className="flex items-center gap-1.5">
              <Film className="h-4 w-4 text-primary" />
              <span className="font-display text-sm tracking-widest text-foreground">
                CINEMA
              </span>
              <span className="font-display text-sm tracking-widest text-primary">
                VAULT
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-[11px] text-muted-foreground sm:justify-start">
              {["About", "Terms of Use", "DMCA Notice", "Contact Us"].map(
                (l) => (
                  <a
                    key={l}
                    href="/"
                    className="transition-colors hover:text-primary"
                  >
                    {l}
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Social + copyright */}
          <div className="flex flex-col items-center gap-2 sm:items-end">
            <div className="flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <SiX className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <SiGithub className="h-4 w-4" />
              </a>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">
              © {year} CinemaVault — Public Domain &amp; Creative Commons
              Archive
            </p>
            <p className="text-[11px] text-muted-foreground/50">
              Built with ❤ using{" "}
              <a
                href={caffeineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
