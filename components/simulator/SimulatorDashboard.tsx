"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useReactToPrint } from "react-to-print";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { useScrollForwarding } from "@components/simulator/hooks/useScrollForwarding";
import { useSimulatorState } from "@components/simulator/hooks/useSimulatorState";
import { ComparisonModeToggle } from "@components/simulator/ComparisonModeToggle";
import { SimulatorForm } from "@components/simulator/SimulatorForm";
import { ResultsViewSwap } from "@components/simulator/simulator-results/ResultsViewSwap";
import { ResultsSummaryBanner } from "@components/simulator/simulator-results/ResultsSummaryBanner";
import { SimulatorComparisonResults } from "@components/simulator/simulator-results/SimulatorComparisonResults";
import { SimulatorComparisonResultsSkeleton } from "@components/simulator/simulator-results/SimulatorComparisonResultsSkeleton";
import { SimulatorResults } from "@components/simulator/simulator-results/SimulatorResults";
import { SimulatorResultsSkeleton } from "@components/simulator/simulator-results/SimulatorResultsSkeleton";
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";
import { simulatorFormTexts } from "@components/simulator/texts";

const simulationFormTitleId = "simulation-form-title";

export function SimulatorDashboard() {
  const [isPrinting, setIsPrinting] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);
  const scrollPaneRef = useRef<HTMLDivElement>(null);

  const {
    form,
    formValues,
    normalizedViewMode,
    simulationResultQuery,
    simulationComparisonQuery,
    isVsPendingActivation,
    isVsSwitchChecked,
    shouldShowResultsSkeleton,
    isResultsUpdating,
    handleVsToggle,
  } = useSimulatorState();

  useScrollForwarding(scrollPaneRef);

  const exportTexts = simulatorResultsTexts.pdfExport;
  const normalizedParts = formValues.partsFiscales.toString().replace(".", "_");
  const documentTitle = [
    "hiway-simulation",
    normalizedViewMode,
    formValues.regime,
    Math.round(formValues.honoraires),
    `${normalizedParts}parts`,
  ].join("-");

  const handlePrint = useReactToPrint({
    contentRef: printableRef,
    documentTitle,
    onAfterPrint: () => {
      flushSync(() => {
        setIsPrinting(false);
      });
    },
    onBeforePrint: () => {
      flushSync(() => {
        setIsPrinting(true);
      });

      return new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      });
    },
    onPrintError: () => {
      flushSync(() => {
        setIsPrinting(false);
      });
    },
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 12mm;
      }

      @media print {
        html,
        body {
          background: #fff !important;
        }
      }
    `,
  });

  return (
    <div className="grid items-start gap-6 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-8">
      <div className="lg:h-full">
        <Card className="border-border/80 bg-card/92 shadow-[0_22px_52px_rgba(118,145,191,0.14)] ring-1 ring-[#e7eef8] dark:shadow-[0_30px_90px_rgba(2,8,22,0.36)] dark:ring-white/3">
          <CardHeader className="border-b border-border/80">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary/70">
              {simulatorFormTexts.eyebrow}
            </p>
            <CardTitle id={simulationFormTitleId} className="text-2xl font-semibold tracking-tight">
              {simulatorFormTexts.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 py-8">
            <SimulatorForm
              form={form}
              showComparisonChargesField={isVsPendingActivation}
              titleId={simulationFormTitleId}
              viewMode={normalizedViewMode}
            />
            <ComparisonModeToggle
              isChecked={isVsSwitchChecked}
              isPendingActivation={isVsPendingActivation}
              onCheckedChange={handleVsToggle}
            />
          </CardContent>
        </Card>
      </div>

      <div
        ref={scrollPaneRef}
        aria-busy={shouldShowResultsSkeleton || isResultsUpdating}
        aria-labelledby="simulation-results-heading"
        role="region"
        className="lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-2"
      >
        <div className="space-y-6">
          <ResultsSummaryBanner
            isExportPdfDisabled={shouldShowResultsSkeleton}
            onExportPdf={handlePrint}
            viewMode={normalizedViewMode}
          />

          <div ref={printableRef} className="print-surface space-y-6">
            <div className="print-only space-y-2 border-b border-border/70 pb-4">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/70">Hiway</p>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{exportTexts.title}</h1>
              <p className="max-w-3xl text-sm text-muted-foreground">{exportTexts.description}</p>
            </div>

            <ResultsViewSwap
              defaultContent={
                simulationResultQuery.data ? (
                  <SimulatorResults
                    formValues={formValues}
                    isPrinting={isPrinting}
                    result={simulationResultQuery.data}
                  />
                ) : (
                  <SimulatorResultsSkeleton formValues={formValues} />
                )
              }
              viewMode={normalizedViewMode}
              vsContent={
                simulationComparisonQuery.data ? (
                  <SimulatorComparisonResults comparison={simulationComparisonQuery.data} />
                ) : (
                  <SimulatorComparisonResultsSkeleton />
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
