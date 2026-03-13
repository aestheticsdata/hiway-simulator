"use client";

import { useEffect } from "react";
import {
  BadgeEuro,
  ReceiptText,
  Scale,
  Users,
} from "lucide-react";
import { Controller } from "react-hook-form";

import { Input } from "@components/ui/input";
import type { FieldErrorProps } from "@components/simulator/interfaces/FieldErrorProps";
import { Label } from "@components/ui/label";
import type { SimulatorFormProps } from "@components/simulator/interfaces/SimulatorFormProps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

export function SimulatorForm({ form }: SimulatorFormProps) {
  const regime = form.watch("regime");
  const {
    control,
    formState: { errors },
    register,
    setValue,
  } = form;

  useEffect(() => {
    if (regime === "micro") {
      setValue("charges", 0, { shouldDirty: true, shouldValidate: true });
    }
  }, [regime, setValue]);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary/70">
          Donnees de simulation
        </p>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Simulateur de revenu net
          </h2>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="regime" className="flex items-center gap-2">
            <Scale className="size-4 text-primary/70" />
            <span>Regime fiscal</span>
          </Label>
          <Controller
            control={control}
            name="regime"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="regime" className="w-full">
                  <SelectValue placeholder="Selectionnez un regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">Micro-BNC</SelectItem>
                  <SelectItem value="reel">Regime reel</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-sm text-muted-foreground">
            Le mode micro applique un abattement forfaitaire. Le reel deduit
            les charges saisies.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="honoraires" className="flex items-center gap-2">
            <BadgeEuro className="size-4 text-primary/70" />
            <span>Honoraires annuels</span>
          </Label>
          <Input
            id="honoraires"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            {...register("honoraires", {
              valueAsNumber: true,
            })}
          />
          <FieldError message={errors.honoraires?.message} />
        </div>

        {regime === "reel" ? (
          <div className="space-y-2">
            <Label htmlFor="charges" className="flex items-center gap-2">
              <ReceiptText className="size-4 text-primary/70" />
              <span>Charges annuelles</span>
            </Label>
            <Input
              id="charges"
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              {...register("charges", {
                valueAsNumber: true,
              })}
            />
            <FieldError message={errors.charges?.message} />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Les charges ne sont pas saisies en micro-BNC. L&apos;abattement
            forfaitaire de 34% servira de base de calcul a l&apos;etape metier.
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="partsFiscales" className="flex items-center gap-2">
            <Users className="size-4 text-primary/70" />
            <span>Parts fiscales</span>
          </Label>
          <Input
            id="partsFiscales"
            type="number"
            inputMode="decimal"
            min={1}
            step={0.5}
            {...register("partsFiscales", {
              valueAsNumber: true,
            })}
          />
          <FieldError message={errors.partsFiscales?.message} />
        </div>
      </div>
    </div>
  );
}
