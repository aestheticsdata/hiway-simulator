import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { simulatorResultsTexts } from "@components/simulator/simulator-results/texts";

export function ActiveInterfaceAlert() {
  return (
    <Alert className="border-border/80 bg-background/80 shadow-sm">
      <AlertTitle>{simulatorResultsTexts.activeAlert.title}</AlertTitle>
      <AlertDescription>{simulatorResultsTexts.activeAlert.description}</AlertDescription>
    </Alert>
  );
}
