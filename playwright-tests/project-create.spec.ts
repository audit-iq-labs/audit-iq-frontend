// playwright-tests/project-create.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Create Project", () => {
  test("creates a new project and navigates to detail page", async ({ page }) => {
    // 1. Go to projects list
    await page.goto("/projects");

    // 2. Click the New project button/link
    await page.getByRole("link", { name: /New project/i }).click();

    // 3. Ensure we are on the new project page
    await expect(
      page.getByRole("heading", { name: /Create new project/i }),
    ).toBeVisible();

    // 4. Fill form – use placeholder to find the name field
    const projectName = `Playwright Project ${Date.now()}`;

    await page
      .getByPlaceholder(/AI Hiring Assistant/i)
      .fill(projectName);

    // 5. Submit
    await page.getByRole("button", { name: /Create project/i }).click();

    // 6. We should land on some project detail page (URL contains /projects/<id>)
    await expect(page).toHaveURL(/\/projects\/.+/);

    // 7. Detail page should show a generic Project header
    await expect(
      page.getByRole("heading", { name: /Project/i }),
    ).toBeVisible();

    // (Optional) If you want *some* content assertion, you could also check
    // for the compliance summary heading instead of Checklist:
    //
    // await expect(
    //   page.getByRole("heading", { name: /Compliance Summary/i }),
    // ).toBeVisible();
  });
});
