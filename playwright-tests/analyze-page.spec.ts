import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Analyze page", () => {
  test("can upload a document and see gap summary", async ({ page }) => {
    await page.goto("/analyze");

    // Upload a small dummy PDF from fixtures
    const fileInput = page.locator('input[type="file"]');

    const filePath = path.join(__dirname, "fixtures", "test-document.pdf");
    await fileInput.setInputFiles(filePath);

    // Click Analyze
    await page.getByRole("button", { name: /Upload & analyze/i }).click();

    // Wait for summary cards to appear
    await expect(page.getByText(/Total gaps/i)).toBeVisible();
    await expect(page.getByText(/high gaps/i)).toBeVisible();

    // And the table
    const table = page.getByRole("table", { name: /Gaps vs EU AI Act Title IV/i });
    await expect(table).toBeVisible();

    // Optional: check at least one data row rendered (header + at least one row)
    const rows = table.getByRole("row");
    await expect(rows.nth(1)).toBeVisible();
  });
});
