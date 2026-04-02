import React from 'react';

interface RecentFormProps {
  winRate: number;
  wins: number;
  losses: number;
  kda: string;
  avgKills: string;
  avgDeaths: string;
  avgAssists: string;
  topRoles: [string, number][];
}

export const RecentForm: React.FC<RecentFormProps> = ({
  winRate,
  wins,
  losses,
  kda,
  avgKills,
  avgDeaths,
  avgAssists,
  topRoles,
}) => {
  return (
    <div className="bg-surface-low border-outline-variant/20 flex flex-col items-center justify-center rounded-2xl border p-6">
      <h3 className="text-on-surface-variant mb-4 text-xs font-bold tracking-wider uppercase">
        Last 15 Games
      </h3>
      <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="border-error/20 absolute inset-0 rounded-full border-8"></div>
        <div
          className="border-primary absolute inset-0 rounded-full border-8"
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% ${winRate}%, 0 ${winRate}%)`,
          }}
        ></div>
        <div className="text-center">
          <div className="text-3xl font-bold">{winRate}%</div>
          <div className="text-on-surface-variant text-xs">
            {wins}W {losses}L
          </div>
        </div>
      </div>
      <div className="border-outline-variant/10 mt-4 w-full border-b pb-4 text-center">
        <div className="font-bold">{kda}:1 KDA</div>
        <div className="text-on-surface-variant text-sm">
          {avgKills} / <span className="text-error">{avgDeaths}</span> /{' '}
          {avgAssists}
        </div>
      </div>

      <div className="mt-4 flex w-full flex-col items-center text-center">
        <div className="text-on-surface-variant mb-2 text-[10px] font-bold tracking-wider uppercase">
          Preferred Roles
        </div>
        <div className="flex gap-4">
          {topRoles.map(([role, count]) => (
            <div key={role} className="flex flex-col items-center">
              <div className="bg-surface-high border-outline-variant/20 text-secondary rounded-lg border px-3 py-1 text-xs font-bold">
                {role === 'UTILITY' ? 'SUPPORT' : role}
              </div>
              <span className="text-on-surface-variant mt-1 text-[10px]">
                {count} Games
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
