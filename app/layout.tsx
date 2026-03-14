import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@lib/utils";
import { AppProviders } from "@components/providers/AppProviders";

export const metadata: Metadata = {
  metadataBase: new URL("https://hiwaysim.1991computer.com"),
  title: {
    default: "Simulateur de revenu net pour medecin liberal | Hiway Simulator",
    template: "%s | Hiway Simulator",
  },
  description:
    "Simulateur de revenu net pour medecin liberal. Estimez le revenu net annuel et mensuel, les cotisations sociales et l'impot selon votre regime fiscal.",
  applicationName: "Hiway Simulator",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Hiway Simulator",
    title: "Simulateur de revenu net pour medecin liberal",
    description:
      "Estimez le revenu net, les cotisations sociales et l'impot d'un medecin liberal selon son regime fiscal.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Simulateur de revenu net pour medecin liberal",
    description:
      "Estimez le revenu net, les cotisations sociales et l'impot d'un medecin liberal selon son regime fiscal.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn("font-sans")}
    >
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
