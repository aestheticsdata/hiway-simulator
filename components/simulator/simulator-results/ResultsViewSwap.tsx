"use client";

import { useEffect, useState } from "react";

import { cn } from "@lib/utils";

import type { ReactNode } from "react";
import type { SimulatorViewMode } from "@lib/simulator/interfaces/SimulatorViewMode";

interface ResultsViewSwapProps {
  defaultContent: ReactNode;
  viewMode: SimulatorViewMode;
  vsContent: ReactNode;
}

type TransitionPhase = "idle" | "entering" | "exiting";
type TransitionDirection = "to-default" | "to-vs";

const EXIT_DURATION_MS = 140;
const ENTER_DURATION_MS = 180;

export function ResultsViewSwap({
  defaultContent,
  viewMode,
  vsContent,
}: ResultsViewSwapProps) {
  const [displayedMode, setDisplayedMode] = useState<SimulatorViewMode>(viewMode);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [direction, setDirection] = useState<TransitionDirection>("to-vs");

  useEffect(() => {
    const timers: number[] = [];

    if (viewMode === displayedMode) {
      if (phase !== "idle") {
        timers.push(
          window.setTimeout(() => {
            setPhase("idle");
          }, 0)
        );
      }

      return () => {
        timers.forEach((timer) => {
          window.clearTimeout(timer);
        });
      };
    }

    timers.push(
      window.setTimeout(() => {
        setDirection(viewMode === "vs" ? "to-vs" : "to-default");
        setPhase("exiting");

        timers.push(
          window.setTimeout(() => {
            setDisplayedMode(viewMode);
            setPhase("entering");

            timers.push(
              window.setTimeout(() => {
                setPhase("idle");
              }, ENTER_DURATION_MS)
            );
          }, EXIT_DURATION_MS)
        );
      }, 0)
    );

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [displayedMode, phase, viewMode]);

  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          "motion-reduce:animate-none",
          phase === "entering" &&
            direction === "to-vs" &&
            "animate-results-panel-enter-left",
          phase === "entering" &&
            direction === "to-default" &&
            "animate-results-panel-enter-right",
          phase === "exiting" &&
            direction === "to-vs" &&
            "animate-results-panel-exit-right",
          phase === "exiting" &&
            direction === "to-default" &&
            "animate-results-panel-exit-left"
        )}
      >
        {displayedMode === "vs" ? vsContent : defaultContent}
      </div>
    </div>
  );
}
