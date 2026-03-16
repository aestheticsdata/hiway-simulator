"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightLeft, CircleAlert } from "lucide-react";
import { useQueryState, useQueryStates } from "nuqs";
import { flushSync } from "react-dom";
import { useForm, useWatch } from "react-hook-form";
import { useReactToPrint } from "react-to-print";

import {
  useSimulationComparisonQuery,
  useSimulationResultQuery,
} from "@lib/api/simulator/simulator.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@components/ui/alert";
import { useDebouncedValue } from "@components/simulator/hooks/useDebouncedValue";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import { simulatorFormSchema } from "@lib/simulator/schemas/simulatorFormSchema";
import {
  areSimulationSearchParamsEqual,
  areSimulationInputsEqual,
  getSearchParamsFromSimulationInputForView,
  getSimulationInputFromSearchParams,
  normalizeSimulationInput,
  normalizeSimulatorViewMode,
  simulatorSearchParamParsers,
  simulatorViewModeParser,
} from "@lib/simulator/searchParams";

import { SimulatorForm } from "@components/simulator/SimulatorForm";
import { ResultsViewSwap } from "@components/simulator/simulator-results/ResultsViewSwap";
import { ResultsSummaryBanner } from "@components/simulator/simulator-results/ResultsSummaryBanner";
import { SimulatorComparisonResults } from "@components/simulator/simulator-results/SimulatorComparisonResults";
import { SimulatorComparisonResultsSkeleton } from "@components/simulator/simulator-results/SimulatorComparisonResultsSkeleton";
import { SimulatorResults } from "@components/simulator/simulator-results/SimulatorResults";
import { SimulatorResultsSkeleton } from "@components/simulator/simulator-results/SimulatorResultsSkeleton";
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";
import { simulatorFormTexts } from "@components/simulator/texts";

import type { SimulationFormValues } from "@lib/simulator/interfaces/SimulationFormValues";

