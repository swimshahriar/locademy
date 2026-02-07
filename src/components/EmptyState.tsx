import { FolderPlus } from "lucide-react";

interface Props {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="w-20 h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
        <FolderPlus className="w-10 h-10 text-zinc-400" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No courses yet</h2>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-center max-w-md">
        Add a folder containing your downloaded course videos to get started.
      </p>
      <button
        onClick={onAdd}
        className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
      >
        Add Course Folder
      </button>
    </div>
  );
}
