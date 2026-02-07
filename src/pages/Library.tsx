import { useState } from "react";
import { Plus } from "lucide-react";
import { open, ask } from "@tauri-apps/plugin-dialog";
import { CourseCard } from "../components/CourseCard";
import { EmptyState } from "../components/EmptyState";
import { addCourse, removeCourse } from "../lib/commands";
import type { Course } from "../lib/types";

interface Props {
  courses: Course[];
  onRefresh: () => Promise<void>;
  onOpenCourse: (id: string) => void;
}

export function Library({ courses, onRefresh, onOpenCourse }: Props) {
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    try {
      const selected = await open({
        directory: true,
        title: "Select Course Folder",
      });
      if (!selected) return;

      setAdding(true);
      await addCourse(selected);
      await onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (course: Course) => {
    const confirmed = await ask(
      `Remove "${course.title}" from your library?\nThe files on disk will not be deleted.`,
      { title: "Remove Course", kind: "warning" }
    );
    if (!confirmed) return;

    await removeCourse(course.id);
    await onRefresh();
  };

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Locademy
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Your local course library
          </p>
        </div>
        {courses.length > 0 && (
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            {adding ? "Adding..." : "Add Course"}
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {courses.length === 0 ? (
          <EmptyState onAdd={handleAdd} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                index={i}
                onOpen={() => onOpenCourse(course.id)}
                onDelete={() => handleDelete(course)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
