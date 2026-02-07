interface Props {
  value: number;
  size?: "sm" | "md";
}

export function ProgressBar({ value, size = "md" }: Props) {
  const height = size === "sm" ? "h-1.5" : "h-2";
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`w-full ${height} bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden`}
    >
      <div
        className={`${height} bg-indigo-500 rounded-full transition-all duration-300`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
