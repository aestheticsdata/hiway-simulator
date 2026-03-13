import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ActiveInterfaceAlert() {
  return (
    <Alert className="border-border/80 bg-background/80 shadow-sm">
      <AlertTitle>Apercu d&apos;interface actif</AlertTitle>
      <AlertDescription>
        La colonne de droite reprend les chiffres de l&apos;exemple du brief.
        L&apos;etape suivante branchera ces cartes et graphiques sur les vraies
        routes API.
      </AlertDescription>
    </Alert>
  );
}
