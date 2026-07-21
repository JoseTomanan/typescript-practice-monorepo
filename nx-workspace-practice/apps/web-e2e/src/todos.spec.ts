import { test, expect } from '@playwright/test';

// Full end-to-end coverage of the todo UI, driven through a real browser
// against the running web app (:3001) + API (:3000). These exercise the
// cross-origin client mutations that the CORS fix in apps/api/src/main.ts
// makes possible — before that fix, every one of these would fail.
test.describe('Todo list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the list and the backend message', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'TO DO LIST ITEMS' })).toBeVisible();
    await expect(page.getByText('Message from backend:')).toBeVisible();
  });

  test('adds a new todo row', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const before = await rows.count();

    await page.getByRole('button', { name: '+ New' }).click();

    await expect(rows).toHaveCount(before + 1);
    await expect(rows.last().locator('input').first()).toHaveValue('Untitled');
  });

  // NOTE: the API keeps its todos in a single in-memory list that is never
  // reset between tests, so rows accumulate across the whole suite. Every
  // test below waits for its own "+ New" row to actually land in the DOM
  // (rather than grabbing `.last()` on a hunch) and then keeps interacting
  // with that exact row, so it stays correct regardless of how many
  // leftover rows earlier tests/runs have piled up.
  test('edits a title and persists it across a reload', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const before = await rows.count();
    const title = `Persisted ${Date.now()}`;

    await page.getByRole('button', { name: '+ New' }).click();
    await expect(rows).toHaveCount(before + 1);

    const titleInput = rows.nth(before).locator('input').first();
    await expect(titleInput).toHaveValue('Untitled');

    await titleInput.fill(title);
    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/api/todos') && r.request().method() === 'PATCH'
      ),
      titleInput.blur(),
    ]);

    await page.reload();

    // After SSR, the persisted title is rendered as the input's value attribute.
    await expect(page.locator(`input[value="${title}"]`)).toBeVisible();
  });

  test('changes a todo status to done', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const before = await rows.count();

    await page.getByRole('button', { name: '+ New' }).click();
    await expect(rows).toHaveCount(before + 1);

    const statusSelect = rows.nth(before).locator('select');

    await statusSelect.selectOption('done');

    await expect(statusSelect).toHaveValue('done');
  });

  test('deletes a todo row', async ({ page }) => {
    const rows = page.locator('tbody tr');
    const before = await rows.count();

    await page.getByRole('button', { name: '+ New' }).click();
    await expect(rows).toHaveCount(before + 1);

    const newRow = rows.nth(before);
    const rowHandle = await newRow.elementHandle();
    if (!rowHandle) {
      throw new Error('Could not resolve an element handle for the newly added row');
    }

    await newRow.getByRole('button', { name: 'Delete row' }).click();

    // Confirm the *specific* row we created is gone (detached from the DOM),
    // rather than trusting an absolute row count against the shared,
    // ever-growing table.
    await rowHandle.waitForElementState('hidden');
    await expect(rows).toHaveCount(before);
  });
});
