'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const modules = [
  {
    title: 'Live Match Feed',
    description:
      'Instant access to ongoing matches. Monitor gold leads, objective control, and power spikes as they happen in real-time.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
    color: 'text-primary',
    borderColor: 'border-primary/20',
    bgColor: 'bg-primary/10',
    progressColor: 'bg-primary',
  },
  {
    title: 'Pro Scout',
    description:
      'Follow your favorite pro players and high-elo icons. Get notified the second they enter the Rift and track their build paths live.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59"
      />
    ),
    color: 'text-secondary',
    borderColor: 'border-secondary/20',
    bgColor: 'bg-secondary/10',
    progressColor: 'bg-secondary',
  },
  {
    title: 'Performance Metrics',
    description:
      'Deep-dive into live stats. Compare current performance against historical averages to see if a player is having a career-best game.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
      />
    ),
    color: 'text-primary-container',
    borderColor: 'border-primary-container/20',
    bgColor: 'bg-primary-container/10',
    progressColor: 'bg-primary-container',
  },
];

export default function Home() {
  const router = useRouter();
  const [riotId, setRiotId] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!riotId.includes('#')) {
      setError('Please include the tagline (e.g., Faker#KR1)');
      return;
    }

    const [gameName, tagLine] = riotId.split('#');

    if (!gameName || !tagLine) {
      setError('Invalid format. Use GameName#TagLine');
      return;
    }

    // INSTANT NAVIGATION: Let the Summoner page do the heavy lifting
    router.push(
      `/summoner/${encodeURIComponent(gameName)}-${encodeURIComponent(tagLine)}`,
    );
  };
  return (
    <div className="bg-surface selection:bg-primary/30 relative isolate overflow-hidden">
      {/* Background Glow */}
      <div
        className="absolute -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="from-primary to-secondary relative left-[calc(50%-11rem)] aspect-1155/678 w-288.75 -translate-x-1/2 rotate-30 bg-linear-to-tr opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:shrink-0">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <div className="inline-flex space-x-6">
              <span className="bg-surface-high/50 text-primary ring-primary/20 rounded-full px-3 py-1 text-sm font-semibold ring-1 backdrop-blur-sm ring-inset">
                <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
                RIOT API LIVE SYNC
              </span>
            </div>
          </div>
          <h1 className="font-display text-on-surface mt-10 text-5xl leading-[1.1] font-bold tracking-tight sm:text-7xl">
            TRACK THE{' '}
            <span className="bg-kinetic-gradient bg-clip-text text-transparent">
              BEST.
            </span>
            <br />
            WATCH THEM{' '}
            <span className="bg-kinetic-gradient bg-clip-text text-transparent">
              LIVE.
            </span>
          </h1>
          <p className="text-on-surface-variant mt-6 text-lg leading-8">
            The premium command center for tracking high-elo matches. Get
            real-time data on your favorite pros and climb by learning from the
            source.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-10 flex flex-col gap-4">
            <div className="flex max-w-md flex-col gap-4 sm:flex-row">
              <input
                type="text"
                value={riotId}
                onChange={(e) => setRiotId(e.target.value)}
                placeholder="Faker#KR1"
                className="bg-surface-lowest border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-primary font-body w-full rounded-sm border px-5 py-3.5 text-lg transition-all outline-none focus:ring-1"
              />
              <button
                type="submit"
                className="bg-primary-container text-on-primary-fixed hover:bg-primary hover:shadow-glow-victory rounded-sm px-8 py-3.5 text-sm font-bold tracking-wider whitespace-nowrap uppercase transition-all duration-300"
              >
                Track Live
              </button>
            </div>
            {error && (
              <p className="text-error animate-pulse text-sm font-medium">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Dashboard Mockup */}
        <div className="mx-auto flex max-w-2xl sm:mt-24 lg:mt-32 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="border-outline-variant/20 bg-surface-low rounded-xl border p-2 shadow-2xl ring-1 ring-white/5">
              <div className="bg-surface rounded-lg px-6 pt-4 pb-6">
                <div className="border-outline-variant/10 flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-surface-high flex h-10 w-10 items-center justify-center rounded-lg">
                      <div className="bg-primary/20 flex h-6 w-6 items-center justify-center rounded-full">
                        <div className="bg-primary h-2 w-2 animate-ping rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-on-surface-variant text-[10px] font-bold tracking-wider uppercase">
                        Current Live Tracker
                      </div>
                      <div className="text-on-surface text-sm font-bold">
                        T1 Faker#KR1
                      </div>
                    </div>
                  </div>
                  <span className="bg-surface-variant/30 text-secondary ring-secondary/20 inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium tracking-wider uppercase ring-1 ring-inset">
                    In-Game: 14:22
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="bg-surface-high/30 relative flex flex-col items-center justify-center rounded-xl p-6">
                    <div className="relative h-32 w-32">
                      <svg
                        className="h-full w-full rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          className="text-surface-variant/20"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        ></path>
                        <path
                          className="text-primary"
                          strokeDasharray="85, 100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-display text-on-surface text-4xl font-bold">
                          9.2
                        </span>
                        <span className="text-on-surface-variant text-[0.6rem] tracking-widest uppercase">
                          CS/MIN
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <div className="text-on-surface font-bold">
                        Dominating Lane
                      </div>
                      <div className="text-secondary text-xs">
                        +1,240 Gold Lead
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center space-y-3">
                    <div className="text-on-surface-variant text-[10px] font-bold tracking-wider uppercase">
                      Live Objective Priority
                    </div>
                    <div className="bg-surface-high flex items-center justify-between rounded-lg p-3 ring-1 ring-white/5">
                      <div className="flex items-center gap-3">
                        <div className="bg-surface-variant flex h-8 w-8 items-center justify-center rounded-full">
                          🔥
                        </div>
                        <div>
                          <div className="text-primary text-xs font-bold uppercase">
                            Infernal Drake
                          </div>
                          <div className="text-on-surface-variant text-xs">
                            Spawning in 0:45
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <div className="bg-surface-lowest py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="font-display text-on-surface text-3xl font-bold tracking-tight uppercase sm:text-4xl">
              Live Data{' '}
              <span className="bg-kinetic-gradient bg-clip-text text-transparent">
                Architecture
              </span>
            </h2>
            <div className="from-primary mt-4 h-1 w-20 bg-linear-to-r to-transparent"></div>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {modules.map((module) => (
              <div
                key={module.title}
                className="bg-surface-low hover:bg-surface-high flex flex-col justify-between rounded-sm p-8 ring-1 ring-white/5 transition"
              >
                <div>
                  <div
                    className={`mb-6 inline-flex rounded-lg ${module.bgColor} p-3 ring-1 ${module.borderColor}`}
                  >
                    <svg
                      className={`h-6 w-6 ${module.color}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      {module.icon}
                    </svg>
                  </div>
                  <h3 className="font-display text-on-surface text-lg leading-8 font-bold">
                    {module.title}
                  </h3>
                  <p className="text-on-surface-variant mt-2 text-sm leading-7">
                    {module.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Search */}
      <div className="bg-surface-lowest border-outline-variant/10 border-t py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="font-display text-on-surface mb-2 text-4xl font-bold tracking-tight uppercase sm:text-6xl">
            Start Tracking
          </h2>
          <h2 className="text-primary-container font-display mb-12 text-4xl font-bold tracking-tight uppercase sm:text-6xl">
            Enter any Riot ID
          </h2>

          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <input
              type="text"
              value={riotId}
              onChange={(e) => setRiotId(e.target.value)}
              placeholder="GameName#TagLine"
              className="bg-surface-container/50 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-primary w-full rounded-sm border-0 px-4 py-3.5 shadow-sm ring-1 ring-white/10 ring-inset focus:ring-2 sm:text-sm sm:leading-6"
            />
            <button
              type="submit"
              className="bg-primary-container text-on-primary-fixed hover:bg-primary hover:text-surface-lowest w-full flex-none rounded-sm px-8 py-3.5 text-sm font-bold tracking-wider uppercase shadow-sm transition-all duration-300 sm:w-auto"
            >
              Analyze Live
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
