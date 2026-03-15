"use client";

import { Printer } from "lucide-react";

import { Button } from "@components/ui/button";
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";

import type { SimulatorViewMode } from "@lib/simulator/interfaces/SimulatorViewMode";

interface ResultsSummaryBannerProps {
  isExportPdfDisabled: boolean;
  onExportPdf: () => void;
  viewMode: SimulatorViewMode;
}

export function ResultsSummaryBanner({
  isExportPdfDisabled,
  onExportPdf,
  viewMode,
}: ResultsSummaryBannerProps) {
  const bannerTexts =
    viewMode === "vs"
      ? simulatorResultsTexts.comparisonBanner
      : simulatorResultsTexts.resultsBanner;

  return (
    <section className="rounded-2xl border border-border/80 bg-card/88 px-4 py-3 shadow-[0_14px_36px_rgba(118,145,191,0.12)] ring-1 ring-[#e7eef8] dark:shadow-[0_18px_60px_rgba(2,8,22,0.22)] dark:ring-white/3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 space-y-1 lg:basis-2/3 lg:pr-4">
          <h2 id="simulation-results-heading" className="font-medium text-foreground">
            {bannerTexts.title}
          </h2>
          <p className="text-sm text-balance text-muted-foreground md:text-pretty">
            {bannerTexts.description}
          </p>
        </div>
        <div className="screen-only w-full lg:flex lg:basis-1/3 lg:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer lg:max-w-46"
            disabled={isExportPdfDisabled}
            onClick={onExportPdf}
          >
            <Printer className="size-4" />
            <span>{simulatorResultsTexts.pdfExport.buttonLabel}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