export function SimulatorDashboard() {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isVsPendingActivation, setIsVsPendingActivation] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);
  const scrollPaneRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useQueryState("view", simulatorViewModeParser);
  const [urlState, setUrlState] = useQueryStates(simulatorSearchParamParsers, {
    history: "replace",
  });
  const urlFormValues = getSimulationInputFromSearchParams(urlState);
  const normalizedViewMode = normalizeSimulatorViewMode(viewMode);

  const form = useForm<SimulationFormValues>({
    resolver: zodResolver(simulatorFormSchema),
    mode: "onChange",
    defaultValues: urlFormValues,
  });

  const watchedValues = useWatch({ control: form.control });
  const formValues = normalizeSimulationInput({
    charges: watchedValues.charges,
    honoraires: watchedValues.honoraires,
    partsFiscales: watchedValues.partsFiscales,
    regime: watchedValues.regime,
  });
  const debouncedFormValues = useDebouncedValue(formValues, 350);
  const simulationResultQuery = useSimulationResultQuery(
    debouncedFormValues,
    normalizedViewMode === "default" && form.formState.isValid
  );
  const simulationComparisonQuery = useSimulationComparisonQuery(
    debouncedFormValues,
    normalizedViewMode === "vs" && form.formState.isValid
  );
  const exportTexts = simulatorResultsTexts.pdfExport;
  const isDefaultView = normalizedViewMode === "default";
  const shouldShowResultsSkeleton = isDefaultView
    ? !simulationResultQuery.data
    : !simulationComparisonQuery.data;
  const isResultsUpdating = isDefaultView
    ? simulationResultQuery.isFetching
    : simulationComparisonQuery.isFetching;
  const simulationFormTitleId = "simulation-form-title";
  const normalizedParts = formValues.partsFiscales.toString().replace(".", "_");
  const needsComparisonCharges =
    formValues.regime === "micro" && formValues.charges <= 0;
  const isVsSwitchChecked = normalizedViewMode === "vs" || isVsPendingActivation;
  const defaultViewSearchParams = getSearchParamsFromSimulationInputForView(
    formValues,
    {
      includeRegime: true,
    }
  );
  const isDefaultViewUrlSynced = areSimulationSearchParamsEqual(
    defaultViewSearchParams,
    urlState
  );
  const documentTitle = [
    "hiway-simulation",
    normalizedViewMode,
    formValues.regime,
    Math.round(formValues.honoraires),
    `${normalizedParts}parts`,
  ].join("-");

  useEffect(() => {
    const currentFormValues = form.getValues();
    const nextUrlFormValues = getSimulationInputFromSearchParams({
      ...urlState,
      regime: urlState.regime ?? currentFormValues.regime,
    });

    if (areSimulationInputsEqual(form.getValues(), nextUrlFormValues)) {
      return;
    }

    form.reset(nextUrlFormValues);
  }, [form, urlState]);

  useEffect(() => {
    if (!form.formState.isValid) {
      return;
    }

    const canonicalSearchParams = getSearchParamsFromSimulationInputForView(
      debouncedFormValues,
      {
        includeRegime: normalizedViewMode !== "vs",
      }
    );

    if (areSimulationSearchParamsEqual(canonicalSearchParams, urlState)) {
      return;
    }

    void setUrlState(canonicalSearchParams);
  }, [
    debouncedFormValues,
    form.formState.isValid,
    normalizedViewMode,
    setUrlState,
    urlState,
  ]);

  useEffect(() => {
    if (normalizedViewMode !== "vs" || !needsComparisonCharges) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsVsPendingActivation(true);
      void setViewMode("default");
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [needsComparisonCharges, normalizedViewMode, setViewMode]);

  useEffect(() => {
    if (
      !isVsPendingActivation ||
      !form.formState.isValid ||
      needsComparisonCharges ||
      !isDefaultViewUrlSynced
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsVsPendingActivation(false);
      void setViewMode("vs");
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    form.formState.isValid,
    isDefaultViewUrlSynced,
    isVsPendingActivation,
    needsComparisonCharges,
    setViewMode,
  ]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const pane = scrollPaneRef.current;
      if (!pane) return;
      if (pane.contains(e.target as Node)) return;

      const { scrollTop, scrollHeight, clientHeight } = pane;
      const atTop = scrollTop <= 0 && e.deltaY < 0;
      const atBottom =
        scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atBottom) return;

      e.preventDefault();
      pane.scrollTop += e.deltaY;
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, []);

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
            <CardTitle
              id={simulationFormTitleId}
              className="text-2xl font-semibold tracking-tight"
            >
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
            <div className="rounded-[1.75rem] border border-border/75 bg-background/55 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ArrowRightLeft className="size-4 text-primary/80" />
                    <span>{simulatorFormTexts.comparisonMode.title}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {simulatorFormTexts.comparisonMode.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Label
                    htmlFor="simulator-vs-switch"
                    className="sr-only"
                  >
                    {simulatorFormTexts.comparisonMode.title}
                  </Label>
                  <Switch
                    id="simulator-vs-switch"
                    checked={isVsSwitchChecked}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        setIsVsPendingActivation(false);
                        void setViewMode("default");
                        return;
                      }

                      if (needsComparisonCharges) {
                        setIsVsPendingActivation(true);
                        return;
                      }

                      setIsVsPendingActivation(false);
                      void setViewMode("vs");
                    }}
                  />
                </div>
              </div>

              {isVsPendingActivation ? (
                <Alert className="mt-4 border-amber-200/80 bg-amber-50/85 text-amber-950 dark:border-amber-300/20 dark:bg-amber-400/8 dark:text-amber-100">
                  <CircleAlert className="size-4" />
                  <AlertTitle>
                    {simulatorFormTexts.comparisonMode.pendingTitle}
                  </AlertTitle>
                  <AlertDescription className="text-amber-900/80 dark:text-amber-100/78">
                    {simulatorFormTexts.comparisonMode.pendingDescription}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
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
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/70">
                Hiway
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {exportTexts.title}
              </h1>
              <p className="max-w-3xl text-sm text-muted-foreground">
                {exportTexts.description}
              </p>
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
                  <SimulatorComparisonResults
                    comparison={simulationComparisonQuery.data}
                  />
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
