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

  // New Ranked Props from the API
  tier?: string;
  rank?: string;
  winRate?: number;
  totalGames?: number;

  masteryPoints?: number;
  masteryLevel?: number;
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
  tier = 'UNRANKED',
  rank = '',
  winRate = 0,
  totalGames = 0,
  masteryPoints = 0,
  masteryLevel = 0,
}) => {
  const displayName = riotId ? riotId.split('#')[0] : summonerName;
  const borderColor = isRedTeam ? 'border-red-900/30' : 'border-blue-900/30';
  const layoutDirection = isRedTeam
    ? 'flex-row-reverse text-right'
    : 'flex-row text-left';
  const textMargin = isRedTeam ? 'mr-3' : 'ml-3';
  const justifyText = isRedTeam ? 'justify-end' : 'justify-start';

  // Scouting Logic: Flag players with high win rates and a decent sample size
  const isSmurf = winRate >= 55 && totalGames > 20;
  const rankColor =
    tier === 'UNRANKED' ? 'text-on-surface-variant' : 'text-secondary';

  const isOTP = masteryPoints >= 500000;
  const isFirstTimer = masteryLevel <= 3;

  return (
    <div
      className={`bg-surface-low relative border ${borderColor} flex items-center gap-3 rounded-xl p-3 ${layoutDirection} hover:bg-surface-high transition-all`}
    >
      {/* Danger Indicator for High Winrate Players */}
      {isSmurf && (
        <div
          className={`absolute top-0 -mt-1.5 flex h-3 w-3 ${isRedTeam ? 'left-0 -ml-1.5' : 'right-0 -mr-1.5'}`}
        >
          <span className="bg-error absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
          <span className="bg-error border-surface relative inline-flex h-3 w-3 rounded-full border"></span>
        </div>
      )}

      {/* Champion Icon */}
      <div className="shrink-0">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/champion/${championName}.png`}
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
              src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/spell/${spell1Name}.png`}
              className="h-5 w-5 rounded"
              alt="Spell 1"
            />
          ) : (
            <div className="bg-surface-lowest h-5 w-5 rounded"></div>
          )}
          {spell2Name ? (
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/16.6.1/img/spell/${spell2Name}.png`}
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

      {/* Player Identity & Ranked Scouting */}
      <div className={`${textMargin} flex-1 overflow-hidden`}>
        <p className="text-on-surface w-full truncate text-sm font-bold">
          {displayName}
        </p>

        {/* Ranked Stats Row */}
        <div
          className={`mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] ${justifyText}`}
        >
          <span className={`${rankColor} font-bold`}>
            {tier} {rank}
          </span>

          {tier !== 'UNRANKED' && (
            <>
              <span className="text-outline-variant">•</span>
              <span
                className={`${isSmurf ? 'text-error font-bold' : 'text-on-surface-variant'}`}
              >
                {winRate}% WR
              </span>
              <span className="text-on-surface-variant/50">
                ({totalGames}G)
              </span>
            </>
          )}
        </div>
        {/* DANGER TAGS */}
        {(isOTP || isFirstTimer) && (
          <div className={`mt-1 flex gap-1 ${justifyText}`}>
            {isOTP && (
              <span className="inline-flex items-center gap-1 rounded bg-orange-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-orange-400 uppercase ring-1 ring-orange-500/30 ring-inset">
                🔥 OTP
              </span>
            )}
            {isFirstTimer && (
              <span className="inline-flex items-center gap-1 rounded bg-yellow-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-yellow-400 uppercase ring-1 ring-yellow-500/30 ring-inset">
                ⚠️ First Timer
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
