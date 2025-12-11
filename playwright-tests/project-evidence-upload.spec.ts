import { test, expect } from "@playwright/test";
import path from "path";
import { TEST_PROJECT_ID } from "./test-helpers";

// Make a tiny "PDF" fixture (can be any small file)
const FIXTURE_PDF = path.join(__dirname, "fixtures", "dummy.pdf");

test("can upload evidence file and see View file link", async ({ page }) => {
  await page.goto(`/projects/${TEST_PROJECT_ID}`);

  // Open first Evidence modal (Evidence column uses links, not buttons)
  const evidenceLink = page
    .getByRole("link", { name: /^Evidence/ })
    .first();
  await evidenceLink.click();

  const drawer = page.getByRole("dialog", { name: /Evidence/ });
  await expect(drawer).toBeVisible();

  // Attach file
  await drawer.locator('input[type="file"]').setInputFiles(FIXTURE_PDF);

  const title = `Playwright evidence ${Date.now()}`;
  await drawer.getByPlaceholder(/Brief title/i).fill(title);
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
