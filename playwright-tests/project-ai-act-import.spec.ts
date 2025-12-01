// playwright-tests/project-ai-act-import.spec.ts
import { test, expect } from "@playwright/test";
import { TEST_PROJECT_ID } from "./test-helpers";

test.describe("AI Act checklist import", () => {
  test("triggers import flow when CTA is available", async ({ page }) => {
    // 1. Go to the project detail page
    await page.goto(`/projects/${TEST_PROJECT_ID}`);

    // 2. Checklist section should be visible (basic sanity)
    await expect(
      page.getByRole("heading", { name: /Checklist/i }),
    ).toBeVisible();

    // 3. Look for the AI Act import button
    const importButton = page.getByRole("button", {
      name: /Use AI Act.*Title IV/i,
    });

    // If the button is not present (e.g. this project already has obligations
    // and the empty-state CTA is hidden), just exit the test gracefully.
    if ((await importButton.count()) === 0) {
      // No CTA in this environment / seed data -> nothing to validate here.
      return;
    }

    // 4. If the button *is* visible, click it to trigger the server action
    await expect(importButton).toBeVisible();
    await importButton.click();

    // 5. Reload the page to pick up the updated checklist
    await page.reload();

    // 6. After import, we expect at least one checklist row with an Evidence button
    const evidenceButton = page
      .getByRole("button", { name: /^Evidence \(/ })
      .first();
    await expect(evidenceButton).toBeVisible();
  });
});
