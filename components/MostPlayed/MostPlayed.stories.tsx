import type { Meta, StoryObj } from '@storybook/nextjs';
import { MostPlayed } from './MostPlayed';

const meta: Meta<typeof MostPlayed> = {
  title: 'Summoner/MostPlayed',
  component: MostPlayed,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-surface font-body text-on-surface w-full max-w-2xl rounded-xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MostPlayed>;

export const Default: Story = {
  args: {
    topChamps: [
      ['Ahri', { games: 8, wins: 6, k: 54, d: 15, a: 42 }],
      ['Azir', { games: 5, wins: 2, k: 18, d: 20, a: 30 }],
      ['LeeSin', { games: 2, wins: 2, k: 12, d: 4, a: 15 }],
    ],
  },
};
