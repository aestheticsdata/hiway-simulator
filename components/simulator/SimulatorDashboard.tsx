"use client";

import { useCallback, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Card, CardContent } from "@components/ui/card";
import { defaultFormValues } from "@lib/simulator/constants/defaultFormValues";
import { previewSimulation } from "@lib/simulator/mock-data";
import type { SimulationFormValues } from "@lib/simulator/interfaces/SimulationFormValues";
import { simulatorFormSchema } from "@lib/simulator/schemas/simulatorFormSchema";

import { SimulatorForm } from "@components/simulator/SimulatorForm";
import { SimulatorResults } from "@components/simulator/simulator-results/SimulatorResults";

export function SimulatorDashboard() {
  const scrollPaneRef = useRef<HTMLDivElement>(null);

  const form = useForm<SimulationFormValues>({
    resolver: zodResolver(simulatorFormSchema),
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const watchedValues = useWatch({ control: form.control });
  const formValues = {
    ...defaultFormValues,
    ...watchedValues,
  };

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
        <SimulatorResults formValues={formValues} preview={previewSimulation} />
      </div>
    </div>
  );
}
