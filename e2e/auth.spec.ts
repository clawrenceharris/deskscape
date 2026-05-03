import { expect, test } from "@playwright/test";

test.describe("authentication smoke flows", () => {
  test("redirects unauthenticated users from protected pages to login", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByRole("button", { name: /log in/i })).toBeVisible();
  });

  test("shows validation errors for invalid login input", async ({ page }) => {
    await page.goto("/auth/login");

    await page.getByLabel(/email/i).fill("not-an-email");
    await page.getByLabel(/password/i).fill("short");
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page.getByText("Please enter a valid email address")).toBeVisible();
    await expect(page.getByText("Password should be at least 8 characters")).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login$/);
  });
});
