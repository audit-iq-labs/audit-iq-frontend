import { test, expect } from "@playwright/test";

test.describe("Projects List Page", () => {
  test("shows list and navigates to project detail page when projects exist", async ({ page }) => {
    await page.goto("/projects");

    // Page heading
    await expect(
      page.getByRole("heading", { name: /Projects/i }),
    ).toBeVisible();

    // Look for "View checklist" links
    const viewLinks = page.getByRole("link", { name: /View checklist/i });
    const count = await viewLinks.count();

    if (count === 0) {
      // Dev DB has no projects; don't treat this as a hard failure.
      test.skip(true, "No projects in dev database yet, skipping navigation check.");
    }

    // Click first "View checklist"
    await viewLinks.first().click();

    // Expect navigation to /projects/:id
    await expect(page).toHaveURL(/\/projects\/.+/);

    // And dashboard KPIs should render
    await expect(
      page.getByText(/Checklist completion/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Evidence coverage/i),
    ).toBeVisible();
  });
});
