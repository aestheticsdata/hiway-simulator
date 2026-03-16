import { expect, test } from "@playwright/test";

import { formatEuro } from "@lib/simulator/formatters";

import { cardByHeading, gotoSimulator, scenarios, selectRegime, setNumberField } from "./helpers/simulator";

test.beforeEach(async ({ page }) => {
  await gotoSimulator(page);
});

test("active le mode comparaison et affiche le regime optimal", async ({ page }) => {
  await setNumberField(page, "Honoraires annuels", 50_000);
  await setNumberField(page, "Charges annuelles", scenarios.reel.charges);
  await setNumberField(page, "Parts fiscales", 1);
  await expect(page).toHaveURL(/honoraires=50000/);
  await expect(page).toHaveURL(/charges=5000/);
  await expect(page).toHaveURL(/partsFiscales=1/);
  await expect(page).toHaveURL(/regime=reel/);
  await page.getByRole("switch", { name: "Mode comparaison" }).click();

  const annualCard = cardByHeading(page, "Revenu net annuel");
  const monthlyCard = cardByHeading(page, "Revenu net mensuel");
  const optimalCard = cardByHeading(page, "Choix optimal");

  await expect(page).toHaveURL(/view=vs/);
  await expect(page.getByRole("heading", { name: "Micro-BNC vs regime reel" })).toBeVisible();
  await expect(page.getByLabel("Regime fiscal")).toBeDisabled();

  const searchParams = new URL(page.url()).searchParams;
  expect(searchParams.get("view")).toBe("vs");
  expect(searchParams.has("regime")).toBe(false);

  await expect(annualCard).toContainText("Micro-BNC");
  await expect(annualCard).toContainText("Regime reel");
  await expect(annualCard).toContainText(formatEuro(21_302.05, false));
  await expect(annualCard).toContainText(formatEuro(28_228.27, false));
  await expect(monthlyCard).toContainText(formatEuro(1_775.17, false));
  await expect(monthlyCard).toContainText(formatEuro(2_352.36, false));
  await expect(optimalCard).toContainText("Regime reel");
  await expect(optimalCard).toContainText(formatEuro(scenarios.comparison.annualGain, false));
  await expect(optimalCard).toContainText(formatEuro(scenarios.comparison.monthlyGain, false));
});

test("retarde l'activation du mode comparaison en micro tant que les charges reel sont absentes", async ({ page }) => {
  await setNumberField(page, "Honoraires annuels", 50_000);
  await setNumberField(page, "Charges annuelles", 0);
  await setNumberField(page, "Parts fiscales", 2);
  await selectRegime(page, "Micro-BNC");
  await expect(page).toHaveURL(/honoraires=50000/);
  await expect(page).toHaveURL(/charges=0/);
  await expect(page).toHaveURL(/partsFiscales=2/);
  await expect(page).toHaveURL(/regime=micro/);
  await page.getByRole("switch", { name: "Mode comparaison" }).click();

  await expect(page.getByText("Charges reel requises")).toBeVisible();
  await expect(page).not.toHaveURL(/view=vs/);
  const chargesField = page.locator("#charges");
  await expect(chargesField).toBeVisible();
  await chargesField.fill(String(scenarios.pendingComparison.charges));
  await expect(chargesField).toHaveValue(String(scenarios.pendingComparison.charges));
  await expect(page).toHaveURL(/charges=20000/);

  const optimalCard = cardByHeading(page, "Choix optimal");

  await expect(page).toHaveURL(/view=vs/);
  await expect(page.getByRole("heading", { name: "Micro-BNC vs regime reel" })).toBeVisible();
  await expect(optimalCard).toContainText(scenarios.pendingComparison.optimalRegime);
  await expect(optimalCard).toContainText(formatEuro(scenarios.pendingComparison.annualGain, false));
});
