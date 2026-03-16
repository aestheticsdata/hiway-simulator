import { ArrowRightLeft, CircleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import { simulatorFormTexts } from "@components/simulator/texts";

interface ComparisonModeToggleProps {
  isChecked: boolean;
  isPendingActivation: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ComparisonModeToggle({ isChecked, isPendingActivation, onCheckedChange }: ComparisonModeToggleProps) {
  const texts = simulatorFormTexts.comparisonMode;

  return (
    <div className="rounded-[1.75rem] border border-border/75 bg-background/55 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ArrowRightLeft className="size-4 text-primary/80" />
            <span>{texts.title}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{texts.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Label htmlFor="simulator-vs-switch" className="sr-only">
            {texts.title}
          </Label>
          <Switch id="simulator-vs-switch" checked={isChecked} onCheckedChange={onCheckedChange} />
        </div>
      </div>

      {isPendingActivation ? (
        <Alert className="mt-4 border-amber-200/80 bg-amber-50/85 text-amber-950 dark:border-amber-300/20 dark:bg-amber-400/8 dark:text-amber-100">
          <CircleAlert className="size-4" />
          <AlertTitle>{texts.pendingTitle}</AlertTitle>
          <AlertDescription className="text-amber-900/80 dark:text-amber-100/78">
            {texts.pendingDescription}
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
