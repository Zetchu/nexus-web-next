import { test, expect } from '@playwright/test';

test.describe('Live Match Mocking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  test('should navigate to and display a live match with mock data', async ({
    page,
  }) => {
    const mockPuuid = 'shmungi-unique-puuid';

    // 1. Mock the Player Search API (called on the profile pagee)
    await page.route(`**/api/getPlayer?*`, async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          puuid: mockPuuid,
          gameName: 'Shmungi',
          tagLine: 'CPT',
          tier: 'CHALLENGER',
          rank: 'I',
        },
      });
    });

    // 2. Mock the Live Match API (called on /live/[puuid])
    await page.route(`**/api/getMatch?puuid=${mockPuuid}`, async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          isLive: true,
          gameMode: 'CLASSIC',
          gameLength: 600, // 10 minutes
          bannedChampions: [
            { championName: 'Yasuo', teamId: 100 },
            { championName: 'Zed', teamId: 200 },
          ],
          participants: [
            {
              teamId: 100,
              championName: 'LeeSin',
              summonerName: 'Shmungi',
              spell1Name: 'SummonerFlash',
              spell2Name: 'SummonerSmite',
            },
            {
              teamId: 200,
              championName: 'Aatrox',
              summonerName: 'EnemyPro',
              spell1Name: 'SummonerFlash',
              spell2Name: 'SummonerTeleport',
            },
          ],
        },
      });
    });

    // 3. Start at Home and search
    await page.goto('/');
    const searchInput = page
      .locator('form')
      .first()
      .getByPlaceholder('Faker#KR1');
    await searchInput.fill('Shmungi#CPT');
    await page.getByRole('button', { name: 'Track Live' }).first().click();

    // 4. On the Profile page, click the "Live Match" link/button
    // (Assuming your Profile page has a link to /live/[puuid])
    await page.goto(`/live/${mockPuuid}`);

    // 5. Verify Live Match UI
    // Check if the loading state finishes
    await expect(page.getByText('Scanning Live Arenas...')).not.toBeVisible();

    // Verify Game Info
    await expect(page.getByText('CLASSIC • 10 mins')).toBeVisible();

    // Verify Blue Team Participant
    const blueTeamSection = page
      .locator('section')
      .filter({ hasText: 'Blue Team' });
    await expect(blueTeamSection.getByText('Shmungi')).toBeVisible();
    await expect(blueTeamSection.getByText('LeeSin')).toBeVisible();

    // Verify Bans
    await expect(page.getByAltText(/Yasuo/i)).toBeVisible();
    await expect(page.getByAltText(/Zed/i)).toBeVisible();
  });

  test('should show "No Active Match" if player is not in game', async ({
    page,
  }) => {
    const mockPuuid = 'offline-puuid';

    await page.route(`**/api/getMatch?puuid=${mockPuuid}`, async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          isLive: false,
          message: 'Summoner is not currently in a match.',
        },
      });
    });

    await page.goto(`/live/${mockPuuid}`);

    // Verify the "Sleep" emoji and message defined in your page.tsx
    await expect(page.getByText('💤')).toBeVisible();
    await expect(page.getByText('No Active Match')).toBeVisible();
    await expect(
      page.getByText('Summoner is not currently in a match.'),
    ).toBeVisible();

    // Verify back button works
    await page.getByRole('button', { name: 'Go Back' }).click();
  });
});
