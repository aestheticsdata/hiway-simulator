import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

export function ActiveInterfaceAlert() {
  return (
    <Alert className="border-border/80 bg-background/80 shadow-sm">
      <AlertTitle>Lecture des estimations</AlertTitle>
      <AlertDescription>
        Les montants ci-dessous donnent une vision exploitable du revenu
        disponible, des prelevements et de la repartition des charges pour le
        scenario retenu.
      </AlertDescription>
    </Alert>
  );
}
