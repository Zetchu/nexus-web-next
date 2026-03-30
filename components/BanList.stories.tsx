import type { Meta, StoryObj } from '@storybook/nextjs';
import { BanList } from './BanList';

const meta: Meta<typeof BanList> = {
  title: 'Arena/BanList',
  component: BanList,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-surface max-w-4xl rounded-xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BanList>;

export const FullDraft: Story = {
  args: {
    blueBans: ['Yasuo', 'Yone', 'Zed', 'Akali', 'Katarina'],
    redBans: ['Darius', 'Garen', 'Teemo', 'Malphite', 'Sion'],
  },
};

export const PartialDraft: Story = {
  args: {
    blueBans: ['Yasuo', 'Yone'],
    redBans: ['Darius'],
  },
};

export const EmptyDraft: Story = {
  args: {
    blueBans: [],
    redBans: [],
  },
};
