"use client";

import { Printer } from "lucide-react";

import { Button } from "@components/ui/button";
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";

interface ResultsSummaryBannerProps {
  isExportPdfDisabled: boolean;
  onExportPdf: () => void;
}

export function ResultsSummaryBanner({
  isExportPdfDisabled,
  onExportPdf,
}: ResultsSummaryBannerProps) {
  return (
    <section className="rounded-2xl border border-border/80 bg-background/80 px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 space-y-1 lg:basis-2/3 lg:pr-4">
          <h2 id="simulation-results-heading" className="font-medium text-foreground">
            {simulatorResultsTexts.resultsBanner.title}
          </h2>
          <p className="text-sm text-balance text-muted-foreground md:text-pretty">
            {simulatorResultsTexts.resultsBanner.description}
          </p>
        </div>
        <div className="screen-only w-full lg:flex lg:basis-1/3 lg:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full lg:max-w-46 cursor-pointer"
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
