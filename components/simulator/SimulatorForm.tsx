"use client";

import { BadgeEuro, ReceiptText, Scale, Users } from "lucide-react";
import { Controller } from "react-hook-form";

import { Input } from "@components/ui/input";
import type { FieldErrorProps } from "@components/simulator/interfaces/FieldErrorProps";
import { Label } from "@components/ui/label";
import type { SimulatorFormProps } from "@components/simulator/interfaces/SimulatorFormProps";
import { simulatorFormAccessibilityIds } from "@components/simulator/constants";
import { simulatorFormTexts } from "@components/simulator/texts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { simulatorRegimeLabels } from "@lib/simulator/texts";

function FieldError({ id, message }: FieldErrorProps & { id: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function SimulatorForm({ form, showComparisonChargesField = false, titleId, viewMode }: SimulatorFormProps) {
  const regime = form.watch("regime");
  const { fields } = simulatorFormTexts;
  const {
    control,
    formState: { errors },
    register,
  } = form;
  const { chargesErrorId, honorairesErrorId, partsFiscalesErrorId, regimeErrorId, regimeHelpId } =
    simulatorFormAccessibilityIds;
  const shouldDisableRegimeField = viewMode === "vs";
  const shouldShowChargesField = showComparisonChargesField || viewMode === "vs" || regime === "reel";
  const regimeHelpText = viewMode === "vs" ? fields.taxRegime.vsHelp : fields.taxRegime.help;

  return (
    <form className="space-y-8" noValidate aria-labelledby={titleId}>
      <fieldset className="space-y-5">
        <legend className="sr-only">{simulatorFormTexts.title}</legend>
        <div className="space-y-2">
          <Label htmlFor="regime" className="flex items-center gap-2">
            <Scale className="size-4 text-primary/70" />
            <span>{fields.taxRegime.label}</span>
          </Label>
          <Controller
            control={control}
            name="regime"
            render={({ field }) => (
              <Select
                disabled={shouldDisableRegimeField}
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="regime"
                  disabled={shouldDisableRegimeField}
                  aria-describedby={
                    [regimeHelpId, errors.regime ? regimeErrorId : null].filter(Boolean).join(" ") || undefined
                  }
                  aria-invalid={errors.regime ? true : undefined}
                  className="w-full"
                  onBlur={field.onBlur}
                >
                  <SelectValue placeholder={fields.taxRegime.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">{simulatorRegimeLabels.micro}</SelectItem>
                  <SelectItem value="reel">{simulatorRegimeLabels.reel}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <p id={regimeHelpId} className="text-sm text-muted-foreground">
            {regimeHelpText}
          </p>
          <FieldError id={regimeErrorId} message={errors.regime?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="honoraires" className="flex items-center gap-2">
            <BadgeEuro className="size-4 text-primary/70" />
            <span>{fields.annualFees.label}</span>
          </Label>
          <Input
            id="honoraires"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            aria-describedby={errors.honoraires ? honorairesErrorId : undefined}
            aria-invalid={errors.honoraires ? true : undefined}
            {...register("honoraires", {
              valueAsNumber: true,
            })}
          />
          <FieldError id={honorairesErrorId} message={errors.honoraires?.message} />
        </div>

        {shouldShowChargesField ? (
          <div className="space-y-2">
            <Label htmlFor="charges" className="flex items-center gap-2">
              <ReceiptText className="size-4 text-primary/70" />
              <span>{fields.annualExpenses.label}</span>
            </Label>
            <Input
              id="charges"
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              aria-describedby={errors.charges ? chargesErrorId : undefined}
              aria-invalid={errors.charges ? true : undefined}
              {...register("charges", {
                valueAsNumber: true,
              })}
            />
            <FieldError id={chargesErrorId} message={errors.charges?.message} />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
            {fields.annualExpenses.microHint}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="partsFiscales" className="flex items-center gap-2">
            <Users className="size-4 text-primary/70" />
            <span>{fields.taxShares.label}</span>
          </Label>
          <Input
            id="partsFiscales"
            type="number"
            inputMode="decimal"
            min={1}
            step={0.5}
            aria-describedby={errors.partsFiscales ? partsFiscalesErrorId : undefined}
            aria-invalid={errors.partsFiscales ? true : undefined}
            {...register("partsFiscales", {
              valueAsNumber: true,
            })}
          />
          <FieldError id={partsFiscalesErrorId} message={errors.partsFiscales?.message} />
        </div>
      </fieldset>
    </form>
  );
}
