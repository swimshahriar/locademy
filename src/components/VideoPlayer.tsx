import { useState, useRef, useCallback, useEffect } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { open as shellOpen } from "@tauri-apps/plugin-shell";
import {
  ExternalLink,
  SkipBack,
  SkipForward,
  AlertCircle,
  Maximize,
  Minimize,
} from "lucide-react";
import type { Video } from "../lib/types";

interface Props {
  video: Video;
  onEnded: () => void;
  onNext: (() => void) | null;
  onPrev: (() => void) | null;
}

export function VideoPlayer({ video, onEnded, onNext, onPrev }: Props) {
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const src = convertFileSrc(video.path, "stream");

  const openExternal = () => {
    shellOpen(video.path).catch(console.error);
  };

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      <div
        className={`bg-black overflow-hidden flex items-center justify-center ${
          isFullscreen ? "flex-1" : "flex-1 rounded-xl min-h-0"
        }`}
      >
        {error ? (
          <div className="text-center text-white/70 p-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-white/40" />
            <p className="mb-4">
              This format isn't supported in the built-in player.
            </p>
            <button
              onClick={openExternal}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
            >
              Open in System Player
            </button>
          </div>
        ) : (
          <video
            src={src}
            controls
            autoPlay
            className="w-full h-full object-contain"
            onEnded={onEnded}
            onError={() => setError(true)}
          />
        )}
      </div>

      <div
        className={`flex items-center justify-between ${
          isFullscreen
            ? "px-4 py-2 bg-zinc-900 text-white"
            : "mt-4"
        }`}
      >
        <h2
          className={`text-lg font-semibold truncate flex-1 min-w-0 ${
            isFullscreen
              ? "text-white"
              : "text-zinc-900 dark:text-zinc-100"
          }`}
        >
          {video.title}
        </h2>
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={onPrev ?? undefined}
            disabled={!onPrev}
            className={`p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
              isFullscreen
                ? "hover:bg-white/10"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            title="Previous"
          >
            <SkipBack
              className={`w-5 h-5 ${isFullscreen ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400"}`}
            />
          </button>
          <button
            onClick={onNext ?? undefined}
            disabled={!onNext}
            className={`p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
              isFullscreen
                ? "hover:bg-white/10"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            title="Next"
          >
            <SkipForward
              className={`w-5 h-5 ${isFullscreen ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400"}`}
            />
          </button>
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg transition-colors ${
              isFullscreen
                ? "hover:bg-white/10"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5 text-zinc-300" />
            ) : (
              <Maximize className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            )}
          </button>
          <button
            onClick={openExternal}
            className={`p-2 rounded-lg transition-colors ${
              isFullscreen
                ? "hover:bg-white/10"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
            title="Open in system player"
          >
            <ExternalLink
              className={`w-5 h-5 ${isFullscreen ? "text-zinc-300" : "text-zinc-600 dark:text-zinc-400"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
