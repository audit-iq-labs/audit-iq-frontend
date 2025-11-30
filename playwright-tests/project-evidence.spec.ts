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

    // Drawer / modal should appear
    const drawer = page.getByRole("dialog", { name: /Evidence/ });
    await expect(drawer).toBeVisible();

    // Add new evidence with a unique title
    const title = `Playwright evidence ${Date.now()}`;

    await drawer
      .getByPlaceholder("Title (e.g. 'Risk management policy v3')")
      .fill(title);

    await drawer
      .getByPlaceholder("Description (optional)")
      .fill("Evidence created by Playwright test");

    await drawer.getByRole("button", { name: /Save evidence/i }).click();

    // The new evidence row (scoped to the drawer)
    const evidenceRow = drawer
      .locator("div.border.rounded.p-2")
      .filter({ hasText: title })
      .first();

    await expect(evidenceRow).toBeVisible();

    // Handle confirm("Delete this evidence item?") by accepting it
    page.once("dialog", (dialog) => dialog.accept());
    await evidenceRow.getByRole("button", { name: "Delete" }).click();

    // After delete, there should be **no** rows with that title any more
    const evidenceRowAfterDelete = drawer
      .locator("div.border.rounded.p-2")
      .filter({ hasText: title });

    await expect(evidenceRowAfterDelete).toHaveCount(0);
  });
});
