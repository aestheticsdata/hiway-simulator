"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryStates } from "nuqs";
import { useForm, useWatch } from "react-hook-form";

import { useSimulationResultQuery, useRatesQuery } from "@lib/api/simulator/simulator.queries";
import { Card, CardContent } from "@components/ui/card";
import { useDebouncedValue } from "@components/simulator/hooks/useDebouncedValue";
import { referenceSimulationResult } from "@lib/simulator/mock-data";
import type { SimulationFormValues } from "@lib/simulator/interfaces/SimulationFormValues";
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
import { SimulatorResults } from "@components/simulator/simulator-results/SimulatorResults";

export function SimulatorDashboard() {
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
        <SimulatorResults
          formValues={formValues}
          result={simulationResultQuery.data ?? referenceSimulationResult}
        />
      </div>
    </div>
  );
}
