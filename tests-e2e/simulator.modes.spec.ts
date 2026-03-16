import { expect, test } from "@playwright/test";

import { formatEuro } from "@lib/simulator/formatters";

import {
  cardByHeading,
  gotoSimulator,
  scenarios,
  selectRegime,
  setNumberField,
  simulatorHeading,
} from "./helpers/simulator";

test.beforeEach(async ({ page }) => {
  await gotoSimulator(page);
});

test("calcule et affiche la synthese en regime reel", async ({ page }) => {
  await setNumberField(page, "Honoraires annuels", 50_000);
  await setNumberField(page, "Charges annuelles", scenarios.reel.charges);
  await setNumberField(page, "Parts fiscales", 1);

  const summaryCard = cardByHeading(page, "Hypotheses retenues");
  const financialCard = cardByHeading(page, "Synthese financiere");

  await expect(page).toHaveURL(/honoraires=50000/);
  await expect(page).toHaveURL(/charges=5000/);
  await expect(page).toHaveURL(/partsFiscales=1/);
  await expect(page).toHaveURL(/regime=reel/);

  await expect(summaryCard).toContainText("Regime reel");
  await expect(summaryCard).toContainText(formatEuro(50_000, false));
  await expect(summaryCard).toContainText(formatEuro(scenarios.reel.charges, false));
  await expect(summaryCard).toContainText("1");

  await expect(financialCard).toContainText("Revenu net annuel");
  await expect(financialCard).toContainText(formatEuro(scenarios.reel.annualNetIncome));
  await expect(financialCard).toContainText(formatEuro(scenarios.reel.monthlyNetIncome));
  await expect(financialCard).toContainText(formatEuro(scenarios.reel.totalContributions));
  await expect(financialCard).toContainText(formatEuro(scenarios.reel.tax));
});

test("bascule en micro-BNC et masque les charges saisies", async ({ page }) => {
  await setNumberField(page, "Honoraires annuels", 50_000);
  await setNumberField(page, "Parts fiscales", 1);
  await selectRegime(page, "Micro-BNC");

  const summaryCard = cardByHeading(page, "Hypotheses retenues");
  const financialCard = cardByHeading(page, "Synthese financiere");

  await expect(page).toHaveURL(/regime=micro/);
  await expect(page.locator("#charges")).toHaveCount(0);
  await expect(
    page.getByText(
      "Les charges ne sont pas saisies en micro-BNC. L'abattement forfaitaire de 34% servira de base de calcul a l'etape metier.",
    ),
  ).toBeVisible();

  await expect(summaryCard).toContainText("Micro-BNC");
  await expect(summaryCard).toContainText(formatEuro(50_000, false));
  await expect(summaryCard).toContainText(scenarios.micro.chargesSummary);
  await expect(summaryCard).toContainText("1");

  await expect(financialCard).toContainText(formatEuro(scenarios.micro.annualNetIncome));
  await expect(financialCard).toContainText(formatEuro(scenarios.micro.monthlyNetIncome));
  await expect(financialCard).toContainText(formatEuro(scenarios.micro.totalContributions));
  await expect(financialCard).toContainText(formatEuro(scenarios.micro.tax));
});

test("restaure l'état depuis les paramètres URL au chargement de la page", async ({ page }) => {
  const ex = scenarios.verificationExample;
  const url = `/?honoraires=${ex.honoraires}&charges=${ex.charges}&partsFiscales=${ex.partsFiscales}&regime=reel`;

  await page.goto(url);
  await expect(page.getByRole("heading", { name: simulatorHeading })).toBeVisible();

  await expect(page.getByLabel("Honoraires annuels")).toHaveValue(String(ex.honoraires));
  await expect(page.getByLabel("Charges annuelles")).toHaveValue(String(ex.charges));
  await expect(page.getByLabel("Parts fiscales")).toHaveValue(String(ex.partsFiscales));
  await expect(page).toHaveURL(/honoraires=120000/);
  await expect(page).toHaveURL(/regime=reel/);
});
