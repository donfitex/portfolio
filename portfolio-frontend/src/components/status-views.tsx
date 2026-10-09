import { AlertCircle, Loader2 } from "lucide-react";

export function LoadingBlock({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-16 font-mono text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-neon-teal" />
      {label}
    </div>
  );
}

export function ErrorBlock({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="my-8 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
      <div>
        <p className="font-medium text-red-300">Couldn&apos;t reach the API.</p>
        <p className="mt-1 text-muted-foreground">
          Make sure the Django server is running and <code className="font-mono">NEXT_PUBLIC_API_URL</code> is correct.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-xl border border-border px-3 py-1.5 text-xs transition-colors hover:border-neon-indigo/50 hover:text-foreground"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}