import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LivePlayerCard } from './LivePlayerCard';

describe('LivePlayerCard Component', () => {
  it('renders the player name and champion correctly', () => {
    render(
      <LivePlayerCard
        championName='Ahri'
        summonerName='Hide on bush'
        riotId='Faker#KR1'
      />,
    );

    // It should strip the #KR1 tag and just show "Faker"
    expect(screen.getByText('Faker')).toBeInTheDocument();

    // It should display the champion name
    expect(screen.getByText('Ahri')).toBeInTheDocument();
  });

  it('falls back to summonerName if riotId is missing', () => {
    render(
      <LivePlayerCard
        championName='Zed'
        summonerName='OldSchoolPlayer'
      />,
    );

    expect(screen.getByText('OldSchoolPlayer')).toBeInTheDocument();
  });
});
