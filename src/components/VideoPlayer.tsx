import { useState, useCallback, useEffect } from "react";
import { convertFileSrc } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
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
  const src = convertFileSrc(video.path, "stream");

  const toggleFullscreen = useCallback(async () => {
    const win = getCurrentWindow();
    const current = await win.isFullscreen();
    await win.setFullscreen(!current);
    setIsFullscreen(!current);
  }, []);

  useEffect(() => {
    const win = getCurrentWindow();
    const checkFullscreen = async () => {
      setIsFullscreen(await win.isFullscreen());
    };
    checkFullscreen();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        win.setFullscreen(false);
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-black rounded-xl overflow-hidden flex items-center justify-center min-h-0">
        {error ? (
          <div className="text-center text-white/70 p-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-white/40" />
            <p>This format isn't supported in the built-in player.</p>
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

      <div className="flex items-center justify-between mt-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate flex-1 min-w-0">
          {video.title}
        </h2>
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={onPrev ?? undefined}
            disabled={!onPrev}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Previous"
          >
            <SkipBack className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
          <button
            onClick={onNext ?? undefined}
            disabled={!onNext}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Next"
          >
            <SkipForward className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            ) : (
              <Maximize className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
