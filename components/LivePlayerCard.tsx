import React from 'react';

export interface LivePlayerCardProps {
  championName: string;
  summonerName: string;
  riotId?: string;
  spell1Name?: string;
  spell2Name?: string;
  primaryRuneIcon?: string;
  secondaryRuneIcon?: string;
  isRedTeam?: boolean;
}

export const LivePlayerCard: React.FC<LivePlayerCardProps> = ({
  championName,
  summonerName,
  riotId,
  spell1Name,
  spell2Name,
  primaryRuneIcon,
  secondaryRuneIcon,
  isRedTeam = false,
}) => {
  const displayName = riotId ? riotId.split('#')[0] : summonerName;
  const borderColor = isRedTeam ? 'border-red-900/30' : 'border-blue-900/30';
  const layoutDirection = isRedTeam
    ? 'flex-row-reverse text-right'
    : 'flex-row text-left';
  const textMargin = isRedTeam ? 'mr-3' : 'ml-3';

  return (
    <div
      className={`bg-surface-low border ${borderColor} p-3 rounded-xl flex items-center gap-3 ${layoutDirection} transition-all hover:bg-surface-high`}
    >
      {/* Champion Icon */}
      <div className='shrink-0'>
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${championName}.png`}
          alt={championName}
          className='w-12 h-12 rounded-lg object-cover bg-surface-lowest shadow-inner'
          onError={(e) =>
            (e.currentTarget.src =
              'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png')
          }
        />
      </div>

      {/* Spells & Runes Block */}
      <div className='flex gap-1 shrink-0'>
        <div className='flex flex-col gap-1'>
          {spell1Name ? (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/spell/${spell1Name}.png`}
              className='w-5 h-5 rounded'
              alt='Spell 1'
            />
          ) : (
            <div className='w-5 h-5 rounded bg-surface-lowest'></div>
          )}
          {spell2Name ? (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/spell/${spell2Name}.png`}
              className='w-5 h-5 rounded'
              alt='Spell 2'
            />
          ) : (
            <div className='w-5 h-5 rounded bg-surface-lowest'></div>
          )}
        </div>
        <div className='flex flex-col gap-1 bg-surface-lowest rounded-md p-0.5'>
          {primaryRuneIcon ? (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/img/${primaryRuneIcon}`}
              className='w-5 h-5 rounded-full'
              alt='Primary Rune'
            />
          ) : (
            <div className='w-5 h-5 rounded-full bg-surface-low'></div>
          )}
          {secondaryRuneIcon ? (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/img/${secondaryRuneIcon}`}
              className='w-4 h-4 rounded-full mx-auto opacity-80'
              alt='Secondary Rune'
            />
          ) : (
            <div className='w-4 h-4 rounded-full bg-surface-low mx-auto'></div>
          )}
        </div>
      </div>

      {/* Player Identity */}
      <div className={`${textMargin} flex-1 overflow-hidden`}>
        <p className='text-on-surface font-bold text-sm truncate w-full'>
          {displayName}
        </p>
        <p className='text-on-surface-variant text-xs truncate'>
          {championName}
        </p>
      </div>
    </div>
  );
};
