import {
  expect,
  type Locator,
  type Page,
} from "@playwright/test";

export const simulatorHeading = /Simulateur de revenu net pour médecin libéral/i;

export const scenarios = {
  comparison: {
    annualGain: 6_926.22,
    monthlyGain: 577.19,
  },
  micro: {
    annualNetIncome: 21_302.05,
    chargesSummary: "Non retenues en micro-BNC",
    monthlyNetIncome: 1_775.17,
    tax: 1_236.95,
    totalContributions: 10_461,
  },
  pendingComparison: {
    annualGain: 2_049,
    charges: 20_000,
    optimalRegime: "Micro-BNC",
  },
  reel: {
    annualNetIncome: 28_228.27,
    charges: 5_000,
    monthlyNetIncome: 2_352.36,
    tax: 2_506.73,
    totalContributions: 14_265,
  },
} as const;

export const validationMessages = {
  charges: "Saisissez un montant de charges.",
  honoraires: "Saisissez un montant d'honoraires.",
  partsFiscales: "Saisissez le nombre de parts fiscales.",
} as const;

export function cardByHeading(page: Page, heading: string): Locator {
  return page
    .getByRole("heading", { name: heading })
    .locator('xpath=ancestor::div[@data-slot="card"][1]');
}

export async function gotoSimulator(page: Page) {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: simulatorHeading })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Exporter en PDF" })
  ).toBeEnabled();
}

export async function setNumberField(page: Page, label: string, value: number) {
  await page.getByLabel(label).fill(String(value));
}

export async function clearNumberField(page: Page, label: string) {
  await page.getByLabel(label).fill("");
}

export async function selectRegime(
  page: Page,
  regimeLabel: "Micro-BNC" | "Regime reel"
) {
  await page.getByLabel("Regime fiscal").click();
  await page.getByRole("option", { name: regimeLabel }).click();
}

export async function expectValidationError(
  page: Page,
  options: {
    errorId: string;
    label: string;
    message: string;
  }
) {
  const field = page.getByLabel(options.label);
  const error = page.locator(`#${options.errorId}`);

  await expect(field).toHaveAttribute("aria-invalid", "true");
  await expect(error).toHaveText(options.message);
}
