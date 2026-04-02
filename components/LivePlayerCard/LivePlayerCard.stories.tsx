import type { Meta, StoryObj } from '@storybook/nextjs';
import { LivePlayerCard } from './LivePlayerCard';

const meta: Meta<typeof LivePlayerCard> = {
  title: 'Arena/LivePlayerCard',
  component: LivePlayerCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-surface max-w-sm rounded-xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LivePlayerCard>;

export const BlueTeamStandard: Story = {
  args: {
    championName: 'Ahri',
    summonerName: 'Hide on bush',
    riotId: 'Faker#KR1',
    spell1Name: 'SummonerFlash',
    spell2Name: 'SummonerTeleport',
    primaryRuneIcon: 'perk-images/Styles/Sorcery/SummonAery/SummonAery.png',
    secondaryRuneIcon: 'perk-images/Styles/7200_Domination.png',
    isRedTeam: false,
    tier: 'CHALLENGER',
    rank: 'I',
    winRate: 53,
    totalGames: 450,
    masteryPoints: 250000,
    masteryLevel: 10,
  },
};

// Tests the Red Team layout + High Win Rate Ping + OTP Badge
export const RedTeamSmurfAndOTP: Story = {
  args: {
    championName: 'Zed',
    summonerName: 'Mid Diff',
    riotId: 'Shadow#EUW',
    spell1Name: 'SummonerFlash',
    spell2Name: 'SummonerDot', // Ignite
    primaryRuneIcon: 'perk-images/Styles/Sorcery/SummonAery/SummonAery.png',
    secondaryRuneIcon: 'perk-images/Styles/7200_Domination.png',
    isRedTeam: true,
    tier: 'DIAMOND',
    rank: 'II',
    winRate: 65, // > 55% triggers the red ping indicator
    totalGames: 45, // > 20 games validates the smurf ping
    masteryPoints: 1250000, // > 500k triggers the 🔥 OTP badge
    masteryLevel: 10,
  },
};

// Tests the First Timer warning badge
export const FirstTimerWarning: Story = {
  args: {
    championName: 'Yasuo',
    summonerName: 'Autofilled',
    riotId: 'NeedLP#NA1',
    spell1Name: 'SummonerFlash',
    spell2Name: 'SummonerDot',
    primaryRuneIcon: 'perk-images/Styles/Sorcery/SummonAery/SummonAery.png',
    secondaryRuneIcon: 'perk-images/Styles/7200_Domination.png',
    isRedTeam: false,
    tier: 'PLATINUM',
    rank: 'IV',
    winRate: 48,
    totalGames: 120,
    masteryPoints: 1500,
    masteryLevel: 2, // Level <= 3 triggers the ⚠️ First Timer badge
  },
};

export const MissingDataFallback: Story = {
  args: {
    championName: 'UnknownChamp',
    summonerName: 'Loading Player...',
    isRedTeam: false,
    tier: 'UNRANKED',
    rank: '',
    winRate: 0,
    totalGames: 0,
    masteryPoints: 0,
    masteryLevel: 0,
  },
};
