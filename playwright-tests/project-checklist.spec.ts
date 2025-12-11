import { test, expect } from "@playwright/test";
import { CHECKLIST_PROJECT_ID } from "./test-helpers";

test.describe("Project checklist", () => {
  test("can update status, due date and justification", async ({ page }) => {
    await page.goto(`/projects/${CHECKLIST_PROJECT_ID}`);

    // Find first checklist row
    const row = page.locator("table tbody tr").first();

    // Status change
    const statusSelect = row.getByRole("combobox"); // your <select>
    await expect(statusSelect).toBeVisible();
    await statusSelect.selectOption("in_progress");

    // Due date change
    const dueDateInput = row.locator('input[type="date"]');
    await expect(dueDateInput).toBeVisible();
    const today = new Date().toISOString().slice(0, 10);
    await dueDateInput.fill(today);

    // Justification edit – for now just ensure the Edit → Save/Cancel flow appears
    await row.getByRole("button", { name: "Edit" }).click();
    await expect(row.getByRole("button", { name: "Save" })).toBeVisible();
    await expect(row.getByRole("button", { name: "Cancel" })).toBeVisible();

    // Save without changing justification (UI wiring not fully implemented yet)
    await row.getByRole("button", { name: "Save" }).click();

    // Reload and assert status + due date persisted
    await page.reload();
    const rowAfter = page.locator("table tbody tr").first();
    await expect(rowAfter.getByRole("combobox")).toHaveValue("in_progress");
    await expect(rowAfter.locator('input[type="date"]')).toHaveValue(today);
  });
});
