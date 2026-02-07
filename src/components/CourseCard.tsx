import { Trash2, Play, FolderOpen } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import type { Course } from "../lib/types";

const GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
  "from-teal-500 to-emerald-600",
];

interface Props {
  course: Course;
  index: number;
  onOpen: () => void;
  onDelete: () => void;
}

export function CourseCard({ course, index, onOpen, onDelete }: Props) {
  const totalVideos = course.modules.reduce(
    (sum, m) => sum + m.videos.length,
    0
  );
  const completedVideos = course.modules.reduce(
    (sum, m) => sum + m.videos.filter((v) => v.completed).length,
    0
  );
  const progress = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-lg">
      <button
        className={`w-full h-32 bg-gradient-to-br ${gradient} flex items-center justify-center cursor-pointer`}
        onClick={onOpen}
      >
        <Play className="w-12 h-12 text-white/80 group-hover:text-white transition-colors" />
      </button>

      <div className="p-4">
        <button
          className="w-full text-left font-semibold text-zinc-900 dark:text-zinc-100 mb-1 truncate block hover:text-indigo-500 transition-colors cursor-pointer"
          onClick={onOpen}
          title={course.title}
        >
          {course.title}
        </button>

        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          <FolderOpen className="w-3.5 h-3.5" />
          <span>
            {course.modules.length}{" "}
            {course.modules.length === 1 ? "module" : "modules"}
          </span>
          <span>·</span>
          <span>
            {totalVideos} {totalVideos === 1 ? "video" : "videos"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar value={progress} size="sm" />
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {completedVideos}/{totalVideos} completed
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
            title="Remove course"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
