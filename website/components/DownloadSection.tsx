"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Apple, Monitor, Terminal } from "lucide-react";
import { groupAssetsByPlatform } from "@/lib/github";
import type { Release } from "@/lib/github";

interface DownloadSectionProps {
  releases: Release[];
}

export function DownloadSection({ releases }: DownloadSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const release = releases[selectedIndex] ?? null;
  const assets = release ? groupAssetsByPlatform(release.assets) : null;

  return (
    <section
      id="download"
      className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 scroll-mt-16"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 flex items-center justify-center gap-2">
          <Download className="w-7 h-7 text-violet-500" />
          Download
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          Pick your platform. Free and open source.
        </p>

        {releases.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <label
                htmlFor="version-select"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Version
              </label>
              <select
                id="version-select"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {releases.map((r, i) => (
                  <option key={r.tag_name} value={i}>
                    {r.tag_name}
                    {i === 0 ? " (latest)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {release && assets && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {assets.mac.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Apple className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        macOS
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {assets.mac.map((a) => (
                        <a
                          key={a.name}
                          href={a.browser_download_url}
                          className="block w-full text-center px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                        >
                          {a.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {assets.windows.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Windows
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {assets.windows.map((a) => (
                        <a
                          key={a.name}
                          href={a.browser_download_url}
                          className="block w-full text-center px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                        >
                          {a.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {assets.linux.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Linux
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {assets.linux.map((a) => (
                        <a
                          key={a.name}
                          href={a.browser_download_url}
                          className="block w-full text-center px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                        >
                          {a.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {release ? (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Link
                  href={release.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-violet-500 hover:underline"
                >
                  View release on GitHub
                </Link>
              </div>
            ) : null}

            {release &&
              (!assets ||
                (assets.mac.length === 0 &&
                  assets.windows.length === 0 &&
                  assets.linux.length === 0)) && (
                <p className="text-center text-slate-500 dark:text-slate-400">
                  No installers for this version.{" "}
                  <Link
                    href={release.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-500 hover:underline"
                  >
                    View release
                  </Link>
                </p>
              )}
          </>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400">
            No release yet. Build from source or check{" "}
            <Link
              href="https://github.com/swimshahriar/locademy/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-500 hover:underline font-medium"
            >
              GitHub Releases
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
