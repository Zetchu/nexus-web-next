import { test, expect } from '@playwright/test';

test.describe('Search Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should search for a summoner and display mock data', async ({
    page,
  }) => {
    await page.route('**/api/getPlayer?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          puuid: 'fake-123',
          gameName: 'Shmungi',
          tagLine: 'CPT',
          summonerLevel: 100,
          tier: 'CHALLENGER',
          rank: 'I',
          leaguePoints: 500,
          wins: 10,
          losses: 0,
        }),
      });
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    const searchInput = page
      .locator('form')
      .first()
      .getByPlaceholder('Faker#KR1');
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill('Shmungi#CPT');

    await page.getByRole('button', { name: 'Track Live' }).first().click();

    await expect(page).toHaveURL(/\/summoner\/Shmungi-CPT/);
  });

  test('should show error when Riot ID format is invalid', async ({ page }) => {
    const searchInput = page
      .locator('form')
      .first()
      .getByPlaceholder('Faker#KR1');

    await searchInput.fill('Faker');
    await page.getByRole('button', { name: 'Track Live' }).first().click();

    const errorMessage = page.locator('text=Please include the tagline');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveClass(/text-error/);
  });

  test('should show error when summoner is not found (API 404)', async ({
    page,
  }) => {
    await page.route(
      '**/api/getPlayer?gameName=Unknown&tagLine=NA1',
      async (route) => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Player not found in Riot system' }),
        });
      },
    );

    const searchInput = page
      .locator('form')
      .first()
      .getByPlaceholder('Faker#KR1');
    await searchInput.fill('Unknown#NA1');
    await page.getByRole('button', { name: 'Track Live' }).first().click();

    await expect(page).toHaveURL(/\/summoner\/Unknown-NA1/);

    await expect(
      page.getByText('Player not found in Riot system'),
    ).toBeVisible();
  });

  test('should handle server errors (API 500)', async ({ page }) => {
    await page.route('**/api/getPlayer?*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Server error while fetching player data',
        }),
      });
    });

    const searchInput = page
      .locator('form')
      .first()
      .getByPlaceholder('Faker#KR1');
    await searchInput.fill('Error#500');
    await page.getByRole('button', { name: 'Track Live' }).first().click();

    await expect(
      page.getByText('Server error while fetching player data'),
    ).toBeVisible();
  });
});
