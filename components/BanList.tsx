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
    <div className='flex justify-between items-center bg-surface-low rounded-xl p-4 border border-outline-variant/20 shadow-ambient'>
      {/* Blue Bans */}
      <div className='flex gap-2'>
        {blueBans.map((champ, idx) => (
          <div
            key={`b-${idx}`}
            className='relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden grayscale opacity-70 border border-blue-900/50'
          >
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${champ}.png`}
              alt={champ}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-red-500/20'></div>
            <div className='absolute top-1/2 left-0 w-full h-0.5 bg-red-500 -rotate-45 transform -translate-y-1/2'></div>
          </div>
        ))}
      </div>

      <p className='text-xs font-display text-on-surface-variant uppercase tracking-widest px-4'>
        Bans
      </p>

      {/* Red Bans */}
      <div className='flex gap-2'>
        {redBans.map((champ, idx) => (
          <div
            key={`r-${idx}`}
            className='relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden grayscale opacity-70 border border-red-900/50'
          >
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${champ}.png`}
              alt={champ}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-red-500/20'></div>
            <div className='absolute top-1/2 left-0 w-full h-0.5 bg-red-500 -rotate-45 transform -translate-y-1/2'></div>
          </div>
        ))}
      </div>
    </div>
  );
};
