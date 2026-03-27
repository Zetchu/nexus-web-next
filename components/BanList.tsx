import React from 'react';

export interface BanListProps {
  blueBans?: string[];
  redBans?: string[];
}

export const BanList: React.FC<BanListProps> = ({
  blueBans = [],
  redBans = [],
}) => {
  if (blueBans.length === 0 && redBans.length === 0) return null;

  return (
    <div className="bg-surface-low border-outline-variant/20 shadow-ambient flex items-center justify-between rounded-xl border p-4">
      {/* Blue Bans */}
      <div className="flex gap-2">
        {blueBans.map((champ, idx) => (
          <div
            key={`b-${idx}`}
            className="relative h-8 w-8 overflow-hidden rounded-full border border-blue-900/50 opacity-70 grayscale md:h-10 md:w-10"
          >
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion/${champ}.png`}
              alt={champ}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-red-500/20"></div>
            <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 -rotate-45 transform bg-red-500"></div>
          </div>
        ))}
      </div>

      <p className="font-display text-on-surface-variant px-4 text-xs tracking-widest uppercase">
        Bans
      </p>

      {/* Red Bans */}
      <div className="flex gap-2">
        {redBans.map((champ, idx) => (
          <div
            key={`r-${idx}`}
            className="relative h-8 w-8 overflow-hidden rounded-full border border-red-900/50 opacity-70 grayscale md:h-10 md:w-10"
          >
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion/${champ}.png`}
              alt={champ}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-red-500/20"></div>
            <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 -rotate-45 transform bg-red-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
