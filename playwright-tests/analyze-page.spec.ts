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

    // Wait for summary cards to appear (LLM + pipeline can be slow)
    await expect(page.getByText(/Total gaps/i)).toBeVisible({ timeout: 60_000 });
    await expect(page.getByText(/High gaps/i)).toBeVisible({ timeout: 60_000 });

    // Obligations section must appear
    const obligationsSectionHeading = page.getByRole("heading", {
      name: /Obligations found in your document/i,
    });
    await expect(obligationsSectionHeading).toBeVisible({ timeout: 60_000 });

    const obligationsSection = obligationsSectionHeading.locator("..").locator("..");

    const obligationsTable = obligationsSection.getByRole("table");
    const noObligationsMsg = obligationsSection.getByText(
      /No obligations were confidently extracted from this document by the AI engine/i,
    );

    // We strictly require that the obligations section is in a valid state:
    //  - either a table with at least one data row
    //  - or the explicit "no obligations" message
    if (await obligationsTable.count()) {
      await expect(obligationsTable).toBeVisible();
      const obligationRows = obligationsTable.getByRole("row");
      await expect(obligationRows.nth(1)).toBeVisible(); // header + at least one data row
    } else {
      await expect(noObligationsMsg).toBeVisible();
    }

    // Gaps section must appear
    const gapsSectionHeading = page.getByRole("heading", {
      name: /Gaps vs EU AI Act Title IV/i,
    });
    await expect(gapsSectionHeading).toBeVisible({ timeout: 60_000 });

    const gapsSection = gapsSectionHeading.locator("..").locator("..");
    const gapsTable = gapsSection.getByRole("table");
    await expect(gapsTable).toBeVisible();

    const gapRows = gapsTable.getByRole("row");
    await expect(gapRows.nth(1)).toBeVisible(); // header + at least one data row
  });
});
