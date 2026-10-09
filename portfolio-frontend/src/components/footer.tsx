import { Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site";

const socials = [
  { label: "GitHub", href: siteConfig.links.github, Icon: Github },
  { label: "LinkedIn", href: siteConfig.links.linkedin, Icon: Linkedin },
  { label: "Email", href: siteConfig.links.email, Icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/40 backdrop-blur-xl">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <p className="font-mono text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js, Django &amp; pgvector.
        </p>
        <div className="flex items-center gap-2">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-xl p-2 text-muted-foreground transition-all hover:bg-muted hover:text-neon-teal hover:shadow-glow-teal"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}