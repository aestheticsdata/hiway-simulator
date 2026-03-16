"use client";

import { useEffect } from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { RefreshCcw, TriangleAlert } from "lucide-react";

import { Button } from "@components/ui/button";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const { reset: resetQueryErrorBoundary } = useQueryErrorResetBoundary();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-border/80 bg-card px-6 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-destructive">
            <TriangleAlert className="size-5" />
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary/70">Hiway API</p>
              <h1 className="text-2xl font-semibold tracking-tight">Une erreur a interrompu la simulation</h1>
            </div>

            <p className="text-sm text-muted-foreground">
              Le front a detecte une erreur reseau ou un contrat API invalide. Corrige la source du probleme puis
              relance la page.
            </p>

            <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              {error.message}
            </div>

            <Button
              onClick={() => {
                resetQueryErrorBoundary();
                reset();
              }}
              type="button"
            >
              <RefreshCcw className="size-4" />
              <span>Reessayer</span>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
