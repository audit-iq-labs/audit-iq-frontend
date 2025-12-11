// playwright-tests/project-ai-act-import.spec.ts
import { test, expect } from "@playwright/test";

test.describe("AI Act checklist import", () => {
  test("triggers import flow when CTA is available", async ({ page }) => {
    // 1. Create a fresh project via the UI so the CTA is guaranteed to be present
    await page.goto("/projects");

    await page.getByRole("link", { name: /New project/i }).click();

    await expect(
      page.getByRole("heading", { name: /Create new project/i }),
    ).toBeVisible();

    const projectName = `Playwright AI Act Import ${Date.now()}`;
    await page.getByPlaceholder(/AI Hiring Assistant/i).fill(projectName);

    await page.getByRole("button", { name: /Create project/i }).click();

    // We should land on the project detail page
    await expect(page).toHaveURL(/\/projects\/[^/]+$/);

    // 2. Checklist page header should be visible
    await expect(
      page.getByRole("heading", { name: /AI Act project checklist/i }),
    ).toBeVisible();

    // 3. CTA button must be visible on a brand-new project
    const importButton = page.getByRole("button", {
      name: /Use AI Act checklist/i,
    });
    await expect(importButton).toBeVisible();

    // 4. Click CTA to trigger import
    await importButton.click();

    // 5. After import, Checklist section (h2) should appear
    const checklistHeading = page.getByRole("heading", {
      name: "Checklist",
      exact: true,
      level: 2,
    });
    await expect(checklistHeading).toBeVisible({ timeout: 60_000 });

    // 6. There should be at least one checklist row with an Evidence link
    const checklistSection = checklistHeading.locator("..").locator("..");
    const rows = checklistSection.locator("tbody tr");
    await expect(rows.first()).toBeVisible();

    const evidenceLink = rows.first().getByRole("link", {
      name: /^Evidence \(/,
    });
    await expect(evidenceLink).toBeVisible();
  });
});
