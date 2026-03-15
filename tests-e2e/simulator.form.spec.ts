import { expect, test } from "@playwright/test";

import {
  clearNumberField,
  expectValidationError,
  gotoSimulator,
  scenarios,
  selectRegime,
  setNumberField,
  validationMessages,
} from "./helpers/simulator";

test.beforeEach(async ({ page }) => {
  await gotoSimulator(page);
});

test.describe("validation du formulaire", () => {
  test("affiche l'erreur requise sur les honoraires en regime reel", async ({
    page,
  }) => {
    await clearNumberField(page, "Honoraires annuels");

    await expectValidationError(page, {
      errorId: "honoraires-error",
      label: "Honoraires annuels",
      message: validationMessages.honoraires,
    });

    await setNumberField(page, "Honoraires annuels", 50_000);

    await expect(page.locator("#honoraires-error")).toHaveCount(0);
    await expect(page.getByLabel("Honoraires annuels")).not.toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  test("affiche l'erreur requise sur les charges en regime reel", async ({
    page,
  }) => {
    await clearNumberField(page, "Charges annuelles");

    await expectValidationError(page, {
      errorId: "charges-error",
      label: "Charges annuelles",
      message: validationMessages.charges,
    });

    await setNumberField(page, "Charges annuelles", scenarios.reel.charges);

    await expect(page.locator("#charges-error")).toHaveCount(0);
    await expect(page.getByLabel("Charges annuelles")).not.toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  test("affiche l'erreur requise sur les parts fiscales en regime reel", async ({
    page,
  }) => {
    await clearNumberField(page, "Parts fiscales");

    await expectValidationError(page, {
      errorId: "parts-fiscales-error",
      label: "Parts fiscales",
      message: validationMessages.partsFiscales,
    });

    await setNumberField(page, "Parts fiscales", 2);

    await expect(page.locator("#parts-fiscales-error")).toHaveCount(0);
    await expect(page.getByLabel("Parts fiscales")).not.toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  test("en micro-BNC, valide les honoraires sans afficher le champ charges", async ({
    page,
  }) => {
    await selectRegime(page, "Micro-BNC");

    await expect(page.locator("#charges")).toHaveCount(0);
    await clearNumberField(page, "Honoraires annuels");

    await expectValidationError(page, {
      errorId: "honoraires-error",
      label: "Honoraires annuels",
      message: validationMessages.honoraires,
    });

    await setNumberField(page, "Honoraires annuels", 50_000);

    await expect(page.locator("#honoraires-error")).toHaveCount(0);
    await expect(page.getByLabel("Honoraires annuels")).not.toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  test("en micro-BNC, valide les parts fiscales sans afficher le champ charges", async ({
    page,
  }) => {
    await selectRegime(page, "Micro-BNC");

    await expect(page.locator("#charges")).toHaveCount(0);
    await clearNumberField(page, "Parts fiscales");

    await expectValidationError(page, {
      errorId: "parts-fiscales-error",
      label: "Parts fiscales",
      message: validationMessages.partsFiscales,
    });

    await setNumberField(page, "Parts fiscales", 2);

    await expect(page.locator("#parts-fiscales-error")).toHaveCount(0);
    await expect(page.getByLabel("Parts fiscales")).not.toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });
});
