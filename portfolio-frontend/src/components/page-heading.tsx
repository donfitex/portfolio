interface PageHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageHeading({ eyebrow, title, description }: PageHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-sm text-neon-teal">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {description && <p className="mt-4 text-muted-foreground">{description}</p>}
    </div>
  );
}