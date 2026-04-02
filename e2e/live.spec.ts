import { test, expect } from '@playwright/test';

test.describe('Live Match Advanced Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display ticking clock, win predictor, and danger tags', async ({
    page,
  }) => {
    const mockPuuid = 'shmungi-unique-puuid';

    // 1. Mock the Live Match API with our new advanced scouting data
    await page.route(`**/api/getMatch?puuid=${mockPuuid}`, async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          isLive: true,
          gameMode: 'CLASSIC',
          gameLength: 600, // 600 seconds = 10:00
          bannedChampions: [
            { championName: 'Yasuo', teamId: 100 },
            { championName: 'Zed', teamId: 200 },
          ],
          participants: [
            {
              teamId: 100,
              championName: 'LeeSin',
              summonerName: 'Shmungi', // Blue team Smurf & OTP
              spell1Name: 'SummonerFlash',
              spell2Name: 'SummonerSmite',
              tier: 'CHALLENGER',
              rank: 'I',
              winRate: 65,
              totalGames: 120,
              masteryPoints: 1500000, // Over 500k = OTP
              masteryLevel: 10,
            },
            {
              teamId: 200,
              championName: 'Aatrox',
              summonerName: 'EnemyPro', // Red team First Timer
              spell1Name: 'SummonerFlash',
              spell2Name: 'SummonerTeleport',
              tier: 'DIAMOND',
              rank: 'IV',
              winRate: 45,
              totalGames: 50,
              masteryPoints: 1200,
              masteryLevel: 2, // Level <= 3 = First Timer
            },
          ],
        },
      });
    });

    // 2. Navigate directly to the live match
    await page.goto(`/live/${mockPuuid}`);

    // Wait for the loading state to finish
    await expect(page.getByText('Scanning Live Arenas...')).not.toBeVisible();

    // --- NEW ASSERTIONS ---

    // 1. Check the new Clock formatting (600 seconds -> 10:00)
    await expect(page.getByText('CLASSIC • 10:00')).toBeVisible();

    // 2. Check the Win Predictor Bar
    await expect(page.getByText(/Blue Team Advantage/)).toBeVisible();
    await expect(page.getByText(/Red Team Advantage/)).toBeVisible();

    // 3. Check the Danger Tags
    await expect(page.getByText('🔥 OTP')).toBeVisible();
    await expect(page.getByText('⚠️ First Timer')).toBeVisible();

    // 4. Verify specific players loaded
    await expect(page.getByText('Shmungi')).toBeVisible();
    await expect(page.getByText('EnemyPro')).toBeVisible();
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

    await expect(page.getByText('💤')).toBeVisible();
    await expect(page.getByText('No Active Match')).toBeVisible();
    await page.getByRole('button', { name: 'Go Back' }).click();
  });
});
