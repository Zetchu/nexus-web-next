import React from 'react';

// Explicitly typing this so ESLint doesn't yell about 'any'
interface ChampStats {
  games: number;
  wins: number;
  k: number;
  d: number;
  a: number;
}

interface MostPlayedProps {
  topChamps: [string, ChampStats][];
}

export const MostPlayed: React.FC<MostPlayedProps> = ({ topChamps }) => {
  return (
    <div className="bg-surface-low border-outline-variant/20 rounded-2xl border p-6 md:col-span-2">
      <h3 className="text-on-surface-variant mb-4 text-xs font-bold tracking-wider uppercase">
        Most Played (Recent)
      </h3>
      <div className="flex flex-col gap-3">
        {topChamps.map(([champName, stats]) => {
          const winRate = Math.round((stats.wins / stats.games) * 100);
          const kda = ((stats.k + stats.a) / Math.max(1, stats.d)).toFixed(2);

          return (
            <div
              key={champName}
              className="border-outline-variant/10 flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion/${champName}.png`}
                  className="h-10 w-10 rounded-full"
                  alt={champName}
                />
                <div>
                  <div className="font-bold">{champName}</div>
                  <div className="text-on-surface-variant text-xs">
                    {stats.games} games played
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-bold ${winRate >= 50 ? 'text-primary' : 'text-error'}`}
                >
                  {winRate}% Win Rate
                </div>
                <div className="text-on-surface-variant text-xs">{kda} KDA</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
