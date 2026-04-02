import type { Meta, StoryObj } from '@storybook/nextjs';
import { TopMastery } from './TopMastery';

const meta: Meta<typeof TopMastery> = {
  title: 'Summoner/TopMastery',
  component: TopMastery,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-surface font-body text-on-surface w-full max-w-3xl rounded-xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TopMastery>;

export const Default: Story = {
  args: {
    // Mock dictionary mapping IDs to Champ names
    champDict: {
      '103': 'Ahri',
      '157': 'Yasuo',
      '238': 'Zed',
    },
    masteries: [
      {
        championId: 103,
        championPoints: 1250430,
        championLevel: 10,
      },
      {
        championId: 157,
        championPoints: 840100,
        championLevel: 8,
      },
      {
        championId: 238,
        championPoints: 450000,
        championLevel: 7,
      },
    ],
  },
};
