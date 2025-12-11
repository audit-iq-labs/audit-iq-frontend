import { test, expect } from "@playwright/test";
import { TEST_PROJECT_ID } from "./test-helpers";

test.describe("Evidence modal", () => {
  test("can add and delete evidence for an obligation", async ({ page }) => {
    await page.goto(`/projects/${TEST_PROJECT_ID}`);

    // "Evidence (…)" is rendered as a link in the Evidence column
    const evidenceLink = page
      .getByRole("link", { name: /^Evidence \(/ })
      .first();

    await expect(evidenceLink).toBeVisible();
    await evidenceLink.click();

    // Drawer / modal should appear
    const drawer = page.getByRole("dialog", { name: /Evidence/ });
    await expect(drawer).toBeVisible();

    const title = `Playwright evidence ${Date.now()}`;
    await drawer.getByPlaceholder(/Brief title/i).fill(title);
    await drawer.getByRole("button", { name: /Save evidence/i }).click();

    // Evidence row should be visible inside the drawer
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
