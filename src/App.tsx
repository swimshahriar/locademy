import { useState, useEffect, useCallback } from "react";
import { Library } from "./pages/Library";
import { CoursePage } from "./pages/CoursePage";
import { getCourses } from "./lib/commands";
import type { Course } from "./lib/types";

type View = { page: "library" } | { page: "course"; courseId: string };

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [view, setView] = useState<View>({ page: "library" });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getCourses();
    setCourses(data);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const openCourse = (id: string) => setView({ page: "course", courseId: id });
  const goHome = () => setView({ page: "library" });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
      </div>
    );
  }

  if (view.page === "course") {
    const course = courses.find((c) => c.id === view.courseId);
    if (!course) {
      goHome();
      return null;
    }
    return <CoursePage course={course} onBack={goHome} onUpdate={refresh} />;
  }

  return (
    <Library courses={courses} onRefresh={refresh} onOpenCourse={openCourse} />
  );
}
