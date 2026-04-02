import React from 'react';

interface MasteryItem {
  championId: number;
  championPoints: number;
  championLevel: number;
  [key: string]: unknown;
}

interface TopMasteryProps {
  masteries: MasteryItem[];
  champDict: Record<string, string>;
}

export const TopMastery: React.FC<TopMasteryProps> = ({
  masteries,
  champDict,
}) => {
  return (
    <div className="bg-surface-low border-outline-variant/20 rounded-2xl border p-6 md:col-span-3">
      <h3 className="text-on-surface-variant mb-4 text-xs font-bold tracking-wider uppercase">
        Lifetime Top Mastery
      </h3>
      <div className="grid grid-cols-3 gap-4 text-center">
        {masteries?.map((mastery, index) => {
          const champName =
            champDict[mastery.championId.toString()] || 'Unknown';
          return (
            <div
              key={mastery.championId}
              className="bg-surface-lowest border-outline-variant/10 relative flex flex-col items-center rounded-xl border p-4"
            >
              {index === 0 && (
                <span className="absolute -top-3 text-xl">👑</span>
              )}
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion/${champName}.png`}
                className={`h-16 w-16 rounded-lg shadow-md ${index === 0 ? 'ring-2 ring-yellow-500' : ''}`}
                alt={champName}
              />
              <div className="mt-3 font-bold">{champName}</div>
              <div className="text-secondary text-sm font-medium">
                {(mastery.championPoints / 1000).toFixed(0)}k pts
              </div>
              <div className="text-on-surface-variant mt-1 text-xs">
                Level {mastery.championLevel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
