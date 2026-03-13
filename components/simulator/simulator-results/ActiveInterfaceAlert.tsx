import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

export function ActiveInterfaceAlert() {
  return (
    <Alert className="border-border/80 bg-background/80 shadow-sm">
      <AlertTitle>Interface active</AlertTitle>
      <AlertDescription>
        Le formulaire est maintenant branche sur <code>/api/rates</code> et{" "}
        <code>/api/simulate</code>. Les cartes et graphiques consomment un
        contrat <code>SimulationResult</code> partage entre front et API.
      </AlertDescription>
    </Alert>
  );
}
