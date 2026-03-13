"use client";

import { startTransition, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Switch } from "@components/ui/switch";
import { cn } from "@lib/utils";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const isDark = resolvedTheme === "dark";

  if (!mounted || !resolvedTheme) {
    return (
      <div
        aria-hidden="true"
        className="h-8 w-14 shrink-0 rounded-full border border-zinc-700/60 bg-zinc-950/40"
      />
    );
  }

  return (
    <div className="inline-flex h-8 w-14 shrink-0 items-center justify-center">
      <Switch
        checked={isDark}
        aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
        onCheckedChange={(checked) => {
          startTransition(() => {
            setTheme(checked ? "dark" : "light");
          });
        }}
        className={cn(
          "origin-center scale-[1.75] rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(15,23,42,0.14)] backdrop-blur-sm transition-[border-color,box-shadow,background-color] duration-300 ease-out",
          "cursor-pointer border-zinc-300/90 bg-zinc-100/80 hover:border-rose-400 focus-visible:border-rose-400 focus-visible:ring-2 focus-visible:ring-rose-400/30 dark:border-zinc-700 dark:bg-zinc-950/70 dark:hover:border-rose-400"
        )}
        thumbClassName={cn(
          "border border-zinc-200 bg-zinc-50 text-zinc-700 shadow-lg shadow-zinc-950/10 transition-[background-color,border-color,color,box-shadow] duration-300 ease-out",
          "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-black/40"
        )}
        thumbChildren={
          <span className="relative flex size-full items-center justify-center">
            <Sun
              className={cn(
                "absolute size-2.5 transition-all duration-300 ease-out",
                isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
              )}
            />
            <Moon
              className={cn(
                "absolute size-2.5 transition-all duration-300 ease-out",
                isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
              )}
            />
          </span>
        }
      />

      <span className="sr-only">
        {isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      </span>
    </div>
  );
}
