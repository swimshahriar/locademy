import { useState, useMemo, useCallback } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { VideoPlayer } from "../components/VideoPlayer";
import { ProgressBar } from "../components/ProgressBar";
import { toggleVideoComplete, rescanCourse } from "../lib/commands";
import type { Course, Video } from "../lib/types";

interface Props {
  course: Course;
  onBack: () => void;
  onUpdate: () => Promise<void>;
}

export function CoursePage({ course, onBack, onUpdate }: Props) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [rescanning, setRescanning] = useState(false);

  const allVideos = useMemo(
    () => course.modules.flatMap((m) => m.videos),
    [course.modules]
  );

  const activeVideo = activeVideoId
    ? allVideos.find((v) => v.id === activeVideoId) ?? null
    : null;

  const totalVideos = allVideos.length;
  const completedVideos = allVideos.filter((v) => v.completed).length;
  const progress = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  const currentIndex = activeVideo
    ? allVideos.findIndex((v) => v.id === activeVideo.id)
    : -1;

  const handleSelectVideo = (video: Video) => setActiveVideoId(video.id);

  const handleToggleComplete = async (videoId: string) => {
    await toggleVideoComplete(course.id, videoId);
    await onUpdate();
  };

  const handleVideoEnded = useCallback(async () => {
    if (!activeVideo) return;
    if (!activeVideo.completed) {
      await toggleVideoComplete(course.id, activeVideo.id);
      await onUpdate();
    }
    if (currentIndex < allVideos.length - 1) {
      setActiveVideoId(allVideos[currentIndex + 1].id);
    }
  }, [activeVideo, currentIndex, allVideos, course.id, onUpdate]);

  const handleNext =
    currentIndex >= 0 && currentIndex < allVideos.length - 1
      ? () => setActiveVideoId(allVideos[currentIndex + 1].id)
      : null;

  const handlePrev =
    currentIndex > 0
      ? () => setActiveVideoId(allVideos[currentIndex - 1].id)
      : null;

  const handleRescan = async () => {
    setRescanning(true);
    try {
      await rescanCourse(course.id);
      await onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setRescanning(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center gap-4 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {course.title}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-32">
              <ProgressBar value={progress} size="sm" />
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {completedVideos}/{totalVideos} completed (
              {Math.round(progress)}%)
            </span>
          </div>
        </div>
        <button
          onClick={handleRescan}
          disabled={rescanning}
          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          title="Rescan folder"
        >
          <RefreshCw
            className={`w-4 h-4 text-zinc-500 ${rescanning ? "animate-spin" : ""}`}
          />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r border-zinc-200 dark:border-zinc-800 shrink-0 overflow-hidden">
          <Sidebar
            modules={course.modules}
            activeVideoId={activeVideoId}
            onSelectVideo={handleSelectVideo}
            onToggleComplete={handleToggleComplete}
          />
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">
          {activeVideo ? (
            <VideoPlayer
              key={activeVideo.id}
              video={activeVideo}
              onEnded={handleVideoEnded}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-400 dark:text-zinc-500">
                Select a video from the sidebar to start watching
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
