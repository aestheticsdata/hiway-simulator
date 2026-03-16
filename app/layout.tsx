import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@lib/utils";
import { AppProviders } from "@components/providers/AppProviders";

const DEFAULT_SITE_URL = "https://hiwaysim.1991computer.com";

function getMetadataBase(): URL {
  const configuredSiteUrl =
    [process.env.NEXT_PUBLIC_SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL].find(
      (value) => typeof value === "string" && value.trim().length > 0,
    ) ?? DEFAULT_SITE_URL;

  const normalizedSiteUrl = configuredSiteUrl.startsWith("http") ? configuredSiteUrl : `https://${configuredSiteUrl}`;

  try {
    return new URL(normalizedSiteUrl);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
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
    <html lang="fr" suppressHydrationWarning className={cn("font-sans")}>
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
