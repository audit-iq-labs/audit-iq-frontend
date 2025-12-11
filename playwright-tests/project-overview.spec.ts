import { test, expect } from "@playwright/test";
import { CHECKLIST_PROJECT_ID } from "./test-helpers";

test.describe("Project Overview", () => {
  test("shows project header and KPI cards", async ({ page }) => {
    await page.goto(`/projects/${CHECKLIST_PROJECT_ID}`);

    // Main page header
    await expect(
      page.getByRole("heading", { name: "AI Act project checklist" }),
    ).toBeVisible();

    // Compliance summary section
    await expect(
      page.getByRole("heading", { name: "Compliance Summary" }),
    ).toBeVisible();

    // Legend labels for the bar (strict on wording)
    await expect(page.getByText(/Todo:/i)).toBeVisible();
    await expect(page.getByText(/In Progress:/i)).toBeVisible();
    await expect(page.getByText(/Done:/i)).toBeVisible();
    await expect(page.getByText(/Not Applicable:/i)).toBeVisible();

    // Completion line (e.g. "25.0% complete")
    await expect(page.getByText(/complete/i)).toBeVisible();

    // Checklist section heading (h2, not the page title)
    await expect(
      page.getByRole("heading", { name: "Checklist", exact: true, level: 2 }),
    ).toBeVisible();

    // There must be at least one checklist row
    const checklistRows = page.locator("table tbody tr");
    await expect(checklistRows.first()).toBeVisible();

    // Analyzed documents section heading
    await expect(
      page.getByRole("heading", { name: "Analyzed documents" }),
    ).toBeVisible();

    // At least the empty state or a table is visible
    const docsEmptyState = page.getByText(
      /No documents yet\. Upload a policy, DPIA, or AI system overview/i,
    );
    const anyDocsTable = page.locator("section").filter({
      hasText: "Analyzed documents",
    }).locator("table");

    await expect(
      docsEmptyState.or(anyDocsTable),
    ).toBeVisible();
  });
});
