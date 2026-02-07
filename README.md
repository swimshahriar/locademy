# Locademy

<p align="center">
  <img src="app-icon.png" alt="Locademy" width="128" height="128">
</p>

A local video library for your own folders. Add any folder of videos and browse them in a clean, module-style player — use it for courses, talks, recordings, or anything else. Everything stays offline and on your machine; no account or database.

Built with [Tauri v2](https://v2.tauri.app), React, and Tailwind CSS.

![platforms](https://img.shields.io/badge/platforms-macOS%20%7C%20Windows%20%7C%20Linux-blue)
![license](https://img.shields.io/badge/license-MIT-green)

## Features

- **Add any folder** — point to a folder with video files and Locademy organizes them into modules
- **Auto-detect structure** — supports both nested folders (module per folder) and flat layouts
- **Track progress** — mark videos as completed, see per-module and overall progress
- **Built-in video player** — plays mp4/webm; fullscreen and collapsible sidebar
- **Auto-advance** — mark as complete and jump to the next video
- **Rescan** — pick up new videos added to a folder
- **System theme** — follows your OS light/dark preference
- **Fully local** — all data stays on your machine, stored as a simple JSON file

## Prerequisites

- [Node.js](https://nodejs.org) (v18+)
- [Rust](https://rustup.rs)
- Platform-specific dependencies for Tauri: [see Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

## Getting Started

```bash
# Clone the repo
git clone https://github.com/swimshahriar/locademy.git
cd locademy

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## Folder Structure

Locademy auto-detects two folder layouts:

**Nested (recommended):**
```
My Course/
├── 01 - Introduction/
│   ├── 01 - Welcome.mp4
│   └── 02 - Overview.mp4
├── 02 - Getting Started/
│   ├── 01 - Installation.mp4
│   └── 02 - First Steps.mp4
└── 03 - Advanced/
    └── 01 - Deep Dive.mp4
```

**Flat:**
```
My Course/
├── 01 - Welcome.mp4
├── 02 - Installation.mp4
└── 03 - Building Something.mp4
```

## Supported Video Formats

**Built-in player:** mp4, webm (depends on OS webview)

**System player fallback:** mp4, mkv, webm, avi, mov, wmv, flv, m4v, mpg, mpeg, 3gp, ogv, ts — any format your OS can handle

## Releases (GitHub)

Pushing a version tag builds installers and creates a draft GitHub release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The [Release](.github/workflows/release.yml) workflow runs on tags `v*`, builds for **macOS** (Intel + Apple Silicon), **Windows**, and **Linux**, then creates a draft release with the installers attached. Open the release on GitHub, edit the notes if needed, and publish.

**Required:** In the repo go to **Settings → Actions → General**, under "Workflow permissions" choose **Read and write permissions** so the workflow can create releases.

## App Icon

To replace the default icon, put your 1024x1024 PNG at the project root as `app-icon.png` and run:

```bash
npm run tauri icon app-icon.png
```

## Tech Stack

- **Tauri v2** — cross-platform desktop runtime
- **React 19** — UI framework
- **TypeScript** — type safety
- **Tailwind CSS v4** — styling
- **Rust** — backend (folder scanning, data persistence)

## Contributing

Contributions are welcome. Ways to help:

- **Bug reports and ideas** — open an [issue](https://github.com/swimshahriar/locademy/issues).
- **Code and features** — open a pull request. If you don’t have write access to this repo, fork it first, create a branch on your fork, then open a PR from your fork. Keep changes focused and add a short description.
- **Docs and README** — fix typos, clarify steps, or add examples via a PR (same fork → branch → PR flow if needed).

Development: `npm install` then `npm run tauri dev`. Match the existing code style.

## License

MIT
