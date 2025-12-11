import { test, expect } from "@playwright/test";
import { CHECKLIST_PROJECT_ID } from "./test-helpers";

test.describe.serial("Checklist status updates", () => {
  test("changing status is persisted after reload", async ({ page }) => {
    await page.goto(`/projects/${CHECKLIST_PROJECT_ID}`);

    // Ensure the checklist section has rendered
    const checklistHeading = page.getByRole("heading", {
      name: "Checklist",
      exact: true,
      level: 2,
    });
    await expect(checklistHeading).toBeVisible({ timeout: 60_000 });

    const checklistSection = checklistHeading.locator("..").locator("..");
    const rows = checklistSection.locator("tbody tr");

    let rowCount = await rows.count();

    // If we somehow have zero rows here, that's a hard env failure
    expect(rowCount).toBeGreaterThan(0);

    // Find a row where status is "todo" or "in_progress"
    let targetIndex = -1;
    let initialValue = "";
    let targetValue = "";

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const statusSelect = row.getByRole("combobox");
      const currentValue = await statusSelect.inputValue();

      if (currentValue === "todo" || currentValue === "in_progress") {
        targetIndex = i;
        initialValue = currentValue;
        targetValue = currentValue === "todo" ? "in_progress" : "todo";
        break;
      }
    }

    // Strict: if we didn’t find such a row, fail explicitly
    expect(targetIndex).toBeGreaterThanOrEqual(0);

    const targetRow = rows.nth(targetIndex);
    const statusSelect = targetRow.getByRole("combobox");

    // Change status
    await statusSelect.selectOption(targetValue);
    await expect(statusSelect).toHaveValue(targetValue);

    // Reload and verify it persisted
    await page.reload();

    const checklistHeadingAfter = page.getByRole("heading", {
      name: "Checklist",
      exact: true,
      level: 2,
    });
    await expect(checklistHeadingAfter).toBeVisible({ timeout: 60_000 });

    const checklistSectionAfter = checklistHeadingAfter.locator("..").locator("..");
    const rowsAfter = checklistSectionAfter.locator("tbody tr");
    const rowAfter = rowsAfter.nth(targetIndex);
    const statusAfter = rowAfter.getByRole("combobox");
    await expect(statusAfter).toHaveValue(targetValue);

    // Reset to original value to keep tests idempotent
    await statusAfter.selectOption(initialValue);
    await expect(statusAfter).toHaveValue(initialValue);
  });
});
