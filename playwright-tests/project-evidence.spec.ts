import { test, expect } from "@playwright/test";
import { TEST_PROJECT_ID } from "./test-helpers";

test.describe("Evidence modal", () => {
  test("can add and delete evidence for an obligation", async ({ page }) => {
    await page.goto(`/projects/${TEST_PROJECT_ID}`);

    // "Evidence (…)" is rendered as a <button>, not a link
    const evidenceButton = page
      .getByRole("button", { name: /^Evidence \(/ })
      .first();

    await expect(evidenceButton).toBeVisible();
    await evidenceButton.click();

    // Modal should appear
    await expect(
      page.getByRole("heading", { name: /Evidence –/ }),
    ).toBeVisible();

    // Add new evidence
    const title = `Playwright evidence ${Date.now()}`;

    await page
      .getByPlaceholder("Title (e.g. 'Risk management policy v3')")
      .fill(title);

    await page
      .getByPlaceholder("Description (optional)")
      .fill("Evidence created by Playwright test");

    await page
      .getByRole("button", { name: /Save evidence/i })
      .click();

    // The new evidence row: this div class matches your ProjectDashboard.tsx
    const evidenceRow = page
      .locator("div.border.rounded.p-2")
      .filter({ hasText: title })
      .first();

    await expect(evidenceRow).toBeVisible();

    // Handle confirm("Delete this evidence item?") by accepting it
    page.once("dialog", (dialog) => dialog.accept());
    await evidenceRow
      .getByRole("button", { name: "Delete" })
      .click();

    // After delete, the row should be gone or hidden
    await expect(evidenceRow).not.toBeVisible();
  });
});
