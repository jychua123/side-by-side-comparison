import { useEffect, useState } from 'react';
import { ArrowUpRight, Columns2, Columns3, Monitor, RotateCw, Smartphone, Square, X } from 'lucide-react';
import { ITERATIONS, NIELSEN_HEURISTICS_MAP, type IterationId, type IterationSpec } from './data/iterations';
import { ViewportFrame, type ViewportMode } from './components/ViewportFrame';

type LayoutMode = 'three' | 'two' | 'single';

export default function App() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('three');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [frameHeight, setFrameHeight] = useState<number>(620);
  const [pairIds, setPairIds] = useState<[IterationId, IterationId]>(['original', 'v2']);
  const [singleId, setSingleId] = useState<IterationId>('v2');
  const [fullscreenIteration, setFullscreenIteration] = useState<IterationSpec | null>(null);
  const [fullscreenNonce, setFullscreenNonce] = useState<number>(0);
  const [heuristicQuery, setHeuristicQuery] = useState<string>('');

  useEffect(() => {
    if (!fullscreenIteration) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFullscreenIteration(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [fullscreenIteration]);

  const visibleIterations: IterationSpec[] =
    layoutMode === 'three'
      ? ITERATIONS
      : layoutMode === 'two'
        ? ITERATIONS.filter((item) => pairIds.includes(item.id))
        : ITERATIONS.filter((item) => item.id === singleId);

  const filteredHeuristics = NIELSEN_HEURISTICS_MAP.filter((row) => {
    const query = heuristicQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      row.number.toLowerCase().includes(query) ||
      row.heuristic.toLowerCase().includes(query) ||
      row.baselineGap.toLowerCase().includes(query) ||
      row.v2Implementation.toLowerCase().includes(query)
    );
  });

  const handleLayoutSwitch = (next: LayoutMode) => {
    setLayoutMode(next);
    if (next === 'single' && viewportMode === 'desktop') {
      setViewportMode('native');
    } else if (next === 'three' && viewportMode === 'native') {
      setViewportMode('desktop');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Bar Contract: Brand wordmark — Concise nav links — 1 Primary action */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#comparison"
            className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB]"
          >
            SimplyGo UX Study
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#comparison"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Comparison
            </a>
            <a
              href="#rationale"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Iteration Rationale
            </a>
            <a
              href="#heuristics"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Nielsen Heuristics
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                setLayoutMode('three');
                setViewportMode('desktop');
                document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 text-xs font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
            >
              Reset 3-Up View
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Editorial Intro */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-8 pt-8 pb-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="max-w-3xl">
              <p className="text-xs font-medium text-slate-500">
                Design Progression · 3 Live Vercel Deployments
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
                Side-by-Side UI/UX Iteration Comparison
              </h1>
              <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-600">
                Compare the SimplyGo baseline replica against Version 1 (built around intuitive
                commuter accounts) and Version 2 (refined with Jakob Nielsen&apos;s 10 Usability
                Heuristics) in live interactive viewports.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 shrink-0">
              <span>00 Original Baseline</span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span>01 Intuitive Accounts</span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span>02 Nielsen&apos;s 10 Heuristics</span>
            </div>
          </div>

          {/* Workspace Toolbar */}
          <div
            id="comparison"
            className="scroll-mt-20 pt-5 flex flex-wrap items-center justify-between gap-4"
          >
            {/* Layout Mode Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                role="group"
                aria-label="Comparison layout"
                className="inline-flex items-center p-1 bg-slate-200/70 rounded-lg"
              >
                <button
                  type="button"
                  onClick={() => handleLayoutSwitch('three')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    layoutMode === 'three'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  <span>3-Up Side-by-Side</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLayoutSwitch('two')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    layoutMode === 'two'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns2 className="w-3.5 h-3.5" />
                  <span>2-Up Diff</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLayoutSwitch('single')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    layoutMode === 'single'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Single Focus</span>
                </button>
              </div>

              {/* Contextual Version Selectors for 2-Up / Single */}
              {layoutMode === 'two' && (
                <div className="flex items-center gap-2 text-xs">
                  <label htmlFor="pair-select" className="text-slate-500 whitespace-nowrap">
                    Compare pair:
                  </label>
                  <select
                    id="pair-select"
                    value={`${pairIds[0]}-${pairIds[1]}`}
                    onChange={(e) => {
                      const [a, b] = e.target.value.split('-') as [IterationId, IterationId];
                      setPairIds([a, b]);
                    }}
                    className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus-visible:outline-2 focus-visible:outline-[#2563EB]"
                  >
                    <option value="original-v1">Original vs. Version 1 (Accounts)</option>
                    <option value="v1-v2">Version 1 vs. Version 2 (Nielsen)</option>
                    <option value="original-v2">Original vs. Version 2 (Nielsen)</option>
                  </select>
                </div>
              )}

              {layoutMode === 'single' && (
                <div
                  role="group"
                  aria-label="Select version"
                  className="inline-flex items-center p-1 bg-slate-200/70 rounded-lg"
                >
                  {ITERATIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSingleId(item.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        singleId === item.id
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item.indexLabel}. {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Viewport Simulation & Height Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                role="group"
                aria-label="Viewport width simulation"
                className="inline-flex items-center p-1 bg-slate-200/70 rounded-lg"
              >
                <button
                  type="button"
                  onClick={() => setViewportMode('desktop')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    viewportMode === 'desktop'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop 1280</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('mobile')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    viewportMode === 'mobile'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile 390</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('native')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    viewportMode === 'native'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Native Fit
                </button>
              </div>

              <div className="inline-flex items-center gap-2 text-xs text-slate-600">
                <label htmlFor="height-select" className="whitespace-nowrap">
                  Height:
                </label>
                <select
                  id="height-select"
                  value={frameHeight}
                  onChange={(e) => setFrameHeight(Number(e.target.value))}
                  className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-mono tabular-nums text-slate-800 focus-visible:outline-2 focus-visible:outline-[#2563EB]"
                >
                  <option value={520}>520px</option>
                  <option value={620}>620px</option>
                  <option value={760}>760px</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Side-by-Side Live Comparison Grid */}
        <section
          aria-label="Live side-by-side comparison"
          className="max-w-[1440px] mx-auto px-6 lg:px-8 pb-14"
        >
          <div
            className={`grid gap-5 ${
              layoutMode === 'three'
                ? 'grid-cols-1 lg:grid-cols-3'
                : layoutMode === 'two'
                  ? 'grid-cols-1 lg:grid-cols-2'
                  : 'grid-cols-1'
            }`}
          >
            {visibleIterations.map((iteration) => (
              <ViewportFrame
                key={iteration.id}
                iteration={iteration}
                viewportMode={viewportMode}
                frameHeight={frameHeight}
                onInspectFullscreen={(item) => {
                  setFullscreenNonce(0);
                  setFullscreenIteration(item);
                }}
                highlighted={iteration.id === 'v2' && layoutMode === 'three'}
              />
            ))}
          </div>
        </section>

        {/* Iteration Rationale Summary Section */}
        <section
          id="rationale"
          className="scroll-mt-20 border-t border-slate-200 bg-white py-14"
        >
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-[#1D4ED8]">Design Rationale</p>
              <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                Why Each Iteration Changed
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">
                Each release addresses a specific layer of commuter friction—moving from structural
                parity in the original replica, to account-centric clarity in Version 1, to
                measurable usability safeguards in Version 2.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {ITERATIONS.map((iteration) => (
                <div
                  key={iteration.id}
                  className="pt-5 border-t border-slate-200 flex flex-col justify-between gap-6"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-xs font-medium text-slate-500 tabular-nums">
                        {iteration.indexLabel} · {iteration.methodology}
                      </span>
                      <a
                        href={iteration.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#1D4ED8] hover:underline whitespace-nowrap shrink-0"
                      >
                        <span>Visit build</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                      {iteration.name}
                    </h3>

                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      {iteration.summary}
                    </p>

                    <dl className="mt-6 space-y-4">
                      {iteration.changes.map((change) => (
                        <div key={change.area} className="pt-3 border-t border-slate-100">
                          <dt className="text-xs font-semibold text-slate-900">{change.area}</dt>
                          <dd className="mt-1 text-sm leading-relaxed text-slate-600">
                            {change.rationale}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="font-mono text-xs text-slate-400 truncate">
                      {iteration.shortUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFullscreenNonce(0);
                        setFullscreenIteration(iteration);
                      }}
                      className="text-xs font-medium text-slate-700 hover:text-[#1D4ED8] whitespace-nowrap shrink-0"
                    >
                      Inspect full viewport
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nielsen's 10 Heuristics Matrix */}
        <section
          id="heuristics"
          className="scroll-mt-20 border-t border-slate-200 bg-[#F8FAFC] py-14"
        >
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-medium text-[#1D4ED8]">Version 2 Audit Matrix</p>
                <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                  Applied Nielsen&apos;s 10 Usability Heuristics
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  How each of Jakob Nielsen&apos;s 10 heuristics translates into concrete UI
                  changes between the baseline experience and Version 2.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="search"
                  value={heuristicQuery}
                  onChange={(e) => setHeuristicQuery(e.target.value)}
                  placeholder="Filter heuristics (e.g. stock, search, Singpass)..."
                  aria-label="Filter Nielsen heuristics"
                  className="w-full sm:w-72 h-10 px-3.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-[#2563EB]"
                />
                {heuristicQuery && (
                  <button
                    type="button"
                    onClick={() => setHeuristicQuery('')}
                    className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-700">
                      <th className="py-3.5 px-4 w-20">Rule</th>
                      <th className="py-3.5 px-4 w-64">Heuristic</th>
                      <th className="py-3.5 px-4">Baseline Friction</th>
                      <th className="py-3.5 px-4">Version 2 Design Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredHeuristics.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 px-4 text-center text-slate-500">
                          No heuristics matched &ldquo;{heuristicQuery}&rdquo;.
                        </td>
                      </tr>
                    ) : (
                      filteredHeuristics.map((row) => (
                        <tr key={row.number} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#1D4ED8] tabular-nums align-top">
                            {row.number}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900 align-top">
                            {row.heuristic}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 align-top">
                            {row.baselineGap}
                          </td>
                          <td className="py-3.5 px-4 text-slate-800 align-top">
                            {row.v2Implementation}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>SimplyGo UI/UX Iteration Comparison · Original Replica, Version 1, Version 2</p>
          <div className="flex flex-wrap items-center gap-5">
            {ITERATIONS.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900 hover:underline whitespace-nowrap"
              >
                {item.name} ↗
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Unobstructed Fullscreen Lightbox Modal */}
      {fullscreenIteration && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${fullscreenIteration.name} fullscreen comparison`}
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs p-4 sm:p-6 flex flex-col"
        >
          <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xl">
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-slate-200 bg-white">
              <div className="flex flex-wrap items-baseline gap-2.5 min-w-0">
                <span className="font-mono text-xs font-semibold text-[#1D4ED8] tabular-nums">
                  {fullscreenIteration.indexLabel}
                </span>
                <h2 className="text-base font-bold text-slate-900 truncate">
                  {fullscreenIteration.name}
                </h2>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  {fullscreenIteration.methodology}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg mr-2">
                  {ITERATIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setFullscreenNonce(0);
                        setFullscreenIteration(item);
                      }}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        fullscreenIteration.id === item.id
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setFullscreenNonce((prev) => prev + 1)}
                  aria-label="Reload fullscreen preview"
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Reload</span>
                </button>

                <a
                  href={fullscreenIteration.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-[#1D4ED8] text-white text-xs font-medium hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
                >
                  <span>Open Live</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setFullscreenIteration(null)}
                  aria-label="Close fullscreen preview"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#2563EB]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <iframe
              key={`${fullscreenIteration.id}-fs-${fullscreenNonce}`}
              src={fullscreenIteration.url}
              title={`${fullscreenIteration.name} fullscreen interactive view`}
              className="w-full flex-1 border-0 bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
