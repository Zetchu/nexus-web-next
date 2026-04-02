import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProfileHeader } from './ProfileHeader';

const meta: Meta<typeof ProfileHeader> = {
  title: 'Summoner/ProfileHeader',
  component: ProfileHeader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-surface font-body text-on-surface min-h-50 max-w-4xl rounded-xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProfileHeader>;

export const ChallengerProfile: Story = {
  args: {
    summoner: {
      puuid: 'mock-puuid-1234',
      gameName: 'Hide on bush',
      tagLine: 'KR1',
      profileIconId: 6, // Classic rose icon
      summonerLevel: 854,
      tier: 'CHALLENGER',
      rank: 'I',
      leaguePoints: 0,
      wins: 250,
      losses: 100,
    },
  },
};

export const UnrankedProfile: Story = {
  args: {
    summoner: {
      puuid: 'mock-puuid-5678',
      gameName: 'New Player',
      tagLine: 'EUW',
      profileIconId: 29,
      summonerLevel: 12,
      tier: 'UNRANKED',
      rank: '',
      leaguePoints: 0,
      wins: 0,
      losses: 0,
    },
  },
};
