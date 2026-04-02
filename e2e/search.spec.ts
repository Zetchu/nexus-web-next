import { test, expect } from '@playwright/test';

test.describe('Search and Dashboard Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should search, load the dashboard, and display all component modules', async ({
    page,
  }) => {
    const mockPuuid = 'fake-123';

    // 1. Mock DDragon Champion JSON! (This prevents the 3MB download from hanging your test)
    await page.route('**/champion.json', async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          data: {
            Ahri: { key: '103', id: 'Ahri' },
          },
        },
      });
    });

    // 2. Mock getPlayer (Using wildcard * for safety with query params)
    await page.route('**/api/getPlayer*', async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          puuid: mockPuuid,
          gameName: 'Shmungi',
          tagLine: 'CPT',
          summonerLevel: 100,
          tier: 'CHALLENGER',
          rank: 'I',
          profileIconId: 6,
          win: 1,
          loss: 1,
          leaguePoints: 0,
        },
      });
    });

    // 3. Mock getMatches (Recent Form & Most Played logic)
    await page.route('**/api/getMatches*', async (route) => {
      await route.fulfill({
        status: 200,
        json: [
          {
            championName: 'Ahri',
            win: true,
            kills: 10,
            deaths: 2,
            assists: 8,
            teamPosition: 'MID',
          },
          {
            championName: 'Ahri',
            win: false,
            kills: 4,
            deaths: 5,
            assists: 2,
            teamPosition: 'MID',
          },
        ],
      });
    });

    // 4. Mock getMastery
    await page.route('**/api/getMastery*', async (route) => {
      await route.fulfill({
        status: 200,
        json: [
          { championId: 103, championPoints: 1000000, championLevel: 10 }, // Ahri
        ],
      });
    });

    // Perform Search
    const searchInput = page
      .locator('form')
      .first()
      .getByPlaceholder('Faker#KR1');
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill('Shmungi#CPT');
    await page.getByRole('button', { name: 'Track Live' }).first().click();

    await expect(page).toHaveURL(/\/summoner\/Shmungi-CPT/);

    // --- ASSERT COMPONENT RENDERING ---

    // Wait for the skeleton to disappear by verifying the header rendered
    const heading = page.getByRole('heading', { name: /Shmungi/ });
    await expect(heading).toBeVisible();

    // 1. ProfileHeader renders
    await expect(page.getByText('Level 100 • CHALLENGER I')).toBeVisible();

    // 2. RecentForm renders
    await expect(page.getByText('Last 15 Games')).toBeVisible();
    await expect(page.getByText('Preferred Roles')).toBeVisible();

    // 3. MostPlayed renders
    await expect(page.getByText('Most Played (Recent)')).toBeVisible();
    await expect(page.getByText('2 games played')).toBeVisible(); // Mock provided 2 Ahri games

    // 4. TopMastery renders
    await expect(page.getByText('Lifetime Top Mastery')).toBeVisible();
    await expect(page.getByText('1000k pts')).toBeVisible();
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
  });

  test('should handle server errors (API 500)', async ({ page }) => {
    await page.route('**/api/getPlayer*', async (route) => {
      await route.fulfill({
        status: 500,
        json: { error: 'Server error while fetching player data' },
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

  test('should navigate from home -> dashboard -> live match -> back to dashboard', async ({
    page,
  }) => {
    const mockPuuid = 'fake-nav-123';

    // 1. Mock all Dashboard APIs
    await page.route('**/champion.json', async (route) => {
      await route.fulfill({
        status: 200,
        json: { data: { Ahri: { key: '103', id: 'Ahri' } } },
      });
    });

    await page.route('**/api/getPlayer*', async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          puuid: mockPuuid,
          gameName: 'JourneyTester',
          tagLine: 'EUW',
          summonerLevel: 50,
          tier: 'GOLD',
          rank: 'IV',
          profileIconId: 1,
        },
      });
    });

    await page.route('**/api/getMatches?*', async (route) => {
      await route.fulfill({ status: 200, json: [] });
    });

    await page.route('**/api/getMastery?*', async (route) => {
      await route.fulfill({ status: 200, json: [] });
    });

    // 2. Mock the Live Match API
    await page.route('**/api/getMatch?*', async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          isLive: true,
          gameMode: 'RANKED',
          gameLength: 300, // 5:00 minutes
          bannedChampions: [],
          participants: [],
        },
      });
    });

    // --- EXECUTE THE JOURNEY ---

    // Step 1: Search from Home
    const searchInput = page
      .locator('form')
      .first()
      .getByPlaceholder('Faker#KR1');
    await searchInput.fill('JourneyTester#EUW');
    await page.getByRole('button', { name: 'Track Live' }).first().click();

    // Step 2: Verify Dashboard Loaded
    await expect(page).toHaveURL(/\/summoner\/JourneyTester-EUW/);
    await expect(
      page.getByRole('heading', { name: /JourneyTester/ }),
    ).toBeVisible();

    // Step 3: Click Spectate Live & Verify Live Page
    await page.getByRole('button', { name: 'Spectate Live' }).click();
    await expect(page).toHaveURL(new RegExp(`/live/${mockPuuid}`));
    await expect(page.getByText('Scanning Live Arenas...')).not.toBeVisible();
    await expect(page.getByText('RANKED • 5:00')).toBeVisible();

    // Step 4: Click Back & Verify Dashboard Restored
    await page.getByRole('button', { name: /Back to Profile/i }).click();
    await expect(page).toHaveURL(/\/summoner\/JourneyTester-EUW/);
    await expect(
      page.getByRole('heading', { name: /JourneyTester/ }),
    ).toBeVisible();
  });
});
