"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryStates } from "nuqs";
import { flushSync } from "react-dom";
import { useForm, useWatch } from "react-hook-form";
import { useReactToPrint } from "react-to-print";

import { useSimulationResultQuery, useRatesQuery } from "@lib/api/simulator/simulator.queries";
import { Card, CardContent } from "@components/ui/card";
import { useDebouncedValue } from "@components/simulator/hooks/useDebouncedValue";
import { simulatorFormSchema } from "@lib/simulator/schemas/simulatorFormSchema";
import {
  areSimulationSearchParamsEqual,
  areSimulationInputsEqual,
  getSearchParamsFromSimulationInput,
  getSimulationInputFromSearchParams,
  normalizeSimulationInput,
  simulatorSearchParamParsers,
} from "@lib/simulator/searchParams";

import { SimulatorForm } from "@components/simulator/SimulatorForm";
import { ResultsSummaryBanner } from "@components/simulator/simulator-results/ResultsSummaryBanner";
import { SimulatorResults } from "@components/simulator/simulator-results/SimulatorResults";
import { SimulatorResultsSkeleton } from "@components/simulator/simulator-results/SimulatorResultsSkeleton";
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";

import type { SimulationFormValues } from "@lib/simulator/interfaces/SimulationFormValues";

export function SimulatorDashboard() {
  const [isPrinting, setIsPrinting] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);
  const scrollPaneRef = useRef<HTMLDivElement>(null);
  const [urlState, setUrlState] = useQueryStates(simulatorSearchParamParsers, {
    history: "replace",
  });
  const urlFormValues = useMemo(
    () => getSimulationInputFromSearchParams(urlState),
    [urlState]
  );

  const form = useForm<SimulationFormValues>({
    resolver: zodResolver(simulatorFormSchema),
    mode: "onChange",
    defaultValues: urlFormValues,
  });

  const watchedValues = useWatch({ control: form.control });
  const formValues = useMemo(
    () =>
      normalizeSimulationInput({
        charges: watchedValues.charges,
        honoraires: watchedValues.honoraires,
        partsFiscales: watchedValues.partsFiscales,
        regime: watchedValues.regime,
      }),
    [
      watchedValues.charges,
      watchedValues.honoraires,
      watchedValues.partsFiscales,
      watchedValues.regime,
    ]
  );
  const debouncedFormValues = useDebouncedValue(formValues, 350);
  const canonicalSearchParams = useMemo(
    () => getSearchParamsFromSimulationInput(debouncedFormValues),
    [debouncedFormValues]
  );
  const ratesQuery = useRatesQuery();
  const simulationResultQuery = useSimulationResultQuery(
    debouncedFormValues,
    ratesQuery.isSuccess && form.formState.isValid
  );
  const exportTexts = simulatorResultsTexts.pdfExport;
  const shouldShowResultsSkeleton = ratesQuery.isPending || !simulationResultQuery.data;
  const documentTitle = useMemo(() => {
    const normalizedParts = formValues.partsFiscales.toString().replace(".", "_");

    return [
      "hiway-simulation",
      formValues.regime,
      Math.round(formValues.honoraires),
      `${normalizedParts}parts`,
    ].join("-");
  }, [formValues.honoraires, formValues.partsFiscales, formValues.regime]);

  useEffect(() => {
    if (areSimulationInputsEqual(form.getValues(), urlFormValues)) {
      return;
    }

    form.reset(urlFormValues);
  }, [form, urlFormValues]);

  useEffect(() => {
    if (!form.formState.isValid) {
      return;
    }

    if (areSimulationSearchParamsEqual(canonicalSearchParams, urlState)) {
      return;
    }

    void setUrlState(canonicalSearchParams);
  }, [
    canonicalSearchParams,
    form.formState.isValid,
    setUrlState,
    urlState,
  ]);

  const handleWheel = useCallback((e: WheelEvent) => {
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
  }, []);

  useEffect(() => {
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

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
        <Card className="border-foreground/8 bg-card/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <CardContent className="py-8">
            <SimulatorForm form={form} />
          </CardContent>
        </Card>
      </div>

      <div
        ref={scrollPaneRef}
        className="lg:h-full lg:min-h-0 lg:overflow-y-auto lg:pr-2"
      >
        <div className="space-y-6">
          <ResultsSummaryBanner
            isExportPdfDisabled={shouldShowResultsSkeleton}
            onExportPdf={handlePrint}
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

            {shouldShowResultsSkeleton ? (
              <SimulatorResultsSkeleton formValues={formValues} />
            ) : (
              <SimulatorResults
                formValues={formValues}
                isPrinting={isPrinting}
                result={simulationResultQuery.data}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
