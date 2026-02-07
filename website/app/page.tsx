import Link from "next/link";
import Image from "next/image";
import {
  FolderUp,
  LayoutGrid,
  CheckCircle2,
  PlayCircle,
  Shield,
  Star,
  Github,
  Heart,
  BookOpen,
} from "lucide-react";
import { getRepo, getReleases } from "@/lib/github";
import { DownloadSection } from "@/components/DownloadSection";

const FEATURES = [
  {
    title: "Add any folder",
    description:
      "Point to a folder of videos and Locademy organizes them into modules.",
    icon: FolderUp,
  },
  {
    title: "Auto-detect structure",
    description:
      "Supports nested folders (module per folder) and flat layouts.",
    icon: LayoutGrid,
  },
  {
    title: "Track progress",
    description:
      "Mark videos complete and see per-module and overall progress.",
    icon: CheckCircle2,
  },
  {
    title: "Built-in player",
    description:
      "Fullscreen, collapsible sidebar, and auto-advance to the next video.",
    icon: PlayCircle,
  },
  {
    title: "Fully local",
    description:
      "Everything stays on your machine. No account, no database.",
    icon: Shield,
  },
];

export default async function HomePage() {
  const [repo, releases] = await Promise.all([getRepo(), getReleases()]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <Image
              src="/icon.png"
              alt=""
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span>Locademy</span>
          </Link>
          <nav className="flex items-center gap-6">
            <a
              href="#download"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              Download
            </a>
            <a
              href="#features"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              Features
            </a>
            <Link
              href="https://github.com/swimshahriar/locademy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent dark:from-violet-500/10" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-8 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900">
                <Image
                  src="/icon.png"
                  alt="Locademy"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-5">
              Your local video library
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
              Turn any folder of videos into a clean, offline player. Courses,
              talks, recordings—no account, no database.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {repo && (
                <Link
                  href="https://github.com/swimshahriar/locademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-300/80 dark:hover:bg-slate-700/80 text-sm font-medium transition-colors"
                >
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{repo.stargazers_count.toLocaleString()} stars</span>
                </Link>
              )}
              {repo && repo.forks_count > 0 && (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {repo.forks_count} forks
                </span>
              )}
            </div>
          </div>
        </section>

        <DownloadSection releases={releases} />

        <section id="features" className="max-w-5xl mx-auto px-4 sm:px-6 py-20 scroll-mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Why Locademy
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-12">
            Simple, fast, and entirely on your machine.
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <li
                key={f.title}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 hover:border-violet-200 dark:hover:border-violet-800/50 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center mb-4 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500/20 dark:group-hover:bg-violet-500/30 transition-colors">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="flex flex-wrap items-center justify-center gap-1.5">
            <span>Made with</span>
            <Heart className="inline w-4 h-4 text-rose-500 fill-rose-500" />
            <span>by</span>
            <a
              href="https://swimshahriar.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-500 hover:underline font-medium"
            >
              Shahriar
            </a>
          </p>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a
              href="https://github.com/swimshahriar/locademy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-violet-500 hover:underline font-medium"
            >
              <Star className="w-3.5 h-3.5" />
              Star on GitHub
            </a>
            <a
              href="https://github.com/swimshahriar/locademy/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-violet-500 hover:underline font-medium"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Docs
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
