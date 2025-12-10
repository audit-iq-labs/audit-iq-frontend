import { test, expect } from "@playwright/test";

test.describe("Analyze page", () => {
  test("can upload a document and see gap summary", async ({ page }) => {
    await page.goto("/analyze");

    // Upload a small dummy PDF from fixtures
    const fileInput = page.getByLabel(/Upload a document/i);
    await fileInput.setInputFiles("fixtures/test-document.pdf");

    // Click Analyze
    await page.getByRole("button", { name: /Upload & analyze/i }).click();

    // Wait for summary cards to appear
    await expect(page.getByText(/Detected obligations/i)).toBeVisible();
    await expect(page.getByText(/Total obligations in regulation/i)).toBeVisible();
    await expect(page.getByText(/Gaps identified/i)).toBeVisible();

    // And the table
    const table = page.getByRole("table", { name: /Gap details/i });
    await expect(table).toBeVisible();

    // Optional: check at least one row rendered
    const rows = table.getByRole("row");

    // row(0) is usually the header, so ensure there's at least one more row
    await expect(rows.nth(1)).toBeVisible();
  });
});
