import { test, expect } from "@playwright/test";
import { TEST_PROJECT_ID } from "./test-helpers";

test.describe("Checklist status updates", () => {
  test("changing status is persisted after reload", async ({ page }) => {
    await page.goto(`/projects/${TEST_PROJECT_ID}`);

    // Grab the first status dropdown in the checklist table
    const statusSelect = page.getByRole("combobox").first();

    // Record the initial value (this is the HTML 'value', e.g. "todo" | "done")
    const initialValue = await statusSelect.inputValue();

    // Decide a new value to switch to
    // Adjust these to match your real values if they differ.
    const targetValue = initialValue === "done" ? "todo" : "done";

    // Change the status
    await statusSelect.selectOption(targetValue);

    // Wait until the select reflects the new value
    await expect(statusSelect).toHaveValue(targetValue);

    // Reload the page
    await page.reload();

    // After reload, the first select should still have the new value
    const statusSelectAfterReload = page.getByRole("combobox").first();
    await expect(statusSelectAfterReload).toHaveValue(targetValue);

    // Optional: reset to original value to avoid polluting dev data
    if (initialValue && initialValue !== targetValue) {
      await statusSelectAfterReload.selectOption(initialValue);
      await expect(statusSelectAfterReload).toHaveValue(initialValue);
    }
  });
});
