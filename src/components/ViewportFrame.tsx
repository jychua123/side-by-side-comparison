import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Maximize2, RotateCw } from 'lucide-react';
import type { IterationSpec } from '../data/iterations';

export type ViewportMode = 'desktop' | 'mobile' | 'native';

interface ViewportFrameProps {
  iteration: IterationSpec;
  viewportMode: ViewportMode;
  frameHeight: number;
  onInspectFullscreen: (iteration: IterationSpec) => void;
  highlighted?: boolean;
}

const DESKTOP_VIRTUAL_WIDTH = 1280;
const MOBILE_VIRTUAL_WIDTH = 390;

export function ViewportFrame({
  iteration,
  viewportMode,
  frameHeight,
  onInspectFullscreen,
  highlighted = false,
}: ViewportFrameProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(440);
  const [reloadNonce, setReloadNonce] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateWidth = () => {
      const nextWidth = el.clientWidth;
      if (nextWidth > 0) {
        setContainerWidth(nextWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, [viewportMode]);

  const handleReload = () => {
    setIsLoaded(false);
    setReloadNonce((prev) => prev + 1);
  };

  const scale =
    viewportMode === 'desktop'
      ? Math.min(1, containerWidth / DESKTOP_VIRTUAL_WIDTH)
      : viewportMode === 'mobile'
        ? Math.min(1, (containerWidth - 24) / MOBILE_VIRTUAL_WIDTH)
        : 1;

  const virtualWidth =
    viewportMode === 'desktop'
      ? DESKTOP_VIRTUAL_WIDTH
      : viewportMode === 'mobile'
        ? MOBILE_VIRTUAL_WIDTH
        : containerWidth;

  const virtualHeight =
    viewportMode === 'native' ? frameHeight : Math.round(frameHeight / Math.max(scale, 0.2));

  return (
    <article
      className={`flex flex-col bg-white border transition-colors duration-150 rounded-xl overflow-hidden ${
        highlighted ? 'border-[#2563EB]' : 'border-slate-200'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-start justify-between gap-3 px-4 py-3.5 border-b border-slate-200 bg-white">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 text-xs text-slate-500">
            <span className="font-mono font-medium text-slate-700 tabular-nums">
              {iteration.indexLabel}
            </span>
            <span aria-hidden="true">/</span>
            <span className="truncate">{iteration.methodology}</span>
          </div>
          <h2 className="mt-0.5 text-base font-semibold tracking-tight text-slate-900 truncate">
            {iteration.name}
          </h2>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleReload}
            aria-label={`Reload ${iteration.name}`}
            title="Reload preview"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onInspectFullscreen(iteration)}
            aria-label={`Expand ${iteration.name}`}
            title="Inspect fullscreen"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <a
            href={iteration.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${iteration.name} in new tab`}
            className="inline-flex items-center gap-1 px-2.5 h-9 rounded-lg text-xs font-medium text-[#1D4ED8] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Open</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* URL Readout Strip */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-slate-100 bg-slate-50/70 text-xs text-slate-500">
        <span className="font-mono truncate">{iteration.shortUrl}</span>
        <span className="font-mono tabular-nums text-[11px] text-slate-400 shrink-0">
          {viewportMode === 'desktop'
            ? `1280px · ${Math.round(scale * 100)}%`
            : viewportMode === 'mobile'
              ? '390px'
              : `${Math.round(containerWidth)}px`}
        </span>
      </div>

      {/* Interactive Iframe Viewport */}
      <div
        ref={stageRef}
        style={{ height: `${frameHeight}px` }}
        className={`relative w-full overflow-hidden ${
          viewportMode === 'mobile' ? 'bg-slate-100 flex justify-center py-3' : 'bg-white'
        }`}
      >
        {!isLoaded && (
          <div
            aria-live="polite"
            className="absolute inset-0 z-10 flex flex-col justify-between p-6 bg-white"
          >
            <div className="space-y-3 animate-pulse">
              <div className="h-4 w-1/3 rounded bg-slate-200" />
              <div className="h-8 w-3/4 rounded bg-slate-100" />
              <div className="h-36 w-full rounded-lg bg-slate-100" />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="h-24 rounded-lg bg-slate-100" />
                <div className="h-24 rounded-lg bg-slate-100" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Loading {iteration.shortUrl}...
            </p>
          </div>
        )}

        {viewportMode === 'mobile' ? (
          <div
            style={{
              width: `${MOBILE_VIRTUAL_WIDTH * scale}px`,
              height: `${frameHeight - 24}px`,
            }}
            className="relative rounded-lg border border-slate-300 bg-white overflow-hidden shadow-xs"
          >
            <iframe
              key={`${iteration.id}-${reloadNonce}`}
              src={iteration.url}
              title={`${iteration.name} mobile preview`}
              loading="eager"
              onLoad={() => setIsLoaded(true)}
              style={{
                width: `${MOBILE_VIRTUAL_WIDTH}px`,
                height: `${Math.round((frameHeight - 24) / Math.max(scale, 0.2))}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
              className="border-0 bg-white"
            />
          </div>
        ) : (
          <iframe
            key={`${iteration.id}-${reloadNonce}`}
            src={iteration.url}
            title={`${iteration.name} live preview`}
            loading="eager"
            onLoad={() => setIsLoaded(true)}
            style={
              viewportMode === 'desktop'
                ? {
                    width: `${virtualWidth}px`,
                    height: `${virtualHeight}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                  }
                : {
                    width: '100%',
                    height: `${frameHeight}px`,
                  }
            }
            className="border-0 bg-white block"
          />
        )}
      </div>

      {/* Concise Rationale Footer Strip */}
      <div className="px-4 py-3.5 border-t border-slate-200 bg-white">
        <p className="text-xs font-medium text-slate-900">{iteration.primaryShift}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-3">
          {iteration.summary}
        </p>
      </div>
    </article>
  );
}
