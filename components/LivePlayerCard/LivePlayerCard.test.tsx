import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LivePlayerCard } from './LivePlayerCard';

describe('LivePlayerCard Component', () => {
  it('renders the player name and champion correctly', () => {
    render(
      <LivePlayerCard
        championName="Ahri"
        summonerName="Hide on bush"
        riotId="Faker#KR1"
      />,
    );

    expect(screen.getByText('Faker')).toBeInTheDocument();

    expect(screen.getByAltText('Ahri')).toBeInTheDocument();
  });

  it('falls back to summonerName if riotId is missing', () => {
    render(
      <LivePlayerCard championName="Zed" summonerName="OldSchoolPlayer" />,
    );

    expect(screen.getByText('OldSchoolPlayer')).toBeInTheDocument();
  });
});
