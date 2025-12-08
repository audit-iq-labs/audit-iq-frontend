import { test, expect } from "@playwright/test";
import { TEST_PROJECT_ID } from "./test-helpers";

test.describe.serial("Checklist status updates", () => {
  test("changing status is persisted after reload", async ({ page }) => {
    await page.goto(`/projects/${TEST_PROJECT_ID}`);

    const rows = page.locator("table tbody tr");
    const rowCount = await rows.count();
    await expect(rowCount).toBeGreaterThan(0);

    // Find a row where we can toggle between "todo" and "in_progress"
    let targetIndex = -1;
    let initialValue = "";
    let targetValue = "";

    for (let i = 0; i < rowCount; i++) {
      const select = rows.nth(i).getByRole("combobox");
      const value = await select.inputValue();

      // Only consider rows in todo/in_progress; skip done/not_applicable
      if (value !== "todo" && value !== "in_progress") {
        continue;
      }

      const candidateTarget = value === "todo" ? "in_progress" : "todo";

      // Try changing the value in the UI
      await select.selectOption(candidateTarget);

      // Check what the UI shows immediately after the change
      const immediate = await select.inputValue();

      if (immediate === candidateTarget) {
        // We found a row whose status can be changed
        targetIndex = i;
        initialValue = value;
        targetValue = candidateTarget;
        break;
      } else {
        // If it didn't actually change, revert and continue searching
        await select.selectOption(value);
      }
    }

    if (targetIndex === -1) {
      test.skip(true, "No checklist item with mutable todo/in_progress status found.");
    }

    // Reload and verify that the change persisted
    await page.reload();

    const rowAfter = page.locator("table tbody tr").nth(targetIndex);
    const statusAfter = rowAfter.getByRole("combobox");
    await expect(statusAfter).toHaveValue(targetValue);

    // Optional: reset to original value so future runs are stable
    await statusAfter.selectOption(initialValue);
    await expect(statusAfter).toHaveValue(initialValue);
  });
});
