"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState, useQueryStates } from "nuqs";
import { useForm, useWatch } from "react-hook-form";

import {
  useSimulationComparisonQuery,
  useSimulationResultQuery,
} from "@lib/api/simulator/simulator.queries";
import { useDebouncedValue } from "@components/simulator/hooks/useDebouncedValue";
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

import type { SimulationFormValues } from "@lib/simulator/interfaces/SimulationFormValues";

export function useSimulatorState() {
  const [isVsPendingActivation, setIsVsPendingActivation] = useState(false);
  const [viewMode, setViewMode] = useQueryState(
    "view",
    simulatorViewModeParser
  );
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

  const isDefaultView = normalizedViewMode === "default";
  const simulationResultQuery = useSimulationResultQuery(
    debouncedFormValues,
    isDefaultView && form.formState.isValid
  );
  const simulationComparisonQuery = useSimulationComparisonQuery(
    debouncedFormValues,
    normalizedViewMode === "vs" && form.formState.isValid
  );

  const needsComparisonCharges =
    formValues.regime === "micro" && formValues.charges <= 0;
  const isVsSwitchChecked = normalizedViewMode === "vs" || isVsPendingActivation;
  const shouldShowResultsSkeleton = isDefaultView
    ? !simulationResultQuery.data
    : !simulationComparisonQuery.data;
  const isResultsUpdating = isDefaultView
    ? simulationResultQuery.isFetching
    : simulationComparisonQuery.isFetching;
  const defaultViewSearchParams = getSearchParamsFromSimulationInputForView(
    formValues,
    { includeRegime: true }
  );
  const isDefaultViewUrlSynced = areSimulationSearchParamsEqual(
    defaultViewSearchParams,
    urlState
  );

  useEffect(() => {
    const nextUrlFormValues = getSimulationInputFromSearchParams({
      ...urlState,
      regime: urlState.regime ?? form.getValues().regime,
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
      { includeRegime: normalizedViewMode !== "vs" }
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

  const handleVsToggle = (checked: boolean) => {
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
  };

  return {
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
  };
}
