import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RecentForm } from './RecentForm';

describe('RecentForm', () => {
  it('renders stats correctly', () => {
    render(
      <RecentForm
        winRate={60}
        wins={9}
        losses={6}
        kda="3.50"
        avgKills="10"
        avgDeaths="4"
        avgAssists="4"
        topRoles={[
          ['MID', 10],
          ['JUNGLE', 5],
        ]}
      />,
    );

    // Check overall stats
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('9W 6L')).toBeInTheDocument();
    expect(screen.getByText('3.50:1 KDA')).toBeInTheDocument();

    // Check preferred roles mapped correctly
    expect(screen.getByText('MID')).toBeInTheDocument();
    expect(screen.getByText('10 Games')).toBeInTheDocument();
  });

  it('translates UTILITY role to SUPPORT', () => {
    render(
      <RecentForm
        winRate={50}
        wins={1}
        losses={1}
        kda="2.00"
        avgKills="1"
        avgDeaths="1"
        avgAssists="1"
        topRoles={[['UTILITY', 2]]}
      />,
    );

    // Riot's API says "UTILITY", but our UI should say "SUPPORT"
    expect(screen.getByText('SUPPORT')).toBeInTheDocument();
    expect(screen.queryByText('UTILITY')).not.toBeInTheDocument();
  });
});
