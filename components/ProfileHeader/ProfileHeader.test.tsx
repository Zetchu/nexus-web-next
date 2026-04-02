import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfileHeader } from './ProfileHeader';

// 1. Mock the Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('ProfileHeader', () => {
  const mockSummoner = {
    puuid: 'fake-123',
    gameName: 'Faker',
    tagLine: 'KR1',
    profileIconId: 6,
    summonerLevel: 100,
    tier: 'CHALLENGER',
    rank: 'I',
    leaguePoints: 1050,
    wins: 200,
    losses: 100,
  };

  it('renders the summoner details correctly', () => {
    render(<ProfileHeader summoner={mockSummoner} />);

    // Check Name and Tag
    expect(screen.getByText('Faker')).toBeInTheDocument();
    expect(screen.getByText('#KR1')).toBeInTheDocument();

    // Check Rank and LP
    expect(screen.getByText(/CHALLENGER I/)).toBeInTheDocument();
    expect(screen.getByText(/1050 LP/)).toBeInTheDocument();

    // Check Win/Loss record
    expect(screen.getByText('200W')).toBeInTheDocument();
    expect(screen.getByText('100L')).toBeInTheDocument();
  });

  it('navigates to the live match screen when button is clicked', () => {
    render(<ProfileHeader summoner={mockSummoner} />);

    const button = screen.getByRole('button', { name: /Spectate Live/i });
    fireEvent.click(button);

    // Verify it pushed the correct PUUID to the router
    expect(mockPush).toHaveBeenCalledWith('/live/fake-123');
  });

  it('hides LP and win rate if player is UNRANKED', () => {
    const unrankedSummoner = {
      ...mockSummoner,
      tier: 'UNRANKED',
      rank: '',
      wins: 0,
      losses: 0,
    };
    render(<ProfileHeader summoner={unrankedSummoner} />);

    expect(screen.getByText(/UNRANKED/)).toBeInTheDocument();
    expect(screen.queryByText(/LP/)).not.toBeInTheDocument(); // LP should not exist
  });
});
