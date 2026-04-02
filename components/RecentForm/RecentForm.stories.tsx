import type { Meta, StoryObj } from '@storybook/nextjs';
import { RecentForm } from './RecentForm';

const meta: Meta<typeof RecentForm> = {
  title: 'Summoner/RecentForm',
  component: RecentForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-surface font-body text-on-surface w-87.5 rounded-xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RecentForm>;

export const HighWinRate: Story = {
  args: {
    winRate: 67,
    wins: 10,
    losses: 5,
    kda: '3.40',
    avgKills: '8.2',
    avgDeaths: '4.1',
    avgAssists: '5.8',
    topRoles: [
      ['MID', 12],
      ['JUNGLE', 3],
    ],
  },
};

export const LowWinRate: Story = {
  args: {
    winRate: 33,
    wins: 5,
    losses: 10,
    kda: '1.20',
    avgKills: '2.1',
    avgDeaths: '8.5',
    avgAssists: '4.0',
    topRoles: [
      ['UTILITY', 10], // Testing the UI fallback to 'SUPPORT'
      ['ADC', 5],
    ],
  },
};
