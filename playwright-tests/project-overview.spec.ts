import { test, expect } from "@playwright/test";
import { TEST_PROJECT_ID } from "./test-helpers";

test.describe("Project Overview", () => {
  test("shows project header and KPI cards", async ({ page }) => {
    await page.goto(`/projects/${TEST_PROJECT_ID}`);

    // Header
    await expect(
      page.getByRole("heading", { name: /Project/i }),
    ).toBeVisible();

    // Checklist section heading
    await expect(
      page.getByRole("heading", { name: /Checklist/i }),
    ).toBeVisible();

    // KPI cards – use their labels
    await expect(
      page.getByText(/Checklist completion/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Evidence coverage/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Overdue obligations/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Overall risk score/i),
    ).toBeVisible();
  });
});
