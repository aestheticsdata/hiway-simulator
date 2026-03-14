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
        className="h-8 w-14 shrink-0 rounded-full border border-border bg-input/70"
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
          "origin-center scale-[1.75] rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(7,13,25,0.24)] backdrop-blur-sm transition-[border-color,box-shadow,background-color] duration-300 ease-out",
          "cursor-pointer border-border bg-input/90 hover:border-primary/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 dark:bg-input/85"
        )}
        thumbClassName={cn(
          "border border-border bg-card text-primary shadow-lg shadow-background/30 transition-[background-color,border-color,color,box-shadow] duration-300 ease-out",
          "dark:bg-card dark:text-primary dark:shadow-black/35"
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
