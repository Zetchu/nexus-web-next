import type { Meta, StoryObj } from '@storybook/react';
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

export const BlueTeamPlayer: Story = {
  args: {
    championName: 'Ahri',
    summonerName: 'Hide on bush',
    riotId: 'Faker#KR1',
    spell1Name: 'SummonerFlash',
    spell2Name: 'SummonerTeleport',
    primaryRuneIcon: 'perk-images/Styles/Sorcery/Electrocute/Electrocute.png',
    secondaryRuneIcon: 'perk-images/Styles/7200_Domination.png',
    isRedTeam: false,
  },
};

export const RedTeamPlayer: Story = {
  args: {
    championName: 'Zed',
    summonerName: 'Mid Diff',
    riotId: 'Shadow#EUW',
    spell1Name: 'SummonerFlash',
    spell2Name: 'SummonerDot', // Ignite
    primaryRuneIcon: 'perk-images/Styles/Sorcery/Electrocute/Electrocute.png',
    secondaryRuneIcon: 'perk-images/Styles/7200_Domination.png',
    isRedTeam: true,
  },
};

export const MissingDataFallback: Story = {
  args: {
    championName: 'UnknownChamp',
    summonerName: 'Loading Player...',
    isRedTeam: false,
  },
};
