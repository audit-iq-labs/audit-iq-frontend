import { test, expect } from "@playwright/test";
import { CHECKLIST_PROJECT_ID } from "./test-helpers";

test.describe.serial("Checklist status updates", () => {
  test("changing status is persisted after reload", async ({ page }) => {
    await page.goto(`/projects/${CHECKLIST_PROJECT_ID}`);

    // Wait for any checklist rows to load
    const rows = page.locator("table tbody tr");
    await expect(rows.first()).toBeVisible();


    let targetIndex = -1;
    let initialValue = "";
    let targetValue = "";

    const rowCount = await rows.count();

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

    expect(targetIndex).toBeGreaterThanOrEqual(0);

    const targetRow = rows.nth(targetIndex);
    const statusSelect = targetRow.getByRole("combobox");

    await statusSelect.selectOption(targetValue);
    await expect(statusSelect).toHaveValue(targetValue);

    // Reload and verify it persisted
    await page.reload();

    const rowsAfter = page.locator("table tbody tr");
    const rowAfter = rowsAfter.nth(targetIndex);
    const statusAfter = rowAfter.getByRole("combobox");
    await expect(statusAfter).toHaveValue(targetValue);

    // Reset to original to keep test idempotent
    await statusAfter.selectOption(initialValue);
    await expect(statusAfter).toHaveValue(initialValue);
  });
});
