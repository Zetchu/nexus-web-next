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
      className={`bg-surface-low border ${borderColor} flex items-center gap-3 rounded-xl p-3 ${layoutDirection} hover:bg-surface-high transition-all`}
    >
      {/* Champion Icon */}
      <div className="shrink-0">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${championName}.png`}
          alt={championName}
          className="bg-surface-lowest h-12 w-12 rounded-lg object-cover shadow-inner"
          onError={(e) =>
            (e.currentTarget.src =
              'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png')
          }
        />
      </div>

      {/* Spells & Runes Block */}
      <div className="flex shrink-0 gap-1">
        <div className="flex flex-col gap-1">
          {spell1Name ? (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/spell/${spell1Name}.png`}
              className="h-5 w-5 rounded"
              alt="Spell 1"
            />
          ) : (
            <div className="bg-surface-lowest h-5 w-5 rounded"></div>
          )}
          {spell2Name ? (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/spell/${spell2Name}.png`}
              className="h-5 w-5 rounded"
              alt="Spell 2"
            />
          ) : (
            <div className="bg-surface-lowest h-5 w-5 rounded"></div>
          )}
        </div>
        <div className="bg-surface-lowest flex flex-col gap-1 rounded-md p-0.5">
          {primaryRuneIcon ? (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/img/${primaryRuneIcon}`}
              className="h-5 w-5 rounded-full"
              alt="Primary Rune"
            />
          ) : (
            <div className="bg-surface-low h-5 w-5 rounded-full"></div>
          )}
          {secondaryRuneIcon ? (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/img/${secondaryRuneIcon}`}
              className="mx-auto h-4 w-4 rounded-full opacity-80"
              alt="Secondary Rune"
            />
          ) : (
            <div className="bg-surface-low mx-auto h-4 w-4 rounded-full"></div>
          )}
        </div>
      </div>

      {/* Player Identity */}
      <div className={`${textMargin} flex-1 overflow-hidden`}>
        <p className="text-on-surface w-full truncate text-sm font-bold">
          {displayName}
        </p>
        <p className="text-on-surface-variant truncate text-xs">
          {championName}
        </p>
      </div>
    </div>
  );
};
