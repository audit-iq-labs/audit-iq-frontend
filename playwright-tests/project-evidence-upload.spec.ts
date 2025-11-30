import { test, expect } from "@playwright/test";
import path from "path";
import { TEST_PROJECT_ID } from "./test-helpers";

// Make a tiny "PDF" fixture (can be any small file)
const FIXTURE_PDF = path.join(__dirname, "fixtures", "dummy.pdf");

test("can upload evidence file and see View file link", async ({ page }) => {
  await page.goto(`/projects/${TEST_PROJECT_ID}`);

  // Open first Evidence modal
  const evidenceButton = page
    .getByRole("button", { name: /^Evidence/ })
    .first();
  await evidenceButton.click();

  const drawer = page.getByRole("dialog", { name: /Evidence/ });
  await expect(drawer).toBeVisible();

  const title = `Upload evidence ${Date.now()}`;
  await drawer
    .getByPlaceholder("Title (e.g. 'Risk management policy v3')")
    .fill(title);
  await drawer
    .getByPlaceholder("Description (optional)")
    .fill("Evidence file upload test");

  // Attach file
  await drawer.locator('input[type="file"]').setInputFiles(FIXTURE_PDF);

  await drawer.getByRole("button", { name: /Save evidence/i }).click();

  // Row should appear
  const row = drawer
    .locator("div.border.rounded.p-2")
    .filter({ hasText: title })
    .first();
  await expect(row).toBeVisible();

  // View file link should be present
  const viewLink = row.getByRole("link", { name: /View file/i });
  await expect(viewLink).toBeVisible();
});
